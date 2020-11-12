<template>
  <v-container style="width: 100%; height: 100%" fluid class="pa-0">
    <v-row class="text-center ma-0" style="width: 100%; height: 100%" no-gutters>
      <v-col cols="12" style="width: 100%; height: 100%">

        <canvas id="c" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0"></canvas>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as THREE from 'three'

export default {
  name: 'Visualizer',

  data: () => ({
    t: THREE,
    canvas: undefined,
    renderer: undefined,
    camera: undefined,
    scene: undefined,
    cube: undefined
  }),

  mounted() {
    this.canvas = document.querySelector("#c");

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.setSize(this.canvas.width, this.canvas.height, false);


    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 2;

    this.scene = new THREE.Scene();

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.renderer.render(this.scene, this.camera);

    this.resizeCanvasToDisplaySize();
    this.animate();
  },

  methods: {
    animate() {
      requestAnimationFrame(this.animate);

      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.02;

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
