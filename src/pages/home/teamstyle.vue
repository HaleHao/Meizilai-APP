<template>
  <div>
    <div class="bgc pd-15">
      <div class="mar-b-10">{{data.name}}</div>
      <div v-html="data.description"></div>
    </div>
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
        .get(this.API + "/api/v1/mien")
        .then(res => {
          console.log(res.data, "mien");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;
            Toast.clear();
          } else if (resdata.code == 40005) {
            this.$router.push({
              path: "/"
            });
          } else {
            Toast(resdata.msg);
            Toast.clear();
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
</style>
