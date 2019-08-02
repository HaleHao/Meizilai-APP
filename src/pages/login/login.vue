<template>
  <div>
    <div class="login_box bgc">
      <div class="login">
        <div class="hellow pdt50 pdl40">你好，</div>
        <div class="tip_title pdl40">注册魅资莱，共享M肤</div>
        <div class="pdl40 flex-align-items xingming">
          <img class="img_shouji" src="../../assets/photo/shouji@2x.png">
          <input v-model.trim="newPhone" placeholder="请输入您的手机号码" type="number" maxlength="11">
        </div>

        <div class="pdl40 flex-jc-between huoqu_box flex-align-items">
          <div class="flex-align-items">
            <img class="img_yanzheng" src="../../assets/photo/yanzhengma1.png">
            <input v-model.trim="code" placeholder="请输入手机验证码" type="number">
          </div>
          <div
            class="fc-fen fs12"
            @click="countDown"
            :class="{disabled: !this.canClick}"
            style="margin-right:50px"
          >{{content}}</div>
        </div>

        <div class="pdl40">
          <button class="act" @click="login">登录</button>
        </div>
      </div>
    </div>
    <div class="pd-15" @click="toRegister">
      <span class="fc-fen">立即注册</span>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      newPhone: "",
      code: "",
      content: "获取验证码",
      totalTime: 60, //倒计时
      canClick: true
    };
  },
  created() {
    // this.gettoken();
  },
  methods: {
    // gettoken() {
    //   window.location.href =
    //     "https://meizilai.zx-xcx.com/api/v1/wechat/login?store_id=4";
    // },
    //倒计时
    countDown() {
      if (this.newPhone == "") {
        Toast("请填写手机号码");
        return;
      }
      if (!this.canClick) return;
      this.canClick = false;
      Toast.loading({ mask: true, message: "加载中..." });
      // let postData = this.$qs.stringify({
      //   mobile: this.newPhone,
      //   type: 2
      // });
      let param = new URLSearchParams();
      param.append("mobile", this.newPhone);
      param.append("type", 2);
      this.axios
        .post(this.API + "/api/v1/send/code", param)
        .then(res => {
          let resdata = res.data;
          console.log(res.data, "codecode");
          if (res.code == 200) {
            let code = 123456;
            this.code = code;
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });

      this.content = this.totalTime + "(s)";
      let clock = window.setInterval(() => {
        this.totalTime--;
        this.content = this.totalTime + "(s)";
        if (this.totalTime < 0) {
          window.clearInterval(clock);
          this.content = "重新获取";
          this.totalTime = 60;
          this.canClick = true;
        }
      }, 1000);
    },
    //登录
    login() {
      console.log(this.newPhone);

      if (this.newPhone == "") {
        Toast("请填写手机号码");
        return;
      }

      if (this.newPhone.length != 11) {
        Toast("手机号长度有误");
        return;
      }
      if (this.code == "") {
        Toast("请填写验证码");
        return;
      }

      // var telphone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      // if (!telphone.test(this.newPhone)) {
      //   Toast("手机号码有误，请重填");
      //   return;
      // }
      // this.$router.push({ path: "/InputCode/" + this.newPhone });
      // window.localStorage.setItem("center", JSON.stringify(center));
      // JSON.parse(window.localStorage.getItem("center")).users_phone;
      // window.localStorage.removeItem("center");

      Toast.loading({ mask: true, message: "加载中..." });
      // let postData = this.$qs.stringify({
      //   mobile: this.newPhone,
      //   code: this.code
      // });

      let param = new URLSearchParams();
      param.append("mobile", this.newPhone);
      param.append("code", this.code);

      this.axios
        .post(this.API + "/api/v1/user/login", param)
        .then(res => {
          console.log(res.data, "login");

          if (res.data.code == 200) {
            Toast.clear();
            Toast(res.data.msg);
            let is_card = res.data.data.is_card;
            console.log(res.data.is_card, "res.data.data.is_card");

            if (is_card == 1) {
              this.$router.push({ path: "/" });
            } else {
              this.$router.push({ path: "/myApply" });
            }
          } else {
            Toast.clear();
            Toast(res.data.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
    },
    // 立即注册
    toRegister() {
      this.$router.push({ path: "/register/" });
    }
  }
};
</script>

<style scoped>
.pdt50 {
  padding-top: 50px;
}

.pdl40 {
  padding-left: 40px;
}
.pd-tb10 {
  padding: 10px 0;
}
.fs12 {
  font-size: 12px;
}
.login_box {
  width: 100%;
  height: 100%;
  padding-bottom: 60px;
}
.login {
  /* width: 250px; */
  height: 100%;
}
.hellow {
  font-size: 24px;
  font-weight: 600px;
}
.tip_title {
  font-size: 16px;
  font-weight: 600px;
  padding-top: 30px;
}
.xingming {
  margin-top: 20px;
  width: 240px;
  height: 50px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 2px 1px 7px 1px rgba(251, 238, 238, 0.5);
}
.img_xmicon,
.img_yanzheng {
  width: 15px;
  height: 16px;
  margin-right: 10px;
}
.huoqu_box {
  /* width: 240px; */
  height: 50px;
}
.img_shouji {
  width: 13px;
  height: 19px;
  margin-right: 10px;
}
input {
  width: 150px;
  line-height: 40px;
}

.act {
  width: 80px;
  height: 45px;
  font-size: 14px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171 100%);
  color: #fff;
  margin-top: 20px;
  margin-bottom: 50px;
}

.disabled {
  color: grey;
  cursor: not-allowed;
}
</style>
