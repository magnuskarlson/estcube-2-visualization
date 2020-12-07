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
    </v-app-bar>

    <v-main v-if="this.isAR">
      <ArVisualizer/>
      </v-main>
      <v-main v-else>
      <Visualizer/>
    </v-main>
  </v-app>
  <v-btn color="secondary" v-on:click="ArMode" fixed right bottom>AR</v-btn>
</template>

<script>
import Visualizer from './components/Visualizer';
import ArVisualizer from './components/ArVisualizer';
export default {
  name: 'App',

  components: {
    Visualizer,
    ArVisualizer
  },


  created() {
    document.title = 'ESTCube - 2 Visualization';
  },

  data: () => ({
    isAR: false,
    //
  }),

  methods: {
    ArMode(){
      if (this.isAR)
        this.isAR = false;
      else
        this.isAR = true;

    }
  },



};
</script>
