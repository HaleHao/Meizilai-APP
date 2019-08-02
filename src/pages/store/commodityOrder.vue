<template>
  <div>
    <div class="nav flex-jc-around">
      <div :class="{ 'selected': typenum==7 }" @click="waitingOrders">待接单</div>
      <div :class="{ 'selected': typenum==2 }" @click="beServed">待送达</div>
      <div :class="{ 'selected': typenum==3 }" @click="selfMention">待自提</div>
      <div :class="{ 'selected': typenum==5 }" @click="complete">已完成</div>
      <div :class="{ 'selected': typenum==8 }" @click="afterSale">售后/退款</div>
    </div>

    <div class="mar-b-10">
      <div v-show="gorderlist.length==0" class="text-c">暂无此订单状态的订单</div>
      <div class="pd-lr-15 mar-b-10" v-for="(item,index) in gorderlist">
        <div class="fuwu_box bgc">
          <div class="fuwutitle border-b flex-jc-between pd-15">
            <div class="fsz18">#{{item.order_id}}</div>
            <div v-show="typenum==7">待店铺接单</div>
            <div v-show="typenum==2">待客户确认收货</div>
            <div v-show="typenum==3">待客户自提</div>
            <div v-show="typenum==5">客户已确认收货</div>
            <!-- 售后/退款 包括用户取消、店铺拒绝 -->
            <div v-show="item.order_status==6">客户已取消</div>
            <div v-show="item.order_status==8">已拒绝</div>
          </div>

          <div class="pd-trb0">
            <span>用户姓名:</span>
            <span>{{item.username}}</span>
          </div>

          <div class="pd-trb0 flex-jc-between flex-align-items" @click="isshow(item.goods)">
            <div>
              <span>商品信息:</span>
              <span v-for="(items,ind) in item.goods" v-if="ind==0">
                <span class="fc-grey">{{items.goods_name}}</span>
                <span class="fc-grey">,{{items.goods_num}}件</span>
              </span>
            </div>
            <div v-show="item.goods.length!=0">
              <img class="img_sanjiao" src="../../assets/photo/icon-triangle.png">
            </div>
          </div>

          <div class="pd-trb0">
            <span>客户已支付:</span>
            <span class="fz15 fc-fen">¥{{item.total_price}}</span>
          </div>

          <div class="pd-trb0 flexbox" v-show="typenum==2||typenum==5&&item.delivery_method==1">
            <div class="add-l">收货地址:</div>
            <div class="fsz12 fc-grey add-r">{{item.address}}</div>
          </div>

          <div class="pd-trb0" v-show="typenum==8">
            <span>取消订单原因:</span>
            <span class="fsz12 fc-grey">{{item.cancel_remark}}</span>
          </div>
          <div class="pd-trb0">
            <span>订单编号:</span>
            <span class="fsz12 fc-grey">{{item.order_sn}}</span>
          </div>
          <div class="pd-trb0">
            <div>
              <span>下单时间:</span>
              <span class="fc-grey fsz12">{{item.submit_time}}</span>
            </div>
          </div>

          <div class="flex-jc-around btn_box" v-show="typenum==7">
            <!-- <div class="reject" @click="onshowmodel">拒绝接单</div> -->
            <div class="reject" @click="reject(item.order_id)">拒绝接单</div>
            <div class="agree border-fen" @click="agree(item.order_id)">点击接单</div>
          </div>
          <div class="flex-jc-around btn_box" v-show="typenum==3">
            <div class="tihuo" @click="claim(item.order_id)">客户已取货</div>
          </div>
        </div>
      </div>
    </div>

    <div style="height:40px"></div>
    <van-popup v-model="show">
      <div class="pd-15 popup-box" id="content">
        <div class="flex-align-items" v-for="items in goods">
          <img class="circle-img" src="../../assets/photo/circle.png">
          <span style="fc-grey">{{items.goods_name}}</span>
          <span style="fc-grey">,{{items.goods_num}}件</span>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="showmodel" position="bottom" :close-on-click-overlay="false">
      <div class="text-c position title">
        拒绝接单
        <div class="closeicon">
          <van-icon name="close" @click="onshowmodel"/>
        </div>
      </div>
      <div class="pd-lr-15">
        <div style="padding:20px 0">请选择拒绝的原因(必选):</div>
        <van-radio-group v-model="radio">
          <div
            class="flex-jc-between mar-b-10"
            @click="radio = index"
            v-for="(item,index) in canceltext"
            :key="index"
          >
            <span>{{index+1}}、{{item.text}}</span>
            <van-radio :name="index" checked-color="#FE4171"></van-radio>
          </div>
        </van-radio-group>
      </div>
      <div class="pd-15" @click="onshowmodel">
        <div class="btn text-c">提交</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      typenum: 7,
      radio: 0,
      gorderlist: [],
      goods: [],
      goods_name: "",
      goods_num: "",
      store_id: "",
      show: false,
      canceltext: [
        { id: 1, text: "原因1" },
        { id: 2, text: "原因2" },
        { id: 3, text: "原因3" },
        { id: 5, text: "其他" }
      ],
      showmodel: false,
      iszhankai: false
    };
  },
  created() {
    this.getData();
    console.log(this.typenum, "this.typenum");
    this.store_id = JSON.parse(window.localStorage.getItem("store_id"));
  },
  methods: {
    isshow(goods) {
      console.log(goods);
      this.goods = goods;
      this.show = true;
    },
    getData() {
      let store_token = JSON.parse(window.localStorage.getItem("store_token"));
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/store/gorder/list", {
          params: {
            order_status: this.typenum,
            store_token: store_token
          }
        })
        .then(res => {
          console.log(res.data, "gorder/list");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.gorderlist = resdata.data;

            Toast.clear();
          } else if (resdata.code == 40006) {
            this.$router.push({
              path: "/storeLogin"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }
        });
    },
    waitingOrders() {
      this.typenum = 7;
      let store_token = JSON.parse(window.localStorage.getItem("store_token"));
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/store/gorder/list", {
          params: {
            order_status: this.typenum,
            store_token: store_token
          }
        })
        .then(res => {
          console.log(res.data, "gorder/list");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.gorderlist = resdata.data;

            Toast.clear();
          } else if (resdata.code == 40006) {
            this.$router.push({
              path: "/storeLogin"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }
        });
    },
    beServed() {
      this.typenum = 2;
      let store_token = JSON.parse(window.localStorage.getItem("store_token"));
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/store/gorder/list", {
          params: {
            order_status: this.typenum,
            store_token: store_token
          }
        })
        .then(res => {
          console.log(res.data, "gorder/list");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.gorderlist = resdata.data;

            Toast.clear();
          } else if (resdata.code == 40006) {
            this.$router.push({
              path: "/storeLogin"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }
        });
    },
    selfMention() {
      this.typenum = 3;
      let store_token = JSON.parse(window.localStorage.getItem("store_token"));
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/store/gorder/list", {
          params: {
            order_status: this.typenum,
            store_token: store_token
          }
        })
        .then(res => {
          console.log(res.data, "gorder/list");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.gorderlist = resdata.data;

            Toast.clear();
          } else if (resdata.code == 40006) {
            Toast(resdata.msg);
            this.$router.push({
              path: "/storeLogin"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }
        });
    },
    complete() {
      this.typenum = 5;
      let store_token = JSON.parse(window.localStorage.getItem("store_token"));
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/store/gorder/list", {
          params: {
            order_status: this.typenum,
            store_token: store_token
          }
        })
        .then(res => {
          console.log(res.data, "gorder/list");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.gorderlist = resdata.data;

            Toast.clear();
          } else if (resdata.code == 40006) {
            Toast(resdata.msg);
            this.$router.push({
              path: "/storeLogin"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }
        });
    },
    afterSale() {
      this.typenum = 8;
      let store_token = JSON.parse(window.localStorage.getItem("store_token"));
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/store/gorder/list", {
          params: {
            order_status: this.typenum,
            store_token: store_token
          }
        })
        .then(res => {
          console.log(res.data, "gorder/list");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.gorderlist = resdata.data;

            Toast.clear();
          } else if (resdata.code == 40006) {
            Toast(resdata.msg);
            this.$router.push({
              path: "/storeLogin"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }
        });
    },
    onshowmodel() {
      if (this.showmodel) {
        this.showmodel = false;
      } else {
        this.showmodel = true;
      }
    },
    agree(id) {
      console.log(id);
      let store_token = JSON.parse(window.localStorage.getItem("store_token"));
      let param = new URLSearchParams();
      param.append("order_id", id);
      param.append("store_token", store_token);

      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .post(this.API + "/api/v1/store/gorder/receiving", param)
        .then(res => {
          console.log(res.data, "receiving");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast(resdata.data);
            this.getData();
          } else if (resdata.code == 40006) {
            Toast(resdata.msg);
            this.$router.push({
              path: "/storeLogin"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }
        });
    },
    reject(id) {
      let store_token = JSON.parse(window.localStorage.getItem("store_token"));
      let param = new URLSearchParams();
      param.append("order_id", id);
      param.append("store_token", store_token);

      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .post(this.API + "/api/v1/store/gorder/refuse", param)
        .then(res => {
          console.log(res.data, "refuse");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast(resdata.data);
            this.getData();
          } else if (resdata.code == 40006) {
            Toast(resdata.msg);
            this.$router.push({
              path: "/storeLogin"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }
        });
    },
    claim(id) {
      let store_token = JSON.parse(window.localStorage.getItem("store_token"));
      let param = new URLSearchParams();
      param.append("order_id", id);
      param.append("store_token", store_token);

      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .post(this.API + "/api/v1/store/gorder/claim", param)
        .then(res => {
          console.log(res.data, "claim");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast(resdata.data);
            this.getData();
          } else if (resdata.code == 40006) {
            Toast(resdata.msg);
            this.$router.push({
              path: "/storeLogin"
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
    // 服务详情
    toserDetail() {
      this.$router.push({ path: "/serviceDetail" });
    }
  }
};
</script>



<style scoped>
.nav {
  padding: 15px 10px;
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
  /* background-image: linear-gradient(90deg, #fe4171 100%, #ff5491 100%); */
  color: #fe4171;
  border-bottom: 3px solid #ff5491;
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
.pd-trb0 {
  padding: 10px 15px 0 15px;
}
.fsz18 {
  font-size: 18px;
}

.merchlist {
  height: 80px;
  box-shadow: 2px 3px 8px 1px rgba(222, 220, 220, 0.5);
  border-radius: 10px;
  line-height: 30px;
}

.fuwu_box {
  box-shadow: 1px 2px 8px 0px rgba(207, 206, 206, 0.5);
  border-radius: 10px;
  overflow: hidden;
  /* line-height: 40px; */
  padding-bottom: 15px;
}
.fuwutitle {
  color: #ff396e;
  padding-left: 15px;
}

.btn_box {
  margin-top: 20px;
  font-size: 13px;
}

.img_sanjiao {
  width: 8px;
  height: 6px;
}
.reject {
  color: #787878;
  border-radius: 5px;
  background: #e4e4e4;
  padding: 5px 25px;
  margin-left: 10px;
}

.agree {
  color: #fff;
  border-radius: 5px;
  padding: 5px 25px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171);
  margin-right: 10px;
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
.popup-box {
  width: 200px;
}
.popup-box > div {
  margin-bottom: 10px;
}
.popup-box > div:last-child {
  margin-bottom: 0px;
}
.circle-img {
  width: 12px;
  height: 12px;
  margin-right: 10px;
}

.add-l {
  width: 65px;
}

.add-r {
  width: 200px;
  word-wrap: break-word;
  word-break: break-all;
}
</style>