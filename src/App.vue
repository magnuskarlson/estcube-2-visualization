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

      <div style="font-size: 24px" class="ml-4">
        ESTCube-2
      </div>
    </v-app-bar>
    <v-main>
     <Visualizer/>
    </v-main>
  </v-app>
</template>

<script>
import Visualizer from './components/Visualizer';
export default {
  name: 'App',
  components: {
    Visualizer
  },
  created() {
    document.title = 'ESTCube - 2 Visualization';
  },
  data(){
    return {
    }
  },
  methods:{
  }
}
</script>
<style>
</style>
