<template>
  <div id="app" class="fsz">
    <router-view v-wechat-title="$route.meta.title"></router-view>

    <div class="nav bgc flexbox fc-grey" v-if="navshow">
      <div>
        <router-link to="/">
          <div class="img" v-if="selected=='index'">
            <img src="./assets/tab/indexs.png">
          </div>
          <div class="img" v-else>
            <img src="./assets/tab/index.png">
          </div>
          <p :class="{ 'fc-fen': selected=='index' }">首页</p>
        </router-link>
      </div>
      <div>
        <router-link to="/classify">
          <div class="classify" v-if="selected=='classify'">
            <img src="./assets/tab/classifys.png">
          </div>
          <div class="img" v-else>
            <img src="./assets/tab/classify.png">
          </div>
          <p :class="{ 'fc-fen': selected=='classify' }">分类</p>
        </router-link>
      </div>

      <div>
        <router-link to="/materialcircle">
          <div class="img" v-if="selected=='materialcircle'">
            <img src="./assets/tab/sources.png">
          </div>
          <div class="img" v-else>
            <img src="./assets/tab/source.png">
          </div>
          <p :class="{ 'fc-fen': selected=='materialcircle' }">素材圈</p>
        </router-link>
      </div>
      <div>
        <router-link to="/shop">
          <div class="shops" v-if="selected=='shop'">
            <img src="./assets/tab/shops.png">
          </div>
          <div class="img" v-else>
            <img src="./assets/tab/shop.png">
          </div>
          <p :class="{ 'fc-fen': selected=='shop' }">全国联锁</p>
        </router-link>
      </div>
      <div>
        <router-link to="/me">
          <div class="img" v-if="selected=='me'">
            <img src="./assets/tab/mys.png">
          </div>
          <div class="img" v-else>
            <img src="./assets/tab/my.png">
          </div>
          <p :class="{ 'fc-fen': selected=='me' }">我的</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import VConsole from "vconsole/dist/vconsole.min.js";

export default {
  data() {
    return {};
  },

  computed: {
    selected() {
      if (this.$route.path === "/") {
        return "index";
      }
      if (this.$route.path === "/classify") {
        return "classify";
      }
      if (this.$route.path === "/shop") {
        return "shop";
      }
      if (this.$route.path === "/materialcircle") {
        return "materialcircle";
      }
      if (this.$route.path === "/me") {
        return "me";
      }
    },
    navshow() {
      let url = this.$route.path;

      let urlarr = ["/", "/classify", "/shop", "/materialcircle", "/me"];
      if (urlarr.includes(url)) {
        return true;
      }
    }
  },
  created() {
    // let vConsole = new VConsole()
  },
  methods: {}
};
</script>

<style scoped>
.nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 5;
  border-top: 1px solid #f2f2f2;
}
.nav > div {
  flex: 1;
  text-align: center;
  font-size: 10px;
  box-sizing: border-box;
  padding: 5px;
}
.nav .img {
  display: inline-block;
  width: 22px;
  height: 22px;
}
.shops,
.classify {
  display: inline-block;
  width: 22px;
  height: 22px;
}
</style>


<style>
.fsz {
  font-size: 13px;
}
.mar-bottom {
  margin-bottom: 50px;
}
.mar-b-10 {
  margin-bottom: 10px;
}
.pd-15 {
  padding: 15px;
}
.pd-lr-15 {
  padding: 0 15px;
}
.pd-tb-15 {
  padding: 15px 0;
}
</style>
