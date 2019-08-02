<template>
  <div>
    <div class="nav fc-grey mar-b-10">
      <div :class="{ 'selected': typenum==1 }" @click="orderStatus1">待付款</div>
      <div :class="{ 'selected': typenum==2 }" @click="orderStatus2">待发货</div>
      <div :class="{ 'selected': typenum==3 }" @click="orderStatus3">待收货</div>
      <div :class="{ 'selected': typenum==4 }" @click="orderStatus4">待评论</div>
    </div>

    <div class="pd-lr-15">
      <div class="bgc daifu-box mar-b-10" v-for="(item,index) in orderlist">
        <div>
          <div
            class="flex-align-items"
            @click="toDetail(item.id)"
            style="padding:15px 0 10px 15px"
            v-for="(items,indexs) in item.order_goods"
          >
            <div>
              <img class="img_pro" :src="items.goods_img">
            </div>
            <div class="flex-column-space-between right">
              <div>
                <div class="newline">{{items.goods_name}}</div>
                <div class="fz12 fc-grey pdtb-5">数量：{{items.goods_num}}件</div>
              </div>
              <div class="fc-fen flex-jc-between">
                <span>商品金额：¥{{items.goods_price}}</span>
                <div
                  class="fc-fen text-c border-fen"
                  style=" border-radius: 3px; padding:2px 4px"
                  v-show="item.order_status==4"
                  @click.stop="toComment(items)"
                >待评论</div>
              </div>
            </div>
          </div>
          <div class="price_box">
            <div class="item-total">{{item.total_price}}</div>
            <div>合计:¥</div>
          </div>
          <div class="btn_box pd-10" v-show="item.order_status==0">
            <span class="fc-fen text-c border-fen" @click.stop="toPay(item.id)">待付款</span>
            <span class="fc-grey text-c border" @click.stop="onshowmodel(item.id)">取消订单</span>
          </div>
          <div class="btn_box pd-10" v-show="item.order_status==2">
            <span class="fc-fen text-c border-fen" @click.stop="confirm(item.id)">确认收货</span>
          </div>
          <div class="btn_box pd-10" v-show="item.order_status==3">
            <span class="fc-fen text-c border-fen" @click.stop="confirm(item.id)">确认取货</span>
          </div>
          <div class="btn_box pd-10" v-show="item.order_status==4">
            <span class="fc-grey text-c border" @click.stop="del(item.id)">删除订单</span>
          </div>
          <div class="btn_box pd-10" v-show="item.order_status==5">
            <span class="fc-grey text-c border" @click.stop="del(item.id)">删除订单</span>
          </div>
        </div>
      </div>
    </div>

    <van-popup v-model="showmodel" position="bottom" :close-on-click-overlay="false">
      <div class="text-c position title">
        取消订单
        <div class="closeicon">
          <van-icon name="close" @click="onshowmodel"/>
        </div>
      </div>
      <div class="pd-lr-15">
        <div class="pd-tb-15">请选择取消订单的原因,让我们更好的改进哦！</div>
        <van-radio-group v-model="radio" @change="checkedName">
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
      <div class="pd-15">
        <div class="btn text-c" @click="cancelOrder()">确定</div>
      </div>
    </van-popup>

    <van-dialog v-model="show" show-cancel-button :before-close="beforeClose">
      <div class="text-c pd-15">确认删除订单？</div>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      typenum: this.$route.query.id,
      radio: 0,
      isdianzan: false,
      orderlist: [],
      order_id: "",
      cancel_remark: "测试/误下单",
      canceltext: [
        { id: 1, text: "测试/误下单" },
        { id: 2, text: "规格、数量选错" },
        { id: 3, text: "不想要了" },
        { id: 4, text: "其他" }
      ],
      showmodel: false,
      show: false
    };
  },
  created() {
    console.log(this.$route.query.id);
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/order/my", {
          params: {
            type: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res.data, "order/my");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.orderlist = resdata.data;
            // for (let v of resdata.data) {
            //   this.order_id = v.id;
            // }
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
    // 切换订单状态
    // 待付款
    orderStatus1() {
      this.typenum = 1;

      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/order/my", {
          params: {
            type: 1
          }
        })
        .then(res => {
          console.log(res.data, "order/my");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.orderlist = resdata.data;

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
    // 待发货
    orderStatus2() {
      this.typenum = 2;

      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/order/my", {
          params: {
              type: 2
          }
        })
        .then(res => {
          console.log(res.data, "order/my");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.orderlist = resdata.data;

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
    // 待收货
    orderStatus3() {
      this.typenum = 3;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/order/my", {
          params: {
              type: 3
          }
        })
        .then(res => {
          console.log(res.data, "order/my");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.orderlist = resdata.data;

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
    // 待评论
    orderStatus4() {
      this.typenum = 4;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/order/my", {
          params: {
              type: 4
          }
        })
        .then(res => {
          console.log(res.data, "order/my");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.orderlist = resdata.data;

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
    // 取消订单
    cancelOrder() {
      Toast.loading({ mask: true, message: "加载中..." });

      let param = new URLSearchParams();
      param.append("order_id", this.order_id);
      param.append("cancel_remark", this.cancel_remark);
      this.axios
        .post(this.API + "/api/v1/order/cancel", param)
        .then(res => {
          console.log(res.data, "order/cancel");
          let resdata = res.data;

          if (resdata.code == 200) {
            Toast(resdata.msg);
            this.getData();

            Toast.clear();
          } else if (resdata.code == 40005) {
            this.$router.push({
              path: "/"
            });
          } else {
            Toast(resdata.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
      this.showmodel = false;
    },
    onshowmodel(id) {
      console.log(id);
      this.order_id = id;
      if (this.showmodel) {
        this.showmodel = false;
      } else {
        this.showmodel = true;
      }
    },

    // 待付款
    toPay(id) {
      console.log(id);

      let order_id = id;
      let param = new URLSearchParams();
      param.append("order_id", order_id);
      // 获取签名信息
      this.axios
        .get(this.API + "/api/v1/wechat/config", {
          params: {
            store_id: JSON.parse(window.localStorage.getItem("store_id")),
            url: location.href.split("#")[0]
          }
        })
        .then(res => {
          console.log(res.data, "config");
          let resdata = res.data;
          if (resdata.code == 200) {
            wx.config({
              debug: false,
              appId: resdata.data.appId, // 必填，公众号的唯一标识
              nonceStr: resdata.data.nonceStr, // 必填，生成签名的随机串
              signature: resdata.data.signature, // 必填，签名，见附录1
              timestamp: resdata.data.timestamp, // 必填，生成签名的时间戳
              url: resdata.data.url,
              jsApiList: ["chooseWXPay", "translateVoice"]
            });
            this.axios.post(this.API + "/api/v1/order/pay", param).then(res => {
              let resdata = res.data;
              console.log();
              if (resdata.code == 200) {
                wx.chooseWXPay({
                  timestamp: resdata.data.timeStamp, // 支付签名时间戳，
                  nonceStr: resdata.data.nonceStr, // 支付签名随机串，不长于 32 位
                  package: resdata.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                  signType: resdata.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                  paySign: resdata.data.paySign, // 支付签名
                  success: function(res) {
                    // 支付成功后的回调函数
                    Toast("微信支付成功");
                    window.location.href = `${location.origin}/me`;
                  }
                });
              } else {
                Toast.clear();
                Toast(resdata.msg);
              }
            });
          } else if (resdata.code == 40005) {
            this.$router.push({
              path: "/"
            });
          } else {
            Toast(resdata.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
    },
    checkedName(res) {
      console.log(res);
      if (res == 0) {
        this.cancel_remark = "测试/误下单";
      } else if (res == 1) {
        this.cancel_remark = "规格、数量选错";
      } else if (res == 2) {
        this.cancel_remark = "不想要了";
      } else {
        this.cancel_remark = "其他";
      }
    },

    // 确认收货
    confirm(id) {
      Toast.loading({ mask: true, message: "加载中..." });

      let param = new URLSearchParams();
      param.append("order_id", id);

      this.axios
        .post(this.API + "/api/v1/order/confirm", param)
        .then(res => {
          console.log(res.data, "order/confirm");
          let resdata = res.data;
          this.typenum == 3;
          if (resdata.code == 200) {
              Toast(resdata.msg);
              this.orderStatus3();
            Toast.clear();
          } else if (resdata.code == 40005) {
            this.$router.push({
              path: "/"
            });
          } else {
            Toast(resdata.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
    },

    // 订单详情
    toDetail(id) {
      this.$router.push({
        path: "/orderDetail/",
        query: {
          id: id
        }
      });
    },
    // 评论
    toComment(items) {
      console.log(items);
      this.$router.push({
        path: "/comment/",
        query: {
          good: items
        }
      });
    },
    // 删除订单
    beforeClose(action, done) {
      if (action === "confirm") {
        Toast.loading({ mask: true, message: "加载中..." });
        let param = new URLSearchParams();
        param.append("order_id", this.order_id);
        this.axios
          .post(this.API + "/api/v1/order/del", param)
          .then(res => {
            console.log(res.data, "order/del");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              this.orderStatus4();
            } else if (resdata.code == 40005) {
              this.$router.push({
                path: "/"
              });
            } else {
              Toast(resdata.msg);
            }
          })
          .catch(error => {
            Toast.clear();
            Toast("网络出错");
          });
        setTimeout(done, 500);
      } else {
        done();
      }
    },

    del(id) {
      this.show = true;
      this.order_id = id;
      console.log(id);
    }
  }
};
</script>



<style scoped>
.nav {
  padding: 15px 10px;
}
.nav > div {
  width: 64px;
  height: 25px;
  line-height: 25px;
  display: inline-block;
  box-shadow: 0 1px 7px 1px #e8e9ea;
  border-radius: 20px;
  color: #6c6c6c;
  text-align: center;
  box-sizing: border-box;
  font-size: 13px;
  margin-right: 7px;
}
.nav .selected {
  background: linear-gradient(90deg, #fe4171, #ff5491);
  color: #fff;
}
.pd-10 {
  padding: 15px 10px;
}
.pdtb-5 {
  padding: 5px 0;
}
.fz12 {
  font-size: 12px;
}

.fsz12 {
  font-size: 12px;
}

.daifu-box {
  width: 290px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 1px 2px 8px 0px rgba(207, 206, 206, 0.5);
}
.daifa-box {
  width: 290px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 1px 2px 8px 0px rgba(207, 206, 206, 0.5);
}
.img_pro {
  width: 60px;
  height: 65px;
  border-radius: 3px;
}
.right {
  width: 195px;
  padding: 5px 10px;
}
.price_box {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding: 0 10px;
  font-size: 12px;
}
.item-total {
  margin-top: 2px;
  font-size: 12px;
}
.btn_box {
  display: flex;
  flex-direction: row-reverse;
}
.btn_box span {
  width: 80px;
  height: 30px;
  margin-left: 10px;
  line-height: 30px;
  border-radius: 5px;
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
.model {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.btn {
  height: 30px;
  line-height: 30px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #fe4171, #fe4171 100%);
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