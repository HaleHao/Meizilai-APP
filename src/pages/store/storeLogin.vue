<template>
  <div>
    <div class="text-c">
      <img class="img_logo" src="../../assets/photo/mzlicon.png">
    </div>
    <div class="login_box">
      <div class="login bgc">
        <div class="title text-c">账户密码登录</div>
        <div class="pd-lr-15">
          <div class="flex-align-items xingming border-b">
            <img class="img_i" src="../../assets/photo/icon1.png">
            <input v-model.trim="newPhone" placeholder="请输入账号" type="number" maxlength="11">
          </div>

          <div class="flex-align-items huoqu_box flex-align-items border-b">
            <img class="img_i" src="../../assets/photo/icon1.png">
            <input v-model.trim="password" placeholder="请输入密码">
          </div>
        </div>
        <div class="btn text-c" @click="login">登录</div>
      </div>
    </div>
    <div class="weixin_box">
      <div class="flex-align-items bgc weixin" @click="wxLogin">
        <img class="img_weixin" src="../../assets/photo/weixin.png">
        <span>微信登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      newPhone: "",
      password: ""
    };
  },
  methods: {
    login() {
      if (this.newPhone == "") {
        Toast("请填写手机号码");
        return;
      }
      if (this.password == "") {
        Toast("请填密码");
        return;
      }

      let store_id = JSON.parse(window.localStorage.getItem("store_id"));
      let param = new URLSearchParams();
      param.append("store_id", store_id);
      param.append("mobile", this.newPhone);
      param.append("password", this.password);

      Toast.loading({ mask: true, message: "加载中..." });

      this.axios
        .post(this.API + "/api/v1/store/login", param)
        .then(res => {
          console.log(res.data, "store/login");
          let resdata = res.data;
          if (resdata.code == 200) {
            let store_token = resdata.data.store_token;

            window.localStorage.setItem(
              "store_token",
              JSON.stringify(store_token)
            );
            this.$router.push({ path: "/backstage" });
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
    wxLogin() {
      let store_id = JSON.parse(window.localStorage.getItem("store_id"));
      let param = new URLSearchParams();
      param.append("store_id", store_id);

      Toast.loading({ mask: true, message: "加载中..." });

      this.axios
        .post(this.API + "/api/v1/store/wechat/login", param)
        .then(res => {
          console.log(res.data, "wechat/login");
          let resdata = res.data;
          if (resdata.code == 200) {
            let store_token = resdata.data.store_token;

            window.localStorage.setItem(
              "store_token",
              JSON.stringify(store_token)
            );
            this.$router.push({ path: "/backstage" });
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
    }
  }
};
</script>

<style scoped>
.img_logo {
  width: 150px;
  height: 100px;
  border-radius: 50%;
  margin-top: 20px;
}
.login_box {
  width: 260px;
  padding: 0 30px;
  margin-top: 30px;
}
.login {
  width: 260px;
  border-radius: 10px;
}

.title {
  font-size: 16px;
  font-weight: 600px;
  padding-top: 30px;
}
.xingming {
  margin-top: 20px;
  height: 50px;
}

.img_i {
  width: 15px;
  height: 16px;
  margin-right: 10px;
}
.huoqu_box {
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

.btn {
  height: 40px;
  line-height: 40px;
  border-radius: 10px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171 100%);
  color: #fff;
  margin-top: 30px;
}
.weixin_box {
  width: 260px;
  padding: 0 30px;
  margin-top: 30px;
}
.weixin {
  /* width: 240px; */
  padding: 10px 80px;
  border-radius: 10px;
}
.img_weixin {
  width: 25px;
  height: 20px;
  padding-right: 10px;
}
</style>