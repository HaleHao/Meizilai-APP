<template>
  <div>
    <div class="bgc">
      <div class="pd-15 name" style>{{data.name}}</div>
      <div class="flex-jc-center">
        <img class="img_store" :src="data.cover_url">
      </div>
      <div class="pd-15 store-intro" v-html="data.description"></div>
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
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/merchant/detail", {
          params: { merchant_id: this.$route.query.id }
        })
        .then(res => {
          console.log(res.data, "merchant");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;

            Toast.clear();
          } else if (resdata.code == 40005 || resdata.code == 20001) {
            window.localStorage.removeItem("access_token");
            this.$router.push({
              path: "/wechatAuth",
              query: {
                store_id: JSON.parse(window.localStorage.getItem("store_id")),
                first_user_id: JSON.parse(
                  window.localStorage.getItem("first_user_id")
                )
              }
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
.img_store {
  width: 295px;
  height: 160px;
  border-radius: 10px;
}

.name {
  font-size: 16px;
  font-weight: 600;
}
</style>
