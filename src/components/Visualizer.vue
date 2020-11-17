<template>
  <v-container style="width: 100%; height: 100%; position: relative;" fluid class="pa-0">
    <ViewPositions
        @viewChanged="changeViewpoint"
        :current-view="currentView"
        :view-angels="viewAngels"
    />
    <ComponentHighlighting
        :model="model"
        :camera="camera"
        :scene="scene"
    />
    <v-row class="text-center ma-0" no-gutters>
      <v-col cols="12">
        <canvas id="c"
                style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; background: url(/background.jpg) no-repeat center center; background-size: cover"></canvas>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as THREE from 'three'
import camera from '@/utils/camera'
import model from '@/utils/model'
import ViewPositions from "@/components/ViewPositions";
import ComponentHighlighting from "@/components/ComponentHighlighting";

export default {
  name: 'Visualizer',
  components: {ComponentHighlighting, ViewPositions},
  data: () => ({
    t: THREE,
    canvas: undefined,
    renderer: undefined,
    camera: camera,
    scene: undefined,
    cube: undefined,
    viewAngels: [
      {name: 'Default', action: 0},
      {name: 'Front', action: 1},
      {name: 'Back', action: 2},
      {name: 'Left', action: 3},
      {name: 'Right', action: 4},
      {name: 'Top', action: 5},
      {name: 'Bottom', action: 6}],
    currentView: 0,
    mouseDown: false,
    mousePos: [0, 0],

    model: undefined,

    panel: undefined
  }),

  async mounted() {
    this.canvas = document.querySelector("#c");

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true});
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

  methods: {
    onMouseDown(event) {
      event.preventDefault();
      this.mousePos = [event.clientX, event.clientY];
      switch(event.which){
      case 1:
      this.mouseDownLeft = true;
      break;
      case 2:
      this.mouseDownMid = true;
      break;
      default:
    }
    },

    viewChanged(val) {
      this.currentView = val;
    },

    onMouseUp(event) {
      event.preventDefault();
      this.mouseDownLeft = false;
      this.mouseDownMid = false;
    },

    onMouseMove(event) {
      event.preventDefault();
      const mouseDelta = [event.clientX - this.mousePos[0], event.clientY - this.mousePos[1]];
      this.mousePos = [event.clientX, event.clientY];
      if (this.mouseDownMid) {
        this.model.position.x += mouseDelta[0] * 0.005;
        this.model.position.y += mouseDelta[1] * -0.005;
      }
      if (this.mouseDownLeft) {
        this.model.rotation.x += THREE.MathUtils.degToRad(mouseDelta[1]);
        this.model.rotation.y += THREE.MathUtils.degToRad(mouseDelta[0]);
      }
    },

    // Changes object rotation
    changeViewpoint(viewpoint) {

      this.currentView = viewpoint;

      this.model.rotation.x = 0.0;
      switch (viewpoint) {
          // Front
        case 1: {
          this.model.rotation.y = THREE.MathUtils.degToRad(90.0);
          this.model.rotation.z = THREE.MathUtils.degToRad(90.0);
          break;
        }

          // Back
        case 2: {
          this.model.rotation.y = THREE.MathUtils.degToRad(270.0);
          this.model.rotation.z = THREE.MathUtils.degToRad(90.0);
          break;
        }

          // Left
        case 3: {
          this.model.rotation.y = THREE.MathUtils.degToRad(0.0);
          this.model.rotation.z = THREE.MathUtils.degToRad(90.0);
          break;
        }

          // Right
        case 4: {
          this.model.rotation.y = THREE.MathUtils.degToRad(180.0);
          this.model.rotation.z = THREE.MathUtils.degToRad(90.0);
          break;
        }

          // Top
        case 5: {
          this.model.rotation.y = THREE.MathUtils.degToRad(270.0);
          this.model.rotation.z = THREE.MathUtils.degToRad(0.0);
          break;
        }

          // Bottom
        case 6: {
          this.model.rotation.y = THREE.MathUtils.degToRad(90.0);
          this.model.rotation.z = THREE.MathUtils.degToRad(0.0);
          break;
        }
      }
    },

    updateCamera(event) {
      const temp = this.camera.fov + event.deltaY / 50;
      if (temp > 0 && temp < 180) {
        this.camera.fov = temp;
        camera.updateProjectionMatrix();
      }
    },

    animate() {
      requestAnimationFrame(this.animate);
      this.model.rotation.z = THREE.MathUtils.degToRad(90.0);

      switch (this.currentView) {

          // Default - rotation
        case 0: {
          if (!this.mouseDown) {
            this.model.rotation.y += THREE.MathUtils.degToRad(1.0);
            this.model.rotation.z = THREE.MathUtils.degToRad(90.0);
          }
          break;
        }
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
