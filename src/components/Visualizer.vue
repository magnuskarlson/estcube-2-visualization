<template>
  <v-container style="width: 100%; height: 100%; position: relative;" fluid class="pa-0">
    <v-row justify="space-between" class="pa-5" no-gutters>
      <v-col cols="5" md="2">
        <ComponentHighlighting
            :model="model"
            :camera="camera"
            :scene="scene"
            @panelUpdate="setPanelUpdate"
        />
      </v-col>
    </v-row>
    <v-row justify="space-between" class="pa-5" no-gutters>
    <v-col cols="5" md="2">
   <v-btn-toggle v-model="toggle_exclusive">
    <v-tooltip bottom style="z-index:1;">
    <template v-slot:activator="{ on, attrs }">
    <v-btn depressed style="z-index:1;" x-large v-bind="attrs" v-on="on" @click="currentView == 1 ? changeViewpoint(2) : changeViewpoint(1)">
      <v-img lazy-src='frontBack.ico' max-height="50" max-width="50" src='frontBack.ico'></v-img>
    </v-btn>
  </template>
  <span>{{currentView == 1 ? 'Back' : 'Front'}}</span>
</v-tooltip>
<v-tooltip bottom style="z-index:1;">
<template v-slot:activator="{ on, attrs }">
    <v-btn depressed style="z-index:1;" x-large v-bind="attrs" v-on="on" @click="currentView == 5 ? changeViewpoint(6) : changeViewpoint(5)">
      <v-img lazy-src='topBottom.ico' max-height="50" max-width="50" src='topBottom.ico'></v-img>
    </v-btn>
  </template>
  <span>{{currentView == 5 ? 'Bottom' : 'Top'}}</span>
</v-tooltip>
<v-tooltip bottom style="z-index:1;">
<template v-slot:activator="{ on, attrs }">
   <v-btn depressed style="z-index:1;" x-large v-bind="attrs" v-on="on" @click="currentView == 3 ? changeViewpoint(4) : changeViewpoint(3)">
     <v-img lazy-src='leftRight.ico' max-height="50" max-width="50" src='leftRight.ico'></v-img>
   </v-btn>
 </template>
  <span>{{currentView == 3 ? 'Right' : 'Left'}}</span>
</v-tooltip>
<v-tooltip bottom style="z-index:1;">
<template v-slot:activator="{ on, attrs }">
   <v-btn depressed style="z-index:1;" x-large v-bind="attrs" v-on="on" @click="viewChanged(0)">
     <v-img lazy-src='default.ico' max-height="50" max-width="50" src='default.ico'></v-img>
   </v-btn>
 </template>
 <span>Default</span>
</v-tooltip>
 </v-btn-toggle>
    </v-col>
    </v-row>
    <v-row no-gutters>
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
import ComponentHighlighting from "@/components/ComponentHighlighting";

export default {
  name: 'Visualizer',
  components: {ComponentHighlighting},
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
      panelUpdate: undefined
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
        this.model.rotation.x += THREE.MathUtils.degToRad(mouseDelta[1]);
        this.model.rotation.y += THREE.MathUtils.degToRad(mouseDelta[0]);
        this.currentView = 0;
      }


    },

    setPanelUpdate(func){
      this.panelUpdate = func;
    },
    // Changes object rotation
    changeViewpoint(viewpoint) {
      this.currentView = viewpoint;
      this.model.setViewpoint(viewpoint);
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
