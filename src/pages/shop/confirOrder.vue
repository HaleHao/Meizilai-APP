<template>
  <div>
    <div class="bgc">
      <div class="pd-15">服务项目</div>
      <div class="border-b">
        <div
          class="flex-jc-between fz13 ser_box pd-lr-15"
          v-for="(item,index) in data.serve"
          :key="index"
        >
          <div>{{item.serve_name}}</div>
          <div>¥{{item.price}}</div>
        </div>
      </div>
      <div class="flex-jc-between border-b pd-15" @click="time">
        <div>服务时间</div>
        <div class="fc-grey flex-align-items">
          <span class="fc-grey fz13">{{serve_time==""?'请选择':serve_time}}</span>
          <van-icon name="arrow"/>
        </div>
      </div>
      <div class="flex-jc-between border-b pd-15" @click="onshowmodel">
        <div>美容师</div>
        <div class="fc-grey flex-align-items">
          <span class="fc-grey fz13">{{beautician_name==""?'请选择':beautician_name}}</span>
          <van-icon name="arrow"/>
        </div>
      </div>
      <div class="pd-15">手机号码 {{data.mobile}}</div>
      <div class="footer bgc">
        <div class="btn text-c" @click="toSuccess">去付款</div>
        <span class="fc-fen pd-lr-15">应付款: ¥{{data.total_price}}</span>
      </div>
    </div>

    <van-popup
      v-model="timemodel"
      position="bottom"
      :close-on-click-overlay="false"
      style="height:380px"
    >
      <div class="text-c position title">
        请选择服务时间
        <div class="closeicon">
          <van-icon name="close" color="#979797" @click="time"/>
        </div>
      </div>

      <div class="select_container">
        <!--左侧-->
        <div class="left">
          <div class="left_item">
            <div
              v-for="(item,index) in weekday"
              @click="selectPro(index)"
              :class="{ 'pro_active': index==activeTitle}"
            >{{item}}</div>
          </div>
        </div>

        <!--右侧-->
        <div class="right bgc">
          <ul>
            <li
              v-for="(items,indexs) in righttime"
              @click="toDetail(indexs)"
              :class="{ 'pro_time': indexs==activeIndexs}"
            >
              <div class="item-right">
                <div>{{items}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
    <van-popup
      v-model="showmodel"
      position="bottom"
      style="height:350px"
      :close-on-click-overlay="false"
    >
      <div class="text-c position title">
        请选择服务人员
        <div class="closeicon">
          <van-icon name="close" color="#979797" @click="onshowmodel"/>
        </div>
      </div>
      <div class="pd-lr-15 mar-b-10">
        <van-radio-group v-model="radio" @change="checkedData">
          <div
            class="flex-jc-between flex-align-items border-b pd-tb-15"
            @click="radio = index"
            v-for="(item,index) in data.beautician"
            :key="index"
          >
            <div class="flexbox">
              <div class="head_img">
                <img :src="item.avatar">
              </div>
              <div class="right_box">
                <div>{{item.username}}</div>
                <div class="fz11 fc-grey number">{{item.serve_num}}</div>
                <div class="fz11 fc-fen">好评 {{item.grade}}%</div>
              </div>
            </div>
            <van-radio :name="index" checked-color="#FF508B"></van-radio>
          </div>
        </van-radio-group>
      </div>
    </van-popup>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import { Dialog, Toast } from "vant";

export default {
  data() {
    return {
      data: "",
      radio: -1,
      weekday: [],
      righttime: [],
      left: "",
      right: "",
      serve_time: "",
      titlelist: [
        { name: "周二 01-22" },
        { name: "周三 01-22" },
        { name: "测试" },
        { name: "测试" },
        { name: "测试" }
      ],
      activeIndexs: -1,
      activeTitle: 0,
      showmodel: false,
      timemodel: false,
      beautician_id: "",
      beautician_name: "",
      order_id: 0
    };
  },

  created() {
    this.getData();
    this.getWeek();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios.get(this.API + "/api/v1/serve/next").then(res => {
        console.log(res.data, "serve/next");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.data = resdata.data;
          Toast.clear();
        } else {
          Toast.clear();
          Toast(resdata.msg);
        }
      });
    },
    // 获取服务时间左边
    getWeek() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios.get(this.API + "/api/v1/serve/week").then(res => {
        console.log(res.data, "serve/week");
        let resdata = res.data;
        if (resdata.code == 200) {
          Toast.clear();
          this.weekday = resdata.data.weekday;
          console.log(this.weekday);
          Toast.loading({ mask: true, message: "加载中..." });
          this.axios
            .get(this.API + "/api/v1/serve/time", {
              params: {
                weekday: this.weekday[0]
              }
            })
            .then(res => {
              console.log(res.data, "serve/time");
              let resdata = res.data;
              if (resdata.code == 200) {
                Toast.clear();
                this.righttime = resdata.data.time;
              } else {
                Toast.clear();
                Toast(resdata.msg);
              }
            });
        } else {
          Toast.clear();
          Toast(resdata.msg);
        }
      });
    },
    onshowmodel() {
      if (this.showmodel) {
        this.showmodel = false;
      } else {
        this.showmodel = true;
      }
    },
    checkedData(res) {
      console.log(res);

      let beautiarr = this.data.beautician;
      this.beautician_id = beautiarr[res].id;
      this.beautician_name = beautiarr[res].username;
      for (let v of beautiarr) {
        // if ((v.id = this.beautician_id)) {
        //   console.log(v.id);
        //   console.log(v.username);
        // }
      }
      this.showmodel = false;
    },

    time() {
      if (this.timemodel) {
        this.timemodel = false;
      } else {
        this.timemodel = true;
      }
    },
    selectPro(index) {
      console.log(index, this.weekday[index]);
      this.left = this.weekday[index];
      this.activeTitle = index;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/serve/time", {
          params: {
            weekday: this.weekday[index]
          }
        })
        .then(res => {
          console.log(res.data, "serve/time");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
            this.righttime = resdata.data.time;
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
    toDetail(indexs) {
      console.log(this.righttime[indexs], "indexs");
      this.activeIndexs = indexs;
      this.right = this.righttime[indexs];

      if (this.left) {
        this.serve_time = `${this.left} ${this.right}`;
      } else {
        this.serve_time = `${this.weekday[0]} ${this.right}`;
      }
      console.log(this.serve_time);
      this.timemodel = false;
    },
    // 去付款
    toSuccess() {
      // this.$router.push({ path: "/successful" });
      // return false;
      if (this.serve_time == "") {
        Toast("请选择服务时间");
        return;
      }
      if (this.beautician_id == "") {
        Toast("请选择美容师");
        return;
      }

      Toast.loading({ mask: true, message: "加载中..." });
      let param = new URLSearchParams();
      param.append("serve_ids", this.$route.query.serve_ids);
      param.append("beautician_id", this.beautician_id);
      param.append("serve_time", this.serve_time);
      param.append("total_price", this.data.total_price);

      this.axios
        .post(this.API + "/api/v1/serve/apply", param)
        .then(res => {
          console.log(res.data, "serve/apply");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.order_id = resdata.data.id;
            this.axios
              .get(this.API + "/api/v1/wechat/config", {
                params: {
                  store_id: JSON.parse(window.localStorage.getItem("store_id")),
                  url: location.href.split("#")[0]
                }
              })
              .then(res => {
                let resdata = res.data;
                if (resdata.code == 200) {
                  if (resdata.data.length == 0) {
                    Toast(resdata.msg);
                  }
                  wx.config({
                    debug: false,
                    appId: resdata.data.appId, // 必填，公众号的唯一标识
                    nonceStr: resdata.data.nonceStr, // 必填，生成签名的随机串
                    signature: resdata.data.signature, // 必填，签名，见附录1
                    timestamp: resdata.data.timestamp, // 必填，生成签名的时间戳
                    url: resdata.data.url,
                    jsApiList: ["chooseWXPay", "translateVoice"]
                  });
                  let param = new URLSearchParams();
                  param.append("order_id", this.order_id);
                  this.axios
                    .post(this.API + "/api/v1/serve/pay", param)
                    .then(res => {
                      let resdata = res.data;
                      if (resdata.code == 200) {
                        wx.chooseWXPay({
                          timestamp: resdata.data.timeStamp, // 支付签名时间戳
                          nonceStr: resdata.data.nonceStr, // 支付签名随机串，不长于 32 位
                          package: resdata.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                          signType: resdata.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                          paySign: resdata.data.paySign, // 支付签名
                          success: function(res) {
                            // 支付成功后的回调函数
                            Dialog.alert({
                              message: "微信支付成功"
                            }).then(() => {
                              window.location.href = `${
                                location.origin
                              }/successful`;
                            });
                          }
                        });
                      } else {
                        Toast.clear();
                        Toast(resdata.msg);
                      }
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
.fz11 {
  font-size: 11px;
}

.fz13 {
  font-size: 13px;
}

.ser_box {
  padding-bottom: 10px;
}

.footer {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 50px;
  line-height: 50px;
}

.btn {
  width: 100px;
  height: 50px;
  line-height: 50px;
  color: #fff;
  background: linear-gradient(90deg, #ff5491, #fe4171);
}

.title .closeicon {
  position: absolute;
  right: 10px;
  top: 18px;
  font-size: 20px;
}

.title {
  font-size: 16px;
  padding: 15px 0;
  border-bottom: 1px solid #b7b7b7;
}

.right_box {
  margin-left: 10px;
}

.number {
  padding: 5px 0;
}

.head_img > img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

/* 选择服务时间 */
.select_container {
  height: 280px;
  overflow: hidden;
  background: #fff;
  display: flex;
  position: relative;
}

/* 左侧 */
.left {
  width: 150px;
  height: 280px;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
}

.left_item {
  width: 150px;
  height: 100%;
  list-style: none;
  overflow-x: hidden;
  overflow-y: scroll;
  background: #eee;
}

.left_item > div {
  padding: 15px 5px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 选中 */
.pro_active {
  background: #fff;
  color: #fc4f88;
  border-left: 3px solid #fc4f88;
  font-weight: 700px;
}

.pro_time {
  color: #fc4f88;
}

/* 右侧 */
.right {
  width: 160px;
  height: 280px;
  position: absolute;
  top: 0;
  left: 150px;
}

.right ul {
  width: 160px;
  height: 100%;
  text-align: center;
  list-style: none;
  overflow-x: hidden;
  overflow-y: scroll;
}

.item-right {
  width: 100%;
  padding: 15px 5px;
  border-bottom: 1px solid #eee;
  text-align: center;
}
</style>
