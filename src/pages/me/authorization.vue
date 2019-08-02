<template>
  <div>
    <div class="flex-align-items pd-15">
      <div class="flexbox bgc position tel_box" @click="show=true">
        <div>{{name}}</div>
        <div class="img_box">
          <img class="img_sanjiao" src="../../assets/photo/aaa.png">
        </div>
      </div>
      <div>
        <input placeholder="请输入手机号、身份证号、姓名" v-model="classval">
      </div>
    </div>
    <div class="pd-15 fz12 fc-grey">
      <span class="fc-fen">温馨提示:</span>
      <span>本公司正规授权的会员必须严格按照公司规定的价格体系进行销售，凡是发现以低于公司规定价格出售产品、销售假货、串货任何一种情况的会员，一经查实，将会立刻取消授权资格，并拉入黑名单。</span>
    </div>
    <div class="pd-15">
      <div class="btn_box border-fen" @click="agree">确认查询</div>
    </div>
    <van-popup v-model="show" position="bottom" :close-on-click-overlay="false">
      <van-picker
        value-key="name"
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
export default {
  data() {
    return {
      show: false,
      classval: "",
      type: "",
      name: "手机号",
      sexList: [
        { val: "mobile", name: "手机号" },
        { val: "username", name: "用户名" },
        { val: "id_card", name: "身份证" }
      ]
    };
  },
  methods: {
    agree() {
      // this.$router.push({ path: "/resultNo" });
      // this.$router.push({ path: "/result" });
      if (this.type) {
        Toast.loading({ mask: true, message: "加载中..." });

        this.axios
          .get(this.API + "/api/v1/accredit/search", {
            params: {
              type: this.type,
              keyword: this.classval
            }
          })
          .then(res => {
            console.log(res.data, "accredit/search");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast(resdata.msg);

              Toast.clear();
              if (resdata.data == "") {
                this.$router.push({ path: "/resultNo" });
              } else {
                this.$router.push({
                  path: "/result",
                  query: {
                    img: resdata.data.contract
                  }
                });
              }
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
      } else {
        Toast.loading({ mask: true, message: "加载中..." });
        this.axios
          .get(this.API + "/api/v1/accredit/search", {
            params: {
              type: "mobile",
              keyword: this.classval
            }
          })
          .then(res => {
            console.log(res.data, "accredit/search");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast(resdata.msg);
              Toast.clear();
              if (resdata.data == "") {
                this.$router.push({ path: "/resultNo" });
              } else {
                this.$router.push({
                  path: "/result",
                  query: {
                    img: resdata.data.contract
                  }
                });
              }
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
      }
    },
    onConfirm(val) {
      console.log(val);
      this.type = val.val;
      this.name = val.name;
      console.log(this.type);

      this.show = false;
    }
  }
};
</script>
<style scoped>
.fz12 {
  font-size: 12px;
}
.tel_box {
  font-size: 12px;
  border-radius: 5px;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
}
.img_box {
  padding: 10px;
}
.img_sanjiao {
  width: 11px;
  height: 18px;
  position: absolute;
  top: 6px;
}

input {
  width: 185px;
  height: 30px;
  font-size: 12px;
  padding-left: 10px;
  border-radius: 5px;
  margin-left: 15px;
}
input::placeholder {
  font-size: 12px;
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
</style>


