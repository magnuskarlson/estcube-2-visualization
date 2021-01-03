<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6" md="4">
        <ComponentHighlighting
            :model="model"
            :camera="camera"
            :scene="scene"
            @panelUpdate="setPanelUpdate"
        />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="6" md="5">
        <ViewPositions
            @viewChanged="changeViewpoint"
        />
      </v-col>
    </v-row>
    <canvas id="c"
            style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; background: url(/background.jpg) no-repeat center center; background-size: cover"></canvas>
    <Information/>
  </v-container>
</template>

<script>
import * as THREE from 'three'
import camera from '@/utils/camera'
import model from '@/utils/model'
import ComponentHighlighting from "@/components/ComponentHighlighting";
import ViewPositions from '@/components/ViewPositions';
import Information from '@/components/Information';

export default {
  name: 'Visualizer',
  components: {ComponentHighlighting, ViewPositions, Information},
  data() {
    return {
      t: THREE,
      mouseEvent: '',
      canvas: undefined,
      renderer: undefined,
      camera: camera,
      scene: undefined,
      cube: undefined,
      viewAngels: [
        {name: 'Rotating', action: 7},
        {name: 'Default', action: 0},
        {name: 'Front', action: 1},
        {name: 'Back', action: 2},
        {name: 'Left', action: 3},
        {name: 'Right', action: 4},
        {name: 'Top', action: 5},
        {name: 'Bottom', action: 6}],
      currentView: 7,
      mouseDown: false,
      mousePos: [0, 0],

      model: undefined,

      panel: undefined,
      panelUpdate: undefined,

      zoomDelta: 1.2,

      lastDelta: undefined,
      rotSpeed: undefined,
      speedDecay: 0.90
    }
  },
  async mounted() {
    this.canvas = document.querySelector("#c");

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true, logarithmicDepthBuffer: true});
    this.renderer.setSize(this.canvas.width, this.canvas.height, false);

    this.scene = new THREE.Scene();

    this.model = await model.create();

    // this.scene.attach(this.$options.mesh.childMap.esail);

    const light = new THREE.AmbientLight(0xffffff); // soft white light
    this.scene.add(light);
    this.scene.add(this.model);

    console.log(this.scene);

    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.render(this.scene, this.camera);

    this.resizeCanvasToDisplaySize();
    this.animate();

    // Rotating object with mouse
    this.canvas.addEventListener('pointerdown', this.onMouseDown, false);
    this.canvas.addEventListener('pointerup', this.onMouseUp, false);
    this.canvas.addEventListener('pointermove', this.onMouseMove, false);

    // Zooming with mousewheel
    window.addEventListener("mousewheel", this.updateCamera);

  },

  created() {
    window.addEventListener("resize", this.resizeHandler);
  },

  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
  },

  methods: {
    onMouseDown(event) {
      event.preventDefault();
      this.mousePos = [event.clientX, event.clientY];
      this.mouseEvent = event.which;
    },

    resizeHandler() {
      this.resizeCanvasToDisplaySize();
    },

    viewChanged(val) {
      this.currentView = val;
    },

    onMouseUp(event) {
      event.preventDefault();
      this.mouseEvent = 0;
      this.rotSpeed = this.lastDelta;
      this.lastDelta = undefined;
    },

    rotateModel(delta) {
      const coeff = 0.2;
      this.model.rotation.x += THREE.MathUtils.degToRad(delta[1] * coeff);
      this.model.rotation.y += THREE.MathUtils.degToRad(delta[0] * coeff);
    },

    onMouseMove(event) {
      event.preventDefault();
      const mouseDelta = [event.clientX - this.mousePos[0], event.clientY - this.mousePos[1]];
      this.mousePos = [event.clientX, event.clientY];
      if (this.mouseEvent === 2) {
        this.model.position.x += mouseDelta[0] * 0.005;
        this.model.position.y += mouseDelta[1] * -0.005;
        this.currentView = 0;
      }
      if (this.mouseEvent === 1) {
        this.currentView = 0;
        this.rotateModel(mouseDelta);
        this.lastDelta = mouseDelta;
      }
    },

    setPanelUpdate(func) {
      this.panelUpdate = func;
    },
    // Changes object rotation
    changeViewpoint(viewpoint) {
      this.currentView = viewpoint;
      this.model.setViewpoint(viewpoint);
    },

    updateCamera(event) {
      this.model.scale.multiplyScalar(event.deltaY < 0 ? this.zoomDelta : 2 - this.zoomDelta);
    },

    animate() {
      requestAnimationFrame(this.animate);

      if (this.rotSpeed) {
        this.rotateModel(this.rotSpeed);
        this.rotSpeed[0] *= this.speedDecay;
        this.rotSpeed[1] *= this.speedDecay;

        if (Math.sqrt(this.rotSpeed[0] * this.rotSpeed[0] + this.rotSpeed[1] * this.rotSpeed[1]) < 0.2) {
          this.rotSpeed = undefined;
        }
      }

      this.model.rotation.z = THREE.MathUtils.degToRad(90.0);

      switch (this.currentView) {

          // Default - rotation
        case 7: {
          if (!this.mouseDown) {
            this.model.rotation.y += THREE.MathUtils.degToRad(1.0);
            this.model.rotation.z = THREE.MathUtils.degToRad(90.0);
          }
          break;
        }
      }

      if (this.panelUpdate) {
        this.panelUpdate();
      }

      this.renderer.render(this.scene, this.camera);
    },

    resizeCanvasToDisplaySize() {
      const canvas = this.renderer.domElement;
      // look up the size the canvas is being displayed
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // adjust displayBuffer size to match
      if (canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        // update any render target sizes here
      }
    }
  }
}
</script>
