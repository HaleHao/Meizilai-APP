<template>
  <div class="bgc">
    <div class="pd-15">
      <div class="total_pro pd-15">
        <div>{{user.username}}</div>
        <div class="total_money text-c">¥ {{user.earnings}}</div>
        <div class="text-c pd-tb-10">总收益</div>
        <div class="flex-jc-center" @click="toCash(user.earnings)">
          <div class="btn text-c">提现</div>
        </div>
      </div>
    </div>

    <div class="nav flex-jc-around">
      <div :class="{ 'selected': navIndex==0 }" @click="navIndex=0">收益详情</div>
      <div :class="{ 'selected': navIndex==1 }" @click="navIndex=1">提现记录</div>
    </div>
    <div style="padding-bottom:20px" v-show=" navIndex==0">
      <div class="profit_box pd-lr-15 mar-b-10" v-for="(item,index) in earnings" :key="index">
        <div class="flex-jc-between flex-align-items profi-titem pd-15">
          <div>
            <div class="fz15" style=" font-weight: 600;">{{item.event_name}}</div>
            <div class="fz13 pd-tb-10 fc-grey">{{item.created_at}}</div>
          </div>
          <div class="fc-fen fz15">+¥{{item.earnings_amount}}</div>
        </div>
      </div>
    </div>
    <div style="padding-bottom:20px" v-show=" navIndex==1">
      <div class="profit_box pd-lr-15 mar-b-10" v-for="(item,index) in withdraw" :key="index">
        <div class="flex-jc-between flex-align-items profi-titem pd-15">
          <div>
            <div class="fz15" style=" font-weight: 600;">{{item.event_name}}</div>
            <div class="fz13 pd-tb-10 fc-grey">{{item.created_at}}</div>
          </div>
          <div class="fz15 fc-grey">-¥{{item.withdraw_amount}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      profitlist: [{}, {}, {}],
      navIndex: 0,
      user: "",
      withdraw: [],
      earnings: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });

      this.axios
        .get(this.API + "/api/v1/earnings/my")
        .then(res => {
          console.log(res.data, "earnings/my");
          let resdata = res.data;

          if (resdata.code == 200) {
            this.user = resdata.data.user;
            this.withdraw = resdata.data.withdraw;
            this.earnings = resdata.data.earnings;
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
    toCash(earnings) {
      console.log(earnings);

      this.$router.push({
        path: "/cash",
        query: {
          earnings: earnings
        }
      });
    }
  }
};
</script>


<style scoped>
.fs15 {
  font-size: 15px;
}

.fz13 {
  font-size: 13px;
}

.pd-tb-10 {
  padding: 10px 0;
}
.nav {
  padding: 0 50px 10px 50px;
  background: #fff;
}
.nav > div {
  height: 30px;
  line-height: 30px;
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
  margin-right: 3px;
}
.nav .selected {
  color: #fe4171;
  border-bottom: 3px solid #ff5491;
}

.total_pro {
  height: 170px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 2px 3px 8px 1px rgba(222, 220, 220, 0.5);
  border-radius: 10px;
}

.total_money {
  font-size: 30px;
  font-weight: 700;
  margin-top: 30px;
}
.btn {
  width: 70px;
  height: 27px;
  line-height: 27px;
  border-radius: 20px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171);
  color: #fff;
  margin-top: 5px;
}

.profi-titem {
  height: 40px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 2px 3px 8px 1px rgba(222, 220, 220, 0.5);
  border-radius: 10px;
}
</style>


