<template>
  <v-row class="pa-5" no-gutters>
    <v-col md="3">
      <v-card>
      <v-select
          style="z-index: 1; background: white"
          v-model="view"
          class="pt-4 pa-2 pb-0"
          hide-details
          :items="viewAngels"
          item-text="name"
          item-value="action"
          label="Viewpoint"
      ></v-select>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'ViewPositions',
  props: {
    currentView: {},
    viewAngels: {}
  },

  data() {
    return {
      view: this.currentView
    }
  },

  watch: {
    view() {
      this.$emit("viewChanged", this.view);
    }
  }
}
</script>