<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">

        <canvas id="c"></canvas>

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
      scene: undefined
    }),

    mounted() {
      this.canvas = document.querySelector("#c");
      this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});

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
      const cube = new THREE.Mesh(geometry, material);
      this.scene.add(cube);
      this.renderer.render(this.scene, this.camera);
    }
  }
</script>
