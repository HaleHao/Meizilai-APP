<template>
  <div class="text-c pd-15">
    <div class="pd-15">
      <img class="img_cuowutish" src="../../assets/photo/cuowutish.png">
    </div>
    <div class="fz12">您不是该店的共享店主，暂无数据</div>

    <div class="btn_box border-fen" @click="reSet">返回</div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    reSet() {
      this.$router.back(-1);
    }
  }
};
</script>
<style scoped>
.img_cuowutish {
  width: 60px;
  height: 35px;
}
.fz12 {
  font-size: 12px;
}
.btn_box {
  margin-top: 60px;
  font-size: 13px;
  text-align: center;
  color: #fff;
  border-radius: 20px;
  padding: 10px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171);
}
</style>


