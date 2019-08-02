<template>
  <div>
    <div id="stanav">
      <van-tabs v-model="active" @click="onClick">
        <van-tab title="签到排名">
          <div class="flex-jc-between pd-15 bgc">
            <div class="flexbox">
              <div style="margin-top:3px" @click="before">
                <van-icon name="arrow-left" color="grey"/>
              </div>
              <div class="pd-left">{{year}}年{{month}}月</div>
              <div style="margin-top:4px" class="pd-left" @click="after">
                <van-icon name="arrow" color="grey"/>
              </div>
            </div>
            <div class="flexbox" @click="toCheck">
              <div>全部签到排名</div>
              <div style="margin-top:4px" class="pd-left">
                <van-icon name="arrow" color="grey"/>
              </div>
            </div>
          </div>
          <div class="text-c bgc">未签到</div>
          <div class="flexbox pd-tb-15 bgc mar-b-10">
            <div class="weiqian" v-for="(item,index) in no_num" v-if="index<5">
              <div class="flex-jc-center">
                <img class="img_head" :src="item.avatar">
              </div>
              <div class="text-c text-line">{{item.nickname}}</div>
              <div class="text-c">{{item.num}}天</div>
            </div>
          </div>
          <!-- 折线图 -->
          <div class="mar-b-10 bgc">
            <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div id="mainbox"></div>
          </div>
          <div class="bgc">
            <div class="flex-jc-around">
              <div>
                <div class="flexbox" style="padding-top: 20px;">
                  <div class="aa"></div>
                  <div>
                    <span>签到:</span>
                    <span>{{yes_ratio}}%</span>
                  </div>
                </div>
                <div class="flexbox pd-tb-10">
                  <div class="bb"></div>
                  <div>
                    <span>未签到:</span>
                    <span>{{no_ratio}}%</span>
                  </div>
                </div>
              </div>
              <!--环形图 -->
              <div id="piebox" style="width: 120px;height:120px;"></div>
            </div>
            <div class="bgc btn_box">
              <div class="mybtn border-fen" v-if="is_sign==0" @click="sign">点我签到</div>
              <div class="mybtn border-fen" v-else>今日已签到</div>
            </div>
          </div>

          <div id="popup">
            <van-popup v-model="show">
              <div class="popup-box position">
                <div class="grey"></div>
                <div class="tuzi_img">
                  <img class="pd-tb-10" src="../../assets/photo/tuzi.png">
                </div>

                <div class="tip_box">
                  <div class="pd-15 tip">
                    恭喜老板到店，奋斗在一线的人最可爱
                    顾客是上帝！小主，今天你微笑了吗？
                    你准备好了吗？
                  </div>
                  <div class="btn border-fen" @click="show=false">我准备好了</div>
                </div>
              </div>
            </van-popup>
          </div>
        </van-tab>
        <van-tab title="评论排名">
          <div v-for="(item,index) in stalist" :key="index" class="bgc">
            <div class="flexbox flex-align-items">
              <img class="img_header" :src="item.avatar">
              <div class="flex-jc-between right pd-tb-10">
                <div>{{item.username}}</div>
                <div style="padding-right: 15px;">评分 {{item.grade}}</div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      stalist: [],
      show: false,
      year: "",
      month: "",
      day: "",
      active: "",
      datetext: "",
      datetxt: "",
      no_num: [],
      yes_ratio: "",
      no_ratio: "",
      is_sign: ""
    };
  },
  created() {
    this.nowTimes();
    console.log(this.datetxt);
    this.signRank();
  },
  methods: {
    onClick(index, title) {
      console.log(this.active);
      if (this.active == 0) {
        this.sign();
      } else {
        this.comment();
      }
    },
    // 评论排行
    comment() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/comment/rank")
        .then(res => {
          console.log(res.data, "comment/rank");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.stalist = resdata.data;
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
    // 签到排行
    signRank() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/sign", {
          params: {
            time: this.datetext,
            user_type: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res.data, "sign/rank");
          let resdata = res.data;
          if (resdata.code == 200) {
            let data = resdata.data;
            this.data = data;
            this.no_num = resdata.data.no_num;
            this.is_sign = resdata.data.is_sign;
            this.drawChart(data);

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

    sign() {
      Toast.loading({ mask: true, message: "加载中..." });

      let param = new URLSearchParams();
      param.append("time", this.datetext);
      this.axios
        .post(this.API + "/api/v1/sign/submit", param)
        .then(res => {
          console.log(res.data, "sign/submit");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.show = true;
            this.signRank();

            console.log(this.no_num, "sign");
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
    toCheck() {
      this.$router.push({ path: "/signInrank" });
    },
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      // let month =
      //   new Date(timeStamp).getMonth() + 1 < 10
      //     ? "0" + (new Date(timeStamp).getMonth() + 1)
      //     : new Date(timeStamp).getMonth() + 1;
      let month = new Date(timeStamp).getMonth() + 1;
      let day = new Date(timeStamp).getDate();
      this.month = month;
      this.year = year;
      this.day = day;

      this.datetext = `${year}/${month}/${day}`;
    },
    // 定时器函数
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 30 * 1000);
    },

    before() {
      if (this.month == 1) {
        this.year--;
        this.month = 12;
      } else {
        this.month--;
      }
      let month = this.month < 10 ? "0" + this.month : this.month;
      this.datetxt = `${this.year}/${month}/${this.day}`;
      console.log(this.datetxt);
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/sign", {
          params: {
            time: this.datetxt,
            user_type: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res.data, "sign/rank");
          let resdata = res.data;
          if (resdata.code == 200) {
            let data = resdata.data;
            this.data = data;
            this.no_num = resdata.data.no_num;
            this.drawChart(data);
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
    after() {
      if (this.month == 12) {
        this.year++;
        this.month = 1;
      } else {
        this.month++;
      }
      let month = this.month < 10 ? "0" + this.month : this.month;
      this.datetxt = `${this.year}/${month}`;
      console.log(this.datetxt);

      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/sign", {
          params: {
            time: this.datetxt,
            user_type: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res.data, "sign/rank");
          let resdata = res.data;
          if (resdata.code == 200) {
            let data = resdata.data;
            this.data = data;
            this.no_num = resdata.data.no_num;
            this.drawChart(data);
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

    // 图形渲染开始
    drawChart(data) {
      console.log(data, "data");
      let day_num = data.day_num;
      this.no_ratio = data.no_ratio;
      this.yes_ratio = data.yes_ratio;
      console.log(this.no_ratio, "no_ratio");
      let result = [];
      let result1 = [];
      console.log(day_num, "day_num");
      var count = 0;
      for (var prop in day_num) {
        //  在循环中把键取出来
        // console.log(prop);
        //  在循环中把值取出来
        // console.log(day_num[prop], "111111111");
        result[count] = prop;
        result1[count] = day_num[prop];
        count++;
      }
      console.log(result);
      console.log(result1);

      // 基于准备好的dom，初始化echarts实例
      let elem = document.getElementById("mainbox");
      console.log(elem);
      var myChart = this.$echarts.init(elem);
      var x = result;
      // var x = [
      //   "01-01",
      //   "01-02",
      //   "01-03",
      //   "01-04",
      //   "01-05",
      //   "01-06",
      //   "01-07",
      //   "01-08",
      //   "01-09",
      //   "01-10",
      //   "01-11",
      //   "01-12",
      //   "01-13",
      //   "01-14"
      // ];
      // var y = [0, 7, 2, 7, 5, 10, 7, 1, 7, 9, 7, 8, 10, 7];
      var y = result1;
      // 绘制折线图
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter: "{b} : {c}人签到"
        },
        grid: {
          left: "15",
          right: "115",
          top: "50",
          bottom: "40"
        },
        title: {
          show: "true",
          // text: "10人",
          x: "center",
          y: "top",
          borderWidth: 0,
          padding: 20, // 标题内边距，单位px，默认各方向内边距为5，
          textStyle: {
            fontSize: 12,
            fontWeight: "400",
            color: "#FE4171" // 主标题文字颜色
          }
        },
        xAxis: {
          type: "category",
          data: x,
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#FE4171", //左边线的颜色
              width: "1" //坐标线的宽度
            }
          },
          axisLabel: {
            textStyle: {
              color: "#030303" //坐标值得具体的颜色
            }
          }
        },
        yAxis: {
          show: true, //是否显示y轴
          // type: "category",
          type: "value",
          minInterval: 1,
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#FE4171",
              width: "1"
            }
          }
          // data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        },

        series: [
          {
            type: "line",
            data: y,
            itemStyle: {
              normal: {
                color: "#FE4171", //圈圈的颜色
                lineStyle: {
                  color: "#FE4171" //线的颜色
                }
              }
            }
          }
        ]
      });

      // 环形图
      let elemt = document.getElementById("piebox");
      console.log(elemt);
      var chart = this.$echarts.init(elemt); // 绘制图表

      var piedata = [
        {
          value: "",
          name: "签到",
          itemStyle: {
            normal: {
              color: "#FE4171"
            }
          }
        },
        {
          value: "",
          name: "不签到",
          itemStyle: {
            normal: {
              color: "#A8A7A4"
            }
          }
        }
      ];
      console.log(piedata, "piedata");
      for (let i = 0; i < piedata.length; i++) {
        piedata[0].value = this.yes_ratio;
        piedata[1].value = this.no_ratio;
        console.log(piedata[0].value, "no_ratio");
        console.log(piedata[1].value, "yes_ratio");
      }

      chart.setOption({
        series: [
          {
            name: "签到",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            data: piedata
          }
        ]
      });
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.drawChart();
    // });
    this.nowTimes();
  }
};
</script>

<style>
#stanav .van-tabs__line {
  background-color: #fff;
  background-image: linear-gradient(90deg, #fe4171, #ff5491);
}
#stanav .van-tab {
  font-size: 14px;
}
#stanav .van-tab--active {
  font-weight: 500;
  font-size: 14px;
  color: #fe4171;
}

#popup .van-popup {
  background: #4c4c4c;
}
</style>

<style scoped>
#mainbox {
  width: 420px;
  height: 400px;
  padding: 10px;
  box-sizing: border-box;
}
.pd-tb-10 {
  padding: 10px 0;
}
.pd-left {
  padding-left: 10px;
}
.weiqian {
  width: 60px;
  margin-left: 10px;
}
.img_head {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.aa {
  width: 11px;
  height: 11px;
  background: #fe4171;
  margin: 4px 10px 0 0;
}
.bb {
  width: 11px;
  height: 11px;
  background: #a8a7a4;
  margin: 4px 10px 0 0;
}
.btn_box {
  width: 100%;
  height: 40px;
}
.mybtn {
  position: absolute;
  bottom: 20px;
  font-size: 13px;
  text-align: center;
  color: #fff;
  border-radius: 20px;
  padding: 8px 25px;
  margin: 0 90px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171);
}

.popup-box {
  width: 250px;
  height: 240px;
}
.grey {
  height: 40px;
  background: #4c4c4c;
}
.tuzi_img {
  position: absolute;
  top: -10px;
  left: 88px;
}
.tuzi_img img {
  width: 80px;
  height: 80px;
}
.tip_box {
  width: 250px;
  height: 200px;
  background: #fff;
  border-radius: 10px;
}
.tip {
  padding: 60px 20px 30px 20px;
}
.btn {
  font-size: 13px;
  text-align: center;
  color: #fff;
  border-radius: 20px;
  padding: 8px;
  margin: 0 50px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171);
}
.img_header {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: 15px;
}

.right {
  width: 250px;
  height: 40px;
  line-height: 40px;
  margin-left: 15px;
  border-bottom: 1px solid #f0f0f0;
}
</style>


