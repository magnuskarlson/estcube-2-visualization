<template>
  <v-select
    style="z-index: 1; background: white;"
    filled
    v-model="view"
    hide-details
    :items="viewAngels"
    item-text="name"
    item-value="action"
    label="Viewpoint"
  ></v-select>
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
    },

    currentView() {
      if (this.currentView !== this.view) {
        this.view = this.currentView;
      }
    }
  }
}
</script>
