<template>
  <div>
    <div class="user_box">
      <div class="text-c">
        <img class="img_logo" :src="data.avatar">
      </div>
      <div class="text-c name pd-15">{{data.store_name}}</div>
    </div>
    <div class="flex-jc-around pd-15 bgc">
      <div @click="toCommodity">
        <div class="fc-fen text-c">{{data.today_goods}}</div>
        <div>今日商品订单</div>
      </div>
      <div @click="toService">
        <div class="fc-fen text-c">{{data.today_serve}}</div>
        <div>今日服务订单</div>
      </div>
      <div @click="toApproval">
        <div class="fc-fen text-c">{{data.today_level}}</div>
        <div>待审批</div>
      </div>
    </div>

    <div class="finance bgc">
      <div class="border-b pd-15">我的财务</div>
      <div class="flex-jc-around bgc pd-tb-15">
        <div @click="toIncome">
          <div class="fc-fen text-c">{{data.today_earnings}}</div>
          <div>今日收益</div>
        </div>
        <div @click="toIncomes">
          <div class="fc-fen text-c">{{data.yesterday_earnings}}</div>
          <div>昨日收益</div>
        </div>
        <div @click="tocumula">
          <div class="fc-fen text-c">{{data.today_earnings}}</div>
          <div>累计收益</div>
        </div>
        <div>
          <div class="fc-fen text-c">{{data.earnings}}</div>
          <div>可提现的</div>
        </div>
        <div class="btn text-c" @click="toCash(data.earnings)">提现</div>
      </div>
    </div>
    <div class="text-c tc_btn" @click="remove">
      <span class="text-c">退出登录</span>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      data: ""
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      let store_token = JSON.parse(window.localStorage.getItem("store_token"));
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/store/admin", {
          params: {
            store_token: store_token
          }
        })
        .then(res => {
          console.log(res.data, "admin");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;
            Toast.clear();
          } else if (resdata.code == 40006) {
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

    // 退出登录
    remove() {
      this.$router.push({ path: "/me" });
      window.localStorage.removeItem("store_token");
    },

    // 提现
    toCash(e) {
      this.$router.push({
        path: "/cash",
        query: {
          id: "4",
          earnings: e
        }
      });
    },

    toCommodity() {
      this.$router.push({ path: "/commodityOrder" });
    },

    // 今日收益
    toIncome() {
      this.$router.push({
        path: "/todayIncome",
        query: {
          id: "1"
        }
      });
    },
    // 昨日收益
    toIncomes() {
      this.$router.push({
        path: "/todayIncome",
        query: {
          id: "2"
        }
      });
    },

    // 累计收益
    tocumula() {
      this.$router.push({ path: "/cumulative" });
    },

    toService() {
      this.$router.push({ path: "/serviceOrder" });
    },
    toApproval() {
      this.$router.push({ path: "/examine" });
    }
  }
};
</script>

<style scoped>
.user_box {
  width: 100%;
  height: 170px;
  background-image: linear-gradient(to bottom, #ff5491, #fe4171);
}

.img_logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-top: 30px;
}
.name {
  color: #fff;
}
.finance {
  margin-top: 10px;
  font-size: 13px;
}

.btn {
  width: 40px;
  height: 25px;
  line-height: 25px;
  color: #fff;
  font-size: 12px;
  border-radius: 10px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171 100%);
}

.tc_btn {
  margin-top: 60px;
}

.tc_btn span {
  padding: 10px 100px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  border-radius: 10px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171 100%);
}
</style>
