<template>
  <div>
    <div class="box">
      <div class="flex-jc-between border-b pd-15">
        <div>提现方式</div>
        <div class="flex-align-items">
          <img class="img_weixin" src="../../assets/photo/weixin.png">
          <span>微信</span>
        </div>
      </div>

      <div class="pd-15" style=" font-weight: 600;">提现金额</div>
      <div class="flex-align-items pd-15 border-b">
        <img class="qian_img" src="../../assets/photo/qian_icon.png">
        <input type="text" class="fs30" placeholder v-model="money">
      </div>
      <div class="pd-15">
        <span>可提现¥ {{earnings}}，</span>
        <span class="fc-fen" @click="allmoney">全部提现</span>
      </div>
    </div>

    <div class="flex-jc-center">
      <div class="btn text-c" @click="submit">提现</div>
    </div>
  </div>
</template>  

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      money: "",
      earnings: ""
    };
  },
  created() {
    this.earnings = this.$route.query.earnings;
  },
  methods: {
    allmoney() {
      this.money = this.earnings;
    },
    submit() {
      // Toast("此功能未开通");

      if (this.money == "") {
        Toast("请填写提现金额");
        return;
      }

      Toast.loading({ mask: true, message: "加载中..." });

      let param = new URLSearchParams();
      param.append("amount", this.money);
      param.append("user_type", this.$route.query.id);

      this.axios
        .post(this.API + "/api/v1/earnings/withdraw", param)
        .then(res => {
          console.log(res.data, "withdraw");
          let resdata = res.data;
          if (resdata.code == 200) {
            console.log(resdata.msg);
            Toast.success(resdata.msg);

            Toast.clear();
          } else {
            Toast.success(resdata.msg);
            Toast.clear();
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
.fs30 {
  font-size: 30px;
}

.box {
  margin: 15px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 16px 0px rgba(220, 221, 223, 0.19);
  border-radius: 10px;
  padding-bottom: 15px;
}
.img_weixin {
  width: 25px;
  height: 22px;
  margin-right: 10px;
}
.qian_img {
  width: 17px;
  height: 25px;
  margin-right: 15px;
}
.cart {
  font-size: 17px;
}
.fuhao {
  font-size: 30px;
  font-weight: 200;
  padding-right: 15px;
}
.btn {
  width: 299px;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(90deg, #fe4171, #ff5491);
  border-radius: 20px;
  color: #fff;
  margin-top: 70px;
}
</style>
