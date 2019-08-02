<template>
  <div>
    <img class="img_poster" :src="data">
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      data: ""
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/my/poster")
        .then(res => {
          console.log(res.data, "poster");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;
            Toast.clear();
          } else if (resdata.code == 40005) {
            this.$router.push({
              path: "/"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
    }
  }
};
</script>
<style scoped>
.img_poster {
  width: 320px;
  height: 100vh;
  overflow: hidden;
}
</style>


