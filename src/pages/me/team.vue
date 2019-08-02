<template>
  <div class="bgc">
    <div class="nav flex-jc-around border-b">
      <div :class="{ 'selected': typenum==1 }" @click="store">创业店主({{data.storekeeper_num}})</div>
      <div :class="{ 'selected': typenum==2 }" @click="menber">天使会员({{data.angel_num}})</div>
    </div>

    <div class="mar-b-10">
      <div class="border-b pd-10" v-for="(item,index) in list">
        <div class="flex-jc-between">
          <div class="flexbox">
            <div>
              <img class="img_head" :src="item.avatar">
            </div>
            <div class="flex-column-space-between pd-tb5" style="padding-left: 10px;">
              <div>{{item.nickname}}</div>
              <div class="fsz12 fc-grey">注册时间：{{item.reg_time}}</div>
            </div>
          </div>
          <div class="fsz12 fc-grey">推广{{item.count}}人</div>
        </div>
      </div>

      <div v-show="list.length==0" class="text-c pd-15">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      typenum: 1,
      data: "",
      list: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/my/team", {
          params: {
            type: 1
          }
        })
        .then(res => {
          console.log(res.data, "register");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;
            if (resdata.data.list.length == 0) {
              this.list = [];
            } else {
              this.list = resdata.data.list;
            }

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
    },
    store() {
      this.typenum = 1;
      this.getData();
    },
    menber() {
      this.typenum = 2;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/my/team", {
          params: {
            type: 2
          }
        })
        .then(res => {
          console.log(res.data, "register");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;
            if (resdata.data.list.length == 0) {
              this.list = [];
            } else {
              this.list = resdata.data.list;
            }
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
.nav {
  padding: 10px 50px;
}
.nav > div {
  height: 30px;
  line-height: 30px;
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
  margin-right: 3px;
  color: #7f7f7f;
}
.nav .selected {
  color: #fe4171;
}
.fz15 {
  font-size: 15px;
}
.fzc13 {
  font-size: 13px;
}
.fsz12 {
  font-size: 12px;
}
.pd-10 {
  padding: 10px;
}
.pd-tb5 {
  padding: 5px 0;
}
.fsz18 {
  font-size: 18px;
}
.img_head {
  width: 50px;
  height: 50px;
}
.merchlist {
  height: 80px;
  box-shadow: 2px 3px 8px 1px rgba(222, 220, 220, 0.5);
  border-radius: 10px;
  line-height: 30px;
}

.tihuo {
  color: #fff;
  border-radius: 5px;
  padding: 5px 100px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171);
}
.detail span {
  color: #ff396e;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 13px;
}

.img_fuwu {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.img_sanjiao {
  width: 10px;
  height: 8px;
}
.img_slt {
  width: 80px;
  height: 80px;
  padding: 15px;
  border-radius: 20px;
}
.img_box img {
  margin-left: 15px;
}
.img_location {
  width: 11px;
  height: 14px;
}

.tag .dot {
  position: absolute;
  top: 0;
  right: 0;
}

.list {
  padding: 14px;
}
.model {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.model .main {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.btn {
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #fe4171 100%, #ff5491 100%);
}
.codeimg {
  width: 180px;
  height: 180px;
  margin-bottom: 20px;
}
.closeimg {
  width: 34px;
  height: 34px;
  position: absolute;
  right: 20px;
  top: 100px;
  font-size: 34px;
}
.title .closeicon {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 20px;
}
.title {
  font-size: 16px;
  padding-top: 15px;
}
</style>