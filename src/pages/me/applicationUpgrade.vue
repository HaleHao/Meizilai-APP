<template>
  <div>
    <div class="pd-15">
      <div class="fuwu_box bgc">
        <div class="pd-15">
          <span>用户姓名:</span>
          <span>{{user.username}}</span>
        </div>
        <div class="pd-15">
          <span>联系电话:</span>
          <span class="fc-grey text-line">{{user.mobile}}</span>
        </div>
        <div class="pd-15">
          <span>注册时间:</span>
          <span class="fc-grey">{{user.reg_time}}</span>
        </div>
        <div class="pd-15">
          <span>当前级别:</span>
          <span class="fc-grey">{{user.card.name}}</span>
        </div>
        <div class="pd-15 flex-jc-between">
          <div>
            <span class="fc-fen">升级为:</span>
            <span>{{level.name}}</span>
          </div>
        </div>
        <!-- <div class="pd-15 flex-jc-between" @click="show=true">
          <div>
            <span class="fc-fen">升级为:</span>
            <span>{{classval}}</span>
          </div>
          <div>
            <img class="img_sanjiao" src="../../assets/photo/icon-triangle.png">
          </div>
        </div>-->
      </div>

      <div class="btn_box border-fen" @click="set(level.id)">提交申请</div>
    </div>

    <van-popup v-model="show" position="bottom" :close-on-click-overlay="false">
      <van-picker
        value-key="val"
        title="请选择等级"
        :columns="sexList"
        show-toolbar
        @cancel="show = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      show: false,
      classval: "请选择等级",
      user: "",
      level: "",
      card: "",
      sexList: [
        { id: 0, val: "天使会员" },
        { id: 1, val: "创业店主" },
        { id: 1, val: "创业董事" }
      ]
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/level")
        .then(res => {
          console.log(res.data, "level");

          let resdata = res.data;
          if (resdata.code == 200) {
            let is_card = resdata.data.is_card;

            if (is_card == 0) {
              this.$router.push({ path: "/menberCard" });
            } else {
              this.user = resdata.data.user;
              this.level = resdata.data.level;
            }

            console.log(this.data, "level");
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
    set(level) {
      console.log(level);
      Toast.loading({ mask: true, message: "加载中..." });
      let level_id = level;

      let param = new URLSearchParams();
      param.append("level_id", level_id);
      this.axios.post(this.API + "/api/v1/level/submit", param).then(res => {
        let resdata = res.data;
        console.log(res.data);
        if (resdata.code == 200) {
          //  请求  /api/v1/level/pay  传参order_id
          let order_id = resdata.data.order_id;

          let param = new URLSearchParams();
          param.append("order_id", order_id);

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
                this.axios
                  .post(this.API + "/api/v1/level/pay", param)
                  .then(res => {
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
                          // Toast("微信支付成功");
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
          this.$router.push({
            path: "/"
          });
        } else {
          Toast.clear();
          Toast(resdata.msg);
        }
      });

      // this.$router.back(-1);
    },
    onConfirm(val) {
      console.log(val);
      this.classval = val.val;

      this.show = false;
    }
    // 服务详情
  }
};
</script>



<style scoped>
.fz15 {
  font-size: 15px;
}
.fzc13 {
  font-size: 13px;
}

.fuwu_box {
  box-shadow: 1px 2px 8px 0px rgba(207, 206, 206, 0.5);
  border-radius: 10px;
  overflow: hidden;
  padding-bottom: 15px;
}

.btn_box {
  margin-top: 60px;
  font-size: 13px;
  text-align: center;
  color: #fff;
  border-radius: 20px;
  padding: 10px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171);
}

.img_sanjiao {
  width: 10px;
  height: 6px;
}
</style>