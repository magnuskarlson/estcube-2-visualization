<template>
  <v-row no-gutters style="text-align: end">
    <v-col>
      <v-row>
        <v-col class="pt-0 pb-0" style="color: white; z-index: 1; font-size: 20px">
          Change orientation
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-tooltip bottom v-for="btn in btns" :key="btn.id">
            <template v-slot:activator="{ on, attrs }">
              <v-img :src="btn.img"
                     v-bind="attrs"
                     v-on="on"
                     width="64px"
                     height="64px"
                     style="z-index: 1; display: inline-block; cursor: pointer;"
                     @click="changeView(btn.action)"
              ></v-img>
            </template>
            <span>{{ btn.text }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
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

  methods:{
    changeView(view){
      this.$emit("viewChanged", view);
    }
  },

  data() {
    return {
      view: this.currentView,
      btns: [
        {img: require('../assets/views/default2.png'), text: 'Rotate', action: 7},
        {img: require('../assets/views/front.png'), text: 'Front', action: 1},
        {img: require('../assets/views/back.png'), text: 'Back', action: 2},
        {img: require('../assets/views/left.png'), text: 'Left', action: 3},
        {img: require('../assets/views/right.png'), text: 'Right', action: 4},
        {img: require('../assets/views/top.png'), text: 'Top', action: 5},
        {img: require('../assets/views/bottom.png'), text: 'Bottom', action: 6},
      ]
    }
  }
}
</script>
