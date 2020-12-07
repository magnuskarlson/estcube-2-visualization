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
    <v-main>
     <ArVisualizer v-if="this.isAR"/>
     <Visualizer v-else />
     <v-btn v-if="this.isAR" btn color="primary" v-on:click="clickARbtn" dark fixed left bottom style="z-index: 9999">Back</v-btn>
     <v-btn v-else btn color="primary" v-on:click="clickARbtn" dark fixed left bottom style="z-index: 9999">AR</v-btn>
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

  data: () => ({
    isAR : false,
    //
  }),

  methods:{
    clickARbtn(){
      if (this.isAR)
      {
      document.querySelectorAll('video, #arjsDebugUIContainer, .a-scene').forEach(el => el.remove());
      this.isAR = false;
      document.querySelector(".v-main").style.marginTop = "268.5px";
      document.querySelector(".v-main").style.minHeight = "100vh";

      //document.querySelectorAll('#arvisualizer').forEach(el => el.remove());
      }
      else
      {
      this.isAR = true;
      document.querySelector(".v-main").style.marginTop = "0px";
      //document.querySelector("video").style.display = "block";
    }
    }

  }

};
</script>
