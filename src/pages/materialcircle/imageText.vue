<template>
  <div class="bgc pd-15">
    <div class="title">{{data.title}}</div>

    <div class="flex-align-items pd-tb-15">
      <img class="img_logo border" src="../../assets/photo/yanzhengma.png">
      <span class="fz12">魅资莱</span>
      <span class="fc-grey fz12">{{data.created_at}}</span>
    </div>

    <div class="mar-b-10">
      <img class="cover_url" :src="data.cover_url">
    </div>
    <div v-html="data.description"></div>
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
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/graphic/detail", {
          params: {
            graphic_id: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res.data, "graphic/detail");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;
            Toast.clear();
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
.fz12 {
  font-size: 12px;
}
.title {
  font-size: 17px;
  font-weight: 600;
}
.img_logo {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  margin-right: 10px;
}
.cover_url {
  width: 100%;
  height: 170px;
  border-radius: 5px;
}
</style>
