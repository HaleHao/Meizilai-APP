<template>
  <div class="bgc">
    <div class="text-c pd-15">深圳魅资莱美容馆</div>

    <div class="storeimglist" v-for="(item,index) in 9">
      <img class="img_store" src="../../assets/photo/banner.png">
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style scoped>
.more {
  font-size: 12px;
  color: #979797;
}
.storeimglist {
  display: inline-block;
  width: 143px;
  height: 120px;
  margin: 0 0 10px 10px;
}
.img_store {
  border-radius: 10px;
}
</style>
