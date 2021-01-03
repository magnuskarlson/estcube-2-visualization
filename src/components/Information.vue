<template>
  <div style="position: absolute; bottom: 10px; right: 10px;">
    <div style="display: flex; align-items: center;"
         v-for="info in infos"
         :key="info.id"
    >
      <img :src="info.img" style="width: 32px; height: 32px;"/>
      <span style="color: #383838">{{ info.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Information",
  data(){
    return {
      infos: [
        {img: require('../assets/info/lmb.png'), text: 'For rotating model.'},
        {img: require('../assets/info/mmb.png'), text: 'For zooming in to the model.'},
        {img: require('../assets/info/mmb.png'), text: 'For panning or moving around the model.'},
      ]
    }
  }
}
</script>

<style scoped>

</style>
