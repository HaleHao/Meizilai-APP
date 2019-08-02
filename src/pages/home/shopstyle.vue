<template>
  <div>
    <div class="bgc mar-b-10" v-for="(item,index) in storelist">
      <div class="flex-jc-between pd-15">
        <div>{{item.name}}</div>
        <!-- <div class="stylemore">
          <router-link :to="{path:'/shopmore',query: {name: item.id}}" class="flex-align-items">
            <span>查看更多</span>
            <img class="img_right" src="../../assets/photo/right.png">
          </router-link>
        </div>-->
      </div>

      <div class="storeimglist" v-for="(items,indexs) in item.images">
        <img class="img_store" :src="items.img_url">
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      storelist: []
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios.get(this.API + "/api/v1/store/style").then(res => {
        console.log(res.data, "store/style");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.storelist = resdata.data;
          Toast.clear();
        } else if (resdata.code == 40005) {
          this.$router.push({
            path: "/"
          });
        } else {
          Toast(resdata.msg);
          Toast.clear();
        }
      });
    }
  }
};
</script>
<style>
</style>

<style scoped>
.stylemore {
  font-size: 12px;
  color: #979797;
}
.img_right {
  width: 6px;
  height: 10px;
  padding-left: 5px;
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
