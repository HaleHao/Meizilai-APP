<template>
  <div>
    <div v-for="(item,index) in stalist" :key="index" class="bgc">
      <div class="flexbox flex-align-items">
        <img class="img_header" :src="item.avatar">
        <div class="flex-jc-between right flex-align-items">
          <div>
            <div>{{item.nickname}}</div>
            <div class="flex-align-items pd-t" v-show="index==0">
              <img class="tx" src="../../assets/photo/tx-one.png">
              <span class="one">第一名</span>
            </div>
            <div class="flex-align-items pd-t" v-show="index==1">
              <img class="tx" src="../../assets/photo/tx-two.png">
              <span class="two">第二名</span>
            </div>
            <div class="flex-align-items pd-t" v-show="index==2">
              <img class="tx" src="../../assets/photo/tx-three.png">
              <span class="three">第三名</span>
            </div>
            <div v-show="index>2" class="pd-t">第{{index+1}}名</div>
          </div>
          <div style="padding-right: 15px;">{{item.sign_num}}天</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      stalist: []
    };
  },
  created() {
    this.sign();
  },
  methods: {
    sign() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/sign/rank")
        .then(res => {
          console.log(res.data, "sign/rank");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.stalist = resdata.data;
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
.pd-t {
  padding-top: 5px;
}
.img_header {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: 15px;
}
.right {
  width: 250px;
  height: 40px;
  padding: 10px 0;
  margin-left: 15px;
  border-bottom: 1px solid #f0f0f0;
}
.tx {
  width: 14px;
  height: 18px;
  margin-right: 5px;
}

.one {
  font-size: 15px;
  color: #ff8400;
}
.two {
  font-size: 15px;
  color: #31c8bf;
}
.three {
  font-size: 15px;
  color: #647877;
}
</style>
