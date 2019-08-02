<template>
  <div>
    <div class="swiper-container">
      <div class="swiper-wrapper flex-align-items">
        <div class="swiper-slide" v-for="item in data">
          <img :src="item.img_url">
          <div class="card_name">{{item.name}}</div>
          <div class="card_num">
            <span>使用次数{{item.use_num}}数</span>
          </div>
          <div class="card_price flex-align-items">
            <span>¥</span>
            <span class="card_pri">{{item.mall_price}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bgc flex-jc-between pd-15 mar-b-10">
      <div>
        魅资莱共享消费{{name}}会员
        <span class="fz12">(有效期:1年)</span>
      </div>
      <div class="fc-fen fz15">¥{{mall_price}}</div>
    </div>

    <div class="bgc pd-lr-15">
      <div class="border-b title pd-tb-15">{{mall_price}}元VIP{{name}}，卡项包含：</div>
      <div v-html="description" class="pd-tb-15"></div>
      <!-- <div>
        <div
          class="pd-tb-15 border-b"
          v-show="activeIndex === 0||activeIndex === 1||activeIndex === 3"
        >套餐A：可享受11次项目，总价值（1588元）</div>
        <div class="pd-tb10">
          <div class="bgc flex-jc-between fz12 pd-b10" v-for="(item,index) in 5">
            <div>韩国小气泡清洁+（巨补水）无刨水光</div>
            <div>（2次）</div>
          </div>
        </div>
      </div>-->
    </div>
    <div class="bgc footer border-t flex-jc-between">
      <div class="fc-fen price">应付款: ¥{{mall_price}}</div>
      <div class="btn bcol" @click="goPay(card_id)">去付款</div>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import Swiper from "swiper";
import { Dialog, Toast } from "vant";
export default {
  data() {
    return {
      price: "388.00",
      activeIndex: 0,
      mall_price: "",
      name: "",
      data: [],
      card_id: "",
      description: "",
      order_id: ""
    };
  },
  watch: {
    activeIndex: function(val) {
      // console.log("6666" + val);
      let datalist = this.data;
      console.log(datalist);

      this.mall_price = datalist[val].mall_price;
      this.name = datalist[val].name;
      this.card_id = datalist[val].id;
      this.description = datalist[val].description;
    }
  },
  created() {
    this.getCard();
    console.log(wx, "wx");
  },
  methods: {
    initSwiper() {
      let self = this;
      var mySwiper = new Swiper(".swiper-container", {
        direction: "horizontal",
        loop: true, // 循环模式选项
        loopAdditionalSlides: 2,
        spaceBetween: 5,
        watchSlidesProgress: true,
        observer: true,
        effect: "coverflow",

        // slidesPerView: "auto",
        // freeMode: true,
        // slidesOffsetAfter: 15,
        // roundLengths: true,

        on: {
          touchEnd(e) {
            if (self.checkRepeat) {
              clearTimeout(self.checkRepeat);
            }

            self.checkRepeat = setTimeout(() => {
              self.activeIndex = mySwiper.realIndex;
            }, 500);
          }
        }
      });
    },
    getCard() {
      Toast.loading({ mask: true, message: "加载中..." });
      var params = {
        order_status: this.$route.query.id
      };
      this.axios.get(this.API + "/api/v1/card/list", params).then(res => {
        console.log(res.data, "card");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.data = resdata.data;
          this.mall_price = this.data[0].mall_price;
          this.name = this.data[0].name;
          this.description = this.data[0].description;
          this.card_id = this.data[0].id;
          Toast.clear();
        } else {
          Toast.clear();
          Toast(resdata.msg);
        }
      });
    },
    // 付款
    goPay() {
      if (this.card_id) {
        Toast.loading({ mask: true, message: "加载中..." });
        let param = new URLSearchParams();
        param.append("card_id", this.card_id);
        this.axios
          .post(this.API + "/api/v1/card/submit", param)
          .then(res => {
            let resdata = res.data;
            console.log(res.data, "card/submit");
            if (resdata.code == 200) {
              this.order_id = resdata.data.id;

              this.axios
                .get(this.API + "/api/v1/wechat/config", {
                  params: {
                    store_id: JSON.parse(
                      window.localStorage.getItem("store_id")
                    ),
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

                    let param = new URLSearchParams();
                    param.append("order_id", this.order_id);

                    this.axios
                      .post(this.API + "/api/v1/card/pay", param)
                      .then(res => {
                        let resdata = res.data;
                        console.log();
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
                        } else {
                          Toast.clear();
                          Toast(resdata.msg);
                        }
                      })
                      .catch(error => {
                        Toast.clear();
                        Toast("网络出错");
                      });
                  } else {
                    Toast(resdata.msg);
                  }
                })
                .catch(error => {
                  Toast.clear();
                  Toast("网络出错");
                });
            } else if (resdata.code == 40005) {
              window.localStorage.removeItem("access_token");
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
      } else {
        Toast("请重新选择会员卡");
      }
    }
  },
  mounted() {
    this.initSwiper();
  },
  beforeDestroy() {
    clearTimeout(this.checkRepeat);
  }
};
</script>
<style scoped>
.swiper-container {
  width: 190px;
  height: 120px;
  padding: 10px 0;
  overflow: visible !important;
  position: relative;
}
.swiper-container .swiper-wrapper .swiper-slide {
  width: 100%;
}

.swiper-container .swiper-wrapper .swiper-slide img {
  width: 100%;
  height: 120px;
}

.swiper-container .swiper-wrapper .swiper-slide-prev {
  height: 120px !important;
}
.swiper-container .swiper-wrapper .swiper-slide-prev img {
  height: 120px !important;
}
.swiper-container .swiper-wrapper .swiper-slide-next {
  height: 120px !important;
}

.swiper-container .swiper-wrapper .swiper-slide-next img {
  height: 120px !important;
}

.swiper-container .swiper-wrapper .swiper-slide-active {
  width: 190px;
}

.swiper-pagination {
  bottom: 5px !important;
}
.card_name {
  position: absolute;
  top: 15px;
  left: 10px;
  color: #fff;
  font-size: 17px;
}
.card_num {
  position: absolute;
  top: 93px;
  left: 10px;
  color: #fff;
  font-size: 12px;
}

.card_price {
  position: absolute;
  top: 90px;
  right: 10px;
  color: #fff;
}
.card_pri {
  font-size: 20px;
  font-weight: 700;
}
.fz12 {
  font-size: 12px;
}
.fz15 {
  font-size: 15px;
}
.pd-tb10 {
  padding: 10px 0;
}
.pd-b10 {
  padding-bottom: 10px;
}
.pic {
  margin-left: 10px;
}

.title {
  font-size: 15px;
}

.footer {
  width: 100%;
  height: 40px;
  position: fixed;
  right: 0;
  bottom: 0;
}
.btn {
  height: 40px;
  line-height: 40px;
  width: 108px;
  font-size: 14px;
  text-align: center;
}
.price {
  height: 40px;
  line-height: 40px;
  padding-left: 100px;
}
.bcol {
  background: linear-gradient(90deg, #ff5491, #fe4171);
  color: #fff;
}
</style>

