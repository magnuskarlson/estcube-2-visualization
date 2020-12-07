<template>
    <v-container style="width: 100%; height: 100%; position: relative;" fluid class="pa-0" fill-height>
      <v-row class="text-center ma-0" no-gutters>
        <v-col cols="12">
    <a-scene embedded arjs>
      <!-- define your markers -->
      <a-marker preset='hiro'>
        <!-- here define the content to display on top of the marker -->
        <a-box position='0 0.5 0' material='color: red;'></a-box>
      </a-marker>
      <!-- define a simple camera -->
      <a-entity camera></a-entity>
    </a-scene>
  </v-col>
</v-row>
  </v-container>
</template>

<script>

export default {
  name: 'ArVisualizer',
  components: {},
  data: () => ({
  }),

  mounted() {

  },

  methods: {
        // update any render target sizes here
      }
    }
</script>
