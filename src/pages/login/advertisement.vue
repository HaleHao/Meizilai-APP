<template>
  <div>
    <!--<div class="gg_box">-->
    <div class="flex-jc-center bgc">
      <div class="banner bgc">
        <van-swipe :autoplay="3000" indicator-color="#FC9745">
          <van-swipe-item v-for="(item, index) in images" :key="index">
            <div class="img_box flex-center">
              <img :src="item">
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <div class="gg-txt">广告</div>
    <div class="enter_ind" @click="enter">进入商城</div>
  </div>
  <!--</div>-->
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      show: true,
      store_id: 0,
      first_user_id: 0,
      images: []
    };
  },
  created() {
    if (this.$route.query.store_id) {
      this.store_id = this.$route.query.store_id;
      this.show = false;
    }
    if (this.$route.query.first_user_id) {
      this.first_user_id = this.$route.query.first_user_id;
    }
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/ad")
        .then(res => {
          let result = res.data;
          console.log(result);
          if (result.code == 200) {
            if (result.data) {
              this.images = result.data;
            }
            Toast.clear();
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
    },

    enter() {
      this.$router.push({
            // path: "/wechatAuth",
            path: "/",
            query: {
                store_id: this.store_id,
                first_user_id: this.first_user_id
            }
        });
    }
  }
};
</script>

<style scoped>
.gg_box {
  height: 100vh;
  position: relative;
  top: 0;
  left: 0;
}

.gg_box img {
  width: 100%;
  height: 100%;
}

.gg-txt {
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 10px;
  background-color: rgba(150, 150, 150, 0.4);
  width: 50px;
  color: rgba(255, 255, 255, 0.6);
  position: absolute;
  top: 10px;
  right: 10px;
}

.enter_ind {
  background-image: linear-gradient(90deg, #ff5491, #fe4171 100%);
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 25px;
  width: 100px;
  color: #fff;
  position: absolute;
  bottom: 20px;
  left: 110px;
  box-shadow: 1px 1px 1px #292929;
}
.banner {
  width: 320px;
  height: 100vh;
}
.img_box {
  width: 320px;
  height: 100vh;
}

.img_box img {
  width: 100%;
  height: 100%;
}
</style>
