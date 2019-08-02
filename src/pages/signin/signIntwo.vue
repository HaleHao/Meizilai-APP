<template>
  <div class="bgc full">
    <div>
      <div class="position top">
        <img src="../../assets/photo/after_noon.png">
        <div class="click" v-show="data.is_sign==0">
          <div class="fc-fen" @click="signIn">点我签到</div>
        </div>
        <div class="after_click" @click="aftersignIn" v-show="data.is_sign==1">
          <div style="padding-left:9px">今日</div>
          <div>已签到</div>
        </div>
      </div>
      <div class="cumulative">
        本月累计签到
        <span style="font-size:15px;padding:0 3px">{{arr.length}}</span>天
      </div>
    </div>

    <div id="calendar">
      <calendar
        @choseDay="clickDay"
        @changeMonth="changeMonth"
        @isToday="isToday"
        :agoDayHide="nowdate"
        :markDate="arr"
        :sundayStart="sundayStart"
        :textTop="textTop"
      ></calendar>
    </div>
  </div>
</template>
<script>
import Calendar from "vue-calendar-component";
import { Toast } from "vant";
export default {
  components: {
    Calendar
  },
  data() {
    return {
      value: "",
      data: "",
      nowdate: String(Date.now() - 86400000).slice(0, 10),
      type1: this.$route.params.type1,
      arr: [],
      day_num: [],
      date: "",
      sundayStart: true,
      textTop: ["日", "一", "二", "三", "四", "五", "六"]
    };
  },
  watch: {},
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      // var result = [];
      // var day_num = {
      //   "2019-03-17": 0,
      //   "2019-03-18": 1,
      //   "2019-03-19": 1
      // };

      // var count = 0;
      // for (var prop in day_num) {
      //   if (day_num.hasOwnProperty(prop)) {
      //     if (day_num[prop] == 1) {
      //       result[count] = prop;
      //       count++;
      //     }
      //   }
      // }

      // console.log(result);
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/sign", {
          params: {
            user_type: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res.data, "sign/rank");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;
            let list = resdata.data.list;

            let datalist = [];
            for (let v of list) {
              datalist.push(v.sign_time);
              console.log(datalist, "1qqqqqqq");
            }
            // 签到列表
            this.arr = datalist;
            Toast.clear();
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
    // 签到
    signIn() {
      Toast.loading({ mask: true, message: "加载中..." });
      let param = new URLSearchParams();
      param.append("time", this.date);

      this.axios
        .post(this.API + "/api/v1/sign/submit", param)
        .then(res => {
          console.log(res.data, "sign");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;

            let list = resdata.data.list;
            let datalist = [];
            for (let v of list) {
              datalist.push(v.sign_time);
              console.log(datalist, "1qqqqqqq");
            }
            // 签到列表
            this.arr = datalist;
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

      console.log(this.arr);
      // this.arr.push(date);
      Toast.success("签到成功！");
    },
    aftersignIn() {
      Toast.success("今日已签到");
    },
    //选中某天
    clickDay(date) {
      console.log(date);
      if (this.data.is_sign == 0) {
        if (date != this.date) {
          Toast("请能选择当天时间签到");
        }
      }
    },
    isToday(date) {
      console.log(date);
      this.date = date;
    },
    changeMonth(date) {
      console.log(date, "datedate");
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/sign", {
          params: {
            user_type: this.$route.query.id,
            time: date
          }
        })
        .then(res => {
          console.log(res.data, "sign/rank");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;
            let list = resdata.data.list;

            let datalist = [];
            for (let v of list) {
              datalist.push(v.sign_time);
            }
            // 签到列表
            this.arr = datalist;
            Toast.clear();
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

<style>
#calendar .wh_content_all {
  background-color: #fff;
}
#calendar .wh_jiantou1 {
  border-color: #979797;
  margin-left: 70px;
}
#calendar .wh_jiantou2 {
  border-color: #979797;
  margin-right: 70px;
}
#calendar .wh_top_changge li {
  color: #000;
}
#calendar .wh_content_item {
  color: #000;
}
#calendar .wh_content_item .wh_other_dayhide {
  color: #bfbfbf;
}
#calendar .wh_content_item > .wh_isMark {
  background: url(../../assets/photo/gou.png) no-repeat left bottom;
  background-size: 25px auto;
}
/* #calendar .wh_content:nth-last-child(1) .wh_content_item {
  border: 0.5px solid #979797;
} */
#calendar .wh_content_item .wh_chose_day {
  background-color: #f6f6f6;
}
/* #calendar .wh_content_item .wh_isToday {
  background: url(../../assets/photo/gou.png) no-repeat left bottom;
  background-size: 25px auto;
} */
</style>


<style scoped>
.fz12 {
  font-size: 12px;
}
.top {
  width: 100%;
  height: 220px;
}
.click {
  position: absolute;
  top: 90px;
  left: 132px;
}
.after_click {
  position: absolute;
  top: 80px;
  left: 139px;
}
.cumulative {
  position: absolute;
  top: 190px;
  left: 15px;
  font-size: 12px;
  color: #fff;
}
</style>


