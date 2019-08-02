<template>
  <div class="text-c pd-15">
    <div class="img-box">
      <img :src="img">
    </div>
    <div class="btn_box border-fen" @click="reSet">返回</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      img: ""
    };
  },
  created() {
    this.img = this.$route.query.img;
    console.log(this.img);
  },
  methods: {
    reSet() {
      this.$router.back(-1);
    }
  }
};
</script>
<style scoped>
.img-box img {
  width: 100%;
  height: 100%;
}
.btn_box {
  margin-top: 20px;
  font-size: 13px;
  text-align: center;
  color: #fff;
  border-radius: 20px;
  padding: 10px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171);
}
</style>

