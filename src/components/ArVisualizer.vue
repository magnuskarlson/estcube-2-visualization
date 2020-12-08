<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <!-- workaround, because ar.js doesn't want to work with vue -->
        <!-- public/ar.html -->
        <iframe :src="`ar.html`"></iframe>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ArVisualizer'
}
</script>
<style scoped>
iframe{
  width: 100%;
  height: calc(100vh - 200px);
  border: none;
}
</style>
