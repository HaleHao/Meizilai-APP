<template>
  <div>
    <div class="bgc">
      <div class="flexbox pd-15" v-for="(item,index) in goods">
        <img class="img_slt" :src="item.cover_url">
        <div style="margin-left: 10px;">
          <div class="text-line pro_title">{{item.name}}</div>
          <div class="fsz12 fc-grey" style="padding:10px 0">{{item.num}}件</div>
          <div class="fc-fen">¥{{item.price}}</div>
        </div>
      </div>
      <div class="pd-15 flex-jc-between border-b border-top">
        <div>商品总额:</div>
        <div>¥{{all_price}}</div>
      </div>

      <div class="pd-15 flex-jc-between flex-align-items border-b">
        <div>配送方式:</div>

        <div class="nav bgc">
          <div :class="{ 'selected': typenum==2 }" @click="typenum=2">到店自提</div>
          <div :class="{ 'selected': typenum==1 }" @click="typenum=1">快递配送</div>
        </div>
      </div>
      <div v-show="typenum==2" class="border-b" style="height:100px">
        <div class="pd-lr-15" style=" padding-top: 10px;">自提门店:</div>
        <van-cell @click="go('/locationList')">
          <template slot="title">
            <div>{{store.name}}</div>
            <div>{{store.province+store.city+store.district+store.address}}</div>
          </template>
        </van-cell>
      </div>
      <div v-show="typenum==1" class="border-b" style="height:100px">
        <div class="pd-lr-15" style=" padding-top: 10px;">收件地址:</div>
        <van-cell is-link @click="goAddress">
          <template slot="title">
            <div>
              {{address.consignee}}
              {{address.mobile}}
              <span
                class="moren"
                v-if="address.length!=0"
              >默认</span>
            </div>
            <div v-if="address.length==0" class="fc-grey">请添加收货地址</div>
            <div v-else>{{address.province+address.city+address.district+address.address}}</div>
          </template>
        </van-cell>
      </div>
      <div class="pd-15 flex-jc-between border-b">
        <div>运费:</div>
        <div v-show="typenum==1">¥{{carriage}}</div>
        <div v-show="typenum==2">¥0</div>
      </div>
      <div class="pd-15">
        备注:
        <input v-model="remark">
      </div>
    </div>
    <div style="height: 50px;"></div>
    <div class="bgc footer flex-align-items">
      <div class="fc-fen pd-lr-15" v-show="typenum==1">应付款: ¥{{totalMoney}}</div>
      <div class="fc-fen pd-lr-15" v-show="typenum==2">应付款: ¥{{all_price}}</div>
      <div class="btn" @click="gopay(address.id)">去付款</div>
    </div>
  </div>
</template>
<script>
import { accAdd, accMul } from "@/utils/util.js";
import wx from "weixin-js-sdk";
import { Dialog, Toast } from "vant";

export default {
  data() {
    return {
      typenum: 2,
      count: "",
      address: "",
      goods: [],
      store: [],
      remark: "",
      order_id: "",
      goods_id: "",
      all_price: "",
      carriage: "",
      totalMoney: ""
    };
  },
  created() {
    let typenumSession = JSON.parse(
      window.sessionStorage.getItem("typenumSession")
    );

    if (typenumSession) {
      this.typenum = typenumSession.typenum;
    }
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });

      this.axios.get(this.API + "/api/v1/goods/confirm").then(res => {
        console.log(res.data, "confirm");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.address = resdata.data.address;
          this.goods = resdata.data.goods.list;
          this.store = resdata.data.store;
          this.count = resdata.data.goods.list[0].num;
          this.goods_id = resdata.data.goods.id;
          let all_price = resdata.data.goods.all_price;
          this.all_price = all_price;
          let carriage = resdata.data.goods.carriage;
          this.carriage = carriage;
          this.totalMoney = accAdd(all_price, carriage);
          console.log(this.totalMoney);

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
      });
    },

    goAddress() {
      let typenumSession = {
        typenum: this.typenum
      };
      window.sessionStorage.setItem(
        "typenumSession",
        JSON.stringify(typenumSession)
      );
      this.$router.push({
        path: "/addressList"
      });
      console.log(this.typenum);
    },

    gopay(id) {
      Toast.loading({ mask: true, message: "加载中..." });
      //创建一个数组
      let products = [];
      //  创建一个循环  循环次数 判断用户选了几个商品
      for (let v of this.goods) {
        //在循环里边创建一个对象，把商品ID 商品数量赋值给这个对象  goods_id  num
        let product = {
          goods_id: v.id,
          num: v.num
        };
        //把这个对象放入数组
        products.push(product);
      }
      console.log(JSON.stringify(products), "products");

      let param = new URLSearchParams();
      param.append("goods", JSON.stringify(products));
      param.append("remark", this.remark || "");
      param.append("delivery_type", this.typenum);
      param.append("address_id", id || "");
      this.axios
        .post(this.API + "/api/v1/goods/submit", param)
        .then(res => {
          console.log(res.data, "submit");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.order_id = resdata.data.order_id;

            //调起支付
            this.axios
              .get(this.API + "/api/v1/wechat/config", {
                params: {
                  store_id: JSON.parse(window.localStorage.getItem("store_id")),
                  url: location.href.split("#")[0]
                }
              })
              .then(res => {
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

                  let param = new URLSearchParams();
                  param.append("order_id", this.order_id);

                  this.axios
                    .post(this.API + "/api/v1/order/pay", param)
                    .then(res => {
                      let resdata = res.data;
                      if (resdata.code == 200) {
                        wx.chooseWXPay({
                          timestamp: resdata.data.timeStamp, // 支付签名时间戳
                          nonceStr: resdata.data.nonceStr, // 支付签名随机串，不长于 32 位
                          package: resdata.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                          signType: resdata.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                          paySign: resdata.data.paySign, // 支付签名
                          success: function(res) {
                            // 支付成功后的回调函数

                            Dialog.alert({
                              message: "微信支付成功"
                            }).then(() => {
                              window.location.href = `${
                                location.origin
                              }/me`;
                            });
                          }
                        });
                      } else if (
                        resdata.code == 40005 ||
                        resdata.code == 20001
                      ) {
                        window.localStorage.removeItem("access_token");
                        this.$router.push({
                          path: "/wechatAuth",
                          query: {
                            store_id: JSON.parse(
                              window.localStorage.getItem("store_id")
                            ),
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

                  // // config信息验证失败会执行error函数
                  // wx.error(function(res) {
                  //   console.log(res);
                  // });
                } else {
                  Toast.clear();
                  Toast(resdata.msg);
                }
              });
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
.img_slt {
  width: 80px;
  height: 80px;
  border-radius: 5px;
}

.pro_title {
  width: 190px;
}

.border-top {
  border-top: 10px solid #f0f0f0;
}

.fsz12 {
  font-size: 12px;
}

.nav > div {
  height: 25px;
  padding: 0 5px;
  line-height: 25px;
  display: inline-block;
  border-radius: 5px;
  text-align: center;
  border: 1px solid black;
  box-sizing: border-box;
  font-size: 13px;
  margin-left: 5px;
}

.nav .selected {
  color: #fe4476;
  border: 1px solid #fe4476;
}

.moren {
  background: linear-gradient(90deg, #ff5491, #fe4171);
  color: #fff;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 5px;
}

.footer {
  width: 100%;
  height: 40px;
  position: fixed;
  bottom: 0;
  justify-content: flex-end;
}

.btn {
  height: 40px;
  line-height: 40px;
  width: 108px;
  font-size: 14px;
  text-align: center;
  background: linear-gradient(90deg, #ff5491, #fe4171);
  color: #fff;
}
</style>
