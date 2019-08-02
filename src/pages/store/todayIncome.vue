<template>
  <div>
    <div v-if="datalist.length==0" class="pd-15 text-c">暂无收益</div>
    <div v-else class="flex-jc-between" style="padding:10px 15px">
      <div>{{data.time}}</div>
      <div>收益: ¥{{data.total}}</div>
    </div>
    <div class="bgc">
      <div class="flexbox big_box" v-for="(items, indexs) in data.list">
        <img class="img_icon" src="../../assets/photo/haoping.png">

        <div class="flex-jc-between border-b letf_box">
          <div>
            <div style="margin-bottom:5px">{{items.event_name}}</div>
            <div class="time">今日 {{items.add_time}}</div>
          </div>
          <div style="padding-right:15px" class="money">+{{items.earnings_amount}}</div>
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
      datalist: "",
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
        .get(this.API + "/api/v1/store/earnings/log", {
          params: {
            store_token: store_token
          }
        })
        .then(res => {
          console.log(res.data, "admin");

          let resdata = res.data;
          if (resdata.code == 200) {
            console.log(this.$route.query.id);
            this.datalist = resdata.data;
            if (this.$route.query.id == 1) {
              this.data = resdata.data[0];

              console.log(this.data);
            } else {
              this.data = resdata.data[1];
            }

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
    }
  }
};
</script>

<style scoped>
.big_box {
  align-items: center;
}
.img_icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 10px;
}

.letf_box {
  width: 270px;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid #f0f0f0;
}
.letf_box :last-child {
  border-bottom: 1px solid #fff;
}
.time {
  color: #979797;
  font-size: 12px;
}
.money {
  color: #ff508b;
  font-size: 15px;
}
</style>
