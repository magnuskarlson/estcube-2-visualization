<template>
  <v-container style="width: 100%; height: 100%" fluid class="pa-0">
    <v-row class="pa-5" no-gutters>
      <v-col>
        <v-btn style="z-index: 1" class="mr-2" v-for="btn in buttons" :key="btn.action" @click="currentView = btn.action" small depressed color="primary">{{ btn.name }}</v-btn>
      </v-col>
    </v-row>
    <v-row class="text-center ma-0" no-gutters>
      <v-col cols="12">

        <canvas id="c" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0"></canvas>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as THREE from 'three'
import camera from '@/utils/camera'
import model from '@/utils/model'

export default {
  name: 'Visualizer',

  data: () => ({
    t: THREE,
    canvas: undefined,
    renderer: undefined,
    camera: camera,
    scene: undefined,
    cube: undefined,
    buttons: [{name: 'Default', action: 0}, {name: 'Front', action: 1}, {name: 'Back', action: 2}, {name: 'Left', action: 3}, {name: 'Right', action: 4}, {name: 'Top', action: 5}, {name: 'Bottom', action: 6}],
    currentView: 0
  }),

  async mounted() {
    this.canvas = document.querySelector("#c");

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.setSize(this.canvas.width, this.canvas.height, false);

    this.scene = new THREE.Scene();

    // const boxWidth = 1;
    // const boxHeight = 1;
    // const boxDepth = 1;
    // const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    // const material = new THREE.MeshBasicMaterial({color: 0x44aa88});

    // this.cube.material = material;

    // this.setMaterialRecursive(material, this.$options.mesh);

    this.$options.mesh = await model.create()

    const light = new THREE.AmbientLight( 0xffffff ); // soft white light
    this.scene.add( light );
    this.scene.add(this.$options.mesh);
    this.renderer.setClearColor( 0xffffff, 1 );
    this.renderer.render(this.scene, this.camera);

    this.resizeCanvasToDisplaySize();
    this.animate();
  },

  mesh: undefined,

  methods: {
    animate() {
      requestAnimationFrame(this.animate);
      this.$options.mesh.rotation.z = THREE.MathUtils.degToRad(90.0);

      switch(this.currentView){
          // Default - rotation
        case 0:{
          this.$options.mesh.rotation.y += THREE.MathUtils.degToRad(1.0);
          break;
        }

          // Front
        case 1:{
          this.$options.mesh.rotation.y = THREE.MathUtils.degToRad(90.0);
          break;
        }

          // Back
        case 2:{
          this.$options.mesh.rotation.y = THREE.MathUtils.degToRad(270.0);
          break;
        }

          // Left
        case 3:{
          this.$options.mesh.rotation.y = THREE.MathUtils.degToRad(0.0);
          break;
        }

        // Right
        case 4:{
          this.$options.mesh.rotation.y = THREE.MathUtils.degToRad(180.0);
          break;
        }

        // Top
        case 5:{
          this.$options.mesh.rotation.y = THREE.MathUtils.degToRad(270.0);
          this.$options.mesh.rotation.z = THREE.MathUtils.degToRad(0.0);
          break;
        }

        // Bottom
        case 6:{
          this.$options.mesh.rotation.y = THREE.MathUtils.degToRad(90.0);
          this.$options.mesh.rotation.z = THREE.MathUtils.degToRad(0.0);
          break;
        }
      }
      this.renderer.render(this.scene, this.camera);
    },

    setMaterialRecursive(material, mesh) {

      mesh.material = material;

      for (const child of mesh.children) {
        this.setMaterialRecursive(material, child);
      }
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
