<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://www.estcube.eu/sites/all/themes/twitter_bootstrap/logo.png"
          width="40"
        />
      </div>
      <v-btn color="success" @click="ARViewOpen = !ARViewOpen">{{ARViewOpen ? 'Back' : 'AR'}}</v-btn>
    </v-app-bar>
    <v-main>
     <ArVisualizer v-if="ARViewOpen"/>
     <Visualizer v-else />
    </v-main>
  </v-app>
</template>

<script>
import Visualizer from './components/Visualizer';
import ArVisualizer from './components/ArVisualizer';
export default {
  name: 'App',
  components: {
    Visualizer,
    ArVisualizer,
  },
  created() {
    document.title = 'ESTCube - 2 Visualization';
  },
  data(){
    return {
      ARViewOpen: false
    }
  },
  methods:{
  }
}
</script>
<style>
</style>
