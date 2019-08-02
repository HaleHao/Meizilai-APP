<template>
  <div>
    <div class="bgc pd-15">
      <div class="text-c mar-b-10" style="font-size: 18px; font-weight: 600;">
        <!-- <img class="img_store" src="../../assets/photo/banner.png"> -->
        {{data.company_name}}
      </div>
      <div class="store-intro">
        <div v-html="data.company_description"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return { data: "" };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/introduction")
        .then(res => {
          console.log(res.data, "introduction");
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
  width: 320px;
  height: 160px;
}

.store-intro p {
  margin-bottom: 10px;
}
</style>
