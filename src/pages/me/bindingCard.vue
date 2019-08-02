<template>
  <div>
    <div class="box bgc">
      <div class="flex-jc-between border-b pd-15" @click="isshow = true">
        <div class="flexbox">
          <div class="left">开卡银行</div>
          <!-- <span :class="text=='请选择开卡银行'?'select':''">{{text}}</span> -->
          <!-- <div class="fc-grey" v-if="typetext==''">请选择托管品类</div>
          <div v-else>{{typetext}}</div>-->
          <span class="select" v-if="text==''">请选择开卡银行</span>
          <span v-else>{{text}}</span>
        </div>
        <van-icon name="arrow" color="#aeaeae" size="18px"/>
      </div>
      <div class="flex-jc-between border-b pd-15">
        <div class="flexbox">
          <div class="left">卡号</div>

          <input placeholder="请输入银行卡号" v-model.trim="cardnum">
        </div>
      </div>
      <div class="flex-jc-between border-b pd-15">
        <div class="flexbox">
          <div class="left">姓名</div>
          <input placeholder="请输入姓名" v-model.trim="nickname">
        </div>
      </div>
      <div class="flex-jc-between border-b pd-15">
        <div class="flexbox">
          <div class="left">身份证号</div>
          <input placeholder="请输入身份证号" v-model.trim="idcard">
        </div>
      </div>
      <div class="flex-jc-between border-b pd-15">
        <div class="flexbox">
          <div class="left">手机号</div>
          <input placeholder="请输入手机号" v-model.trim="tel" type="number" maxlength="11">
        </div>
      </div>
      <div class="flex-jc-between border-b pd-15 flex-align-items">
        <div class="flexbox">
          <div class="left">验证码</div>
          <input placeholder="请输入验证码" class="input_b" v-model.trim="yzcode">
        </div>
        <span class="yz" @click="countDown">{{content}}</span>
      </div>
    </div>
    <div class="flex-jc-center">
      <div class="btn text-c" @click="save">保存</div>
    </div>

    <van-popup v-model="isshow" position="bottom" :close-on-click-overlay="false">
      <van-picker :columns="columns" show-toolbar @confirm="onConfirm" @cancel="isshow = false"/>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      isshow: false,
      columns: ["中国农业银行", "中国工商银行", "测试", "测试", "测试"],
      text: "",
      cardnum: "",
      nickname: "",
      idcard: "",
      tel: "",
      yzcode: "",
      content: "获取验证码",
      totalTime: 60, //倒计时
      canClick: true
    };
  },
  created() {
    let bindingCardSession = JSON.parse(
      window.sessionStorage.getItem("bindingCardSession")
    );

    if (bindingCardSession) {
      this.text = bindingCardSession.text;
      this.cardnum = bindingCardSession.cardnum;
      this.nickname = bindingCardSession.nickname;
      this.idcard = bindingCardSession.idcard;
      this.tel = bindingCardSession.tel;
      this.yzcode = bindingCardSession.yzcode;
    }
  },

  methods: {
    onConfirm(value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`);
      this.text = value;
      this.isshow = false;
    },
    //倒计时
    countDown() {
      if (!this.canClick) return;
      this.canClick = false;
      this.content = this.totalTime + "s后重新发送";
      let clock = window.setInterval(() => {
        this.totalTime--;
        this.content = this.totalTime + "s后重新发送";
        if (this.totalTime < 0) {
          window.clearInterval(clock);
          this.content = "重新发送";
          this.totalTime = 60;
          this.canClick = true;
        }
      }, 1000);
    },

    save() {
      if (
        this.text == "" ||
        this.cardnum == "" ||
        this.nickname == "" ||
        this.idcard == "" ||
        this.yzcode == ""
      ) {
        Toast("请先填写完整");
        return;
      }
      if (this.tel == "") {
        Toast("请先填写手机号");
        return;
      }
      if (this.tel.length != 11) {
        Toast("手机号长度有误");
        return;
      }

      var telphone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      if (!telphone.test(this.tel)) {
        Toast("手机号码有误，请重填");
        return;
      }
      let bindingCardSession = {
        text: this.text,
        cardnum: this.cardnum,
        nickname: this.nickname,
        idcard: this.idcard,
        tel: this.tel,
        yzcode: this.yzcode
      };
      window.sessionStorage.setItem(
        "bindingCardSession",
        JSON.stringify(bindingCardSession)
      );
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.box {
  margin: 15px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 16px 0px rgba(220, 221, 223, 0.19);
  border-radius: 10px;
}
.left {
  width: 65px;
}
.select {
  color: #cecece;
}
input::placeholder {
  color: #cecece;
}
.input_b {
  width: 100px;
}
.yz {
  height: 25px;
  line-height: 25px;
  color: #fff;
  background-color: #4ea9f9;
  border-radius: 15px;
  padding: 0px 10px;
  font-size: 12px;
}
.btn {
  width: 280px;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
  border-radius: 20px;
  color: #fff;
  margin-top: 70px;
}
.model {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.main {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>


