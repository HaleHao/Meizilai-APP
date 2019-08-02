<template>
  <div>
    <div class="bgc pd-15 border-b">
      <div class="title">{{data.title}}</div>
      <div class="flexbox pd-tb-15">
        <div class="fc-grey fsz12">{{data.time}}</div>
      </div>

      <div class="imglist_box">
        <img class="itemimg" :src="data.cover_url">
      </div>
      <div v-html="data.content"></div>
      <div style="height:40px"></div>
      <div class="flex-center bgc img_box" @click="share">
        <img class="img_fenxiang" src="../../assets/photo/fenxiang.png">
      </div>
    </div>
    <!-- 分享弹窗 -->
    <div class="fenxiang-fixed flex-center" v-show="clickShare">
      <div>
        <div class="jiantou-box">
          <img class="jiantou" src="../../assets/photo/jiantou.png">
          <div class="flex-align-items">
            <div class="num-ss">2</div>
            <div>分享第二步，点击右上角哦</div>
            <div class="sandian_box bgc text-c">...</div>
          </div>
        </div>

        <div class="flex-align-items">
          <div class="num-ss">1</div>
          <div>分享第一步，点击</div>
          <div class="img_fenx_box bgc flex-center">
            <img class="img_fenx" src="../../assets/photo/fenxiang.png">
          </div>
        </div>
        <div class="text-c" @click="clickShare=false">
          <img class="zhidao" src="../../assets/photo/zhidao.jpg">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
export default {
  data() {
    return {
      data: "",
      clickShare: false
    };
  },
  created() {
    this.getData();
    this.showMenu();
  },
  methods: {
    showMenu() {
      WeixinJSBridge.call("showOptionMenu"); //显示右上角三个点按钮

      // 获取微信初始化完成响应事件，初始化完成调用sendMessage进行绑定。
      if (document.addEventListener) {
        document.addEventListener("WeixinJSBridgeReady", sendMessage, false);
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", sendMessage);
        document.attachEvent("onWeixinJSBridgeReady", sendMessage);

        this.share();
      }
      // WeixinJSBridge.call("hideOptionMenu"); //隐藏右上角三个点按钮
    },

    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/event/detail", {
          params: {
            event_id: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res.data, "report/detail");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;
            Toast.clear();
          } else if (resdata.code == 40005 || resdata.code == 20001) {
            window.localStorage.removeItem("access_token");
            this.$router.push({
              path: "/wechatAuth",
              query: {
                store_id: JSON.parse(window.localStorage.getItem("store_id")),
                first_user_id: JSON.parse(
                  window.localStorage.getItem("first_user_id")
                )
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
    },
    // 分享
    share() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/share", {
          params: {
            url: location.href.replace("#", ""),
            id: this.$route.query.id,
            type: 5
          }
        })
        .then(res => {
          console.log(res.data, "goods/share");
          let resdata = res.data;
          if (resdata.code == 200) {
            let sharedata = resdata.data;
            this.clickShare = true;
            let store_id = JSON.parse(window.localStorage.getItem("store_id")); // 获取参数store_id
            let first_user_id = JSON.parse(
              window.localStorage.getItem("first_user_id")
            ); // 获取参数first_user_id
            // let url = `${location.origin}/app/#/ProductDetail?id=${
            //   this.$route.query.id
            // }&store_id=${store_id}&first_user_id=${first_user_id}`;

            this.axios
              .get(this.API + "/api/v1/wechat/config", {
                params: {
                  store_id: JSON.parse(window.localStorage.getItem("store_id")),
                  url: location.href.split("#")[0]
                }
              })
              .then(res => {
                console.log(res.data, "config");
                let resdata = res.data;

                if (resdata.code == 200) {
                  wx.config({
                    debug: false,
                    appId: resdata.data.appId, // 必填，公众号的唯一标识
                    nonceStr: resdata.data.nonceStr, // 必填，生成签名的随机串
                    signature: resdata.data.signature, // 必填，签名，见附录1
                    timestamp: resdata.data.timestamp, // 必填，生成签名的时间戳
                    url: resdata.data.url,
                    jsApiList: [
                      "translateVoice",
                      "updateTimelineShareData",
                      "updateAppMessageShareData", //(1.4.0)
                      "onMenuShareAppMessage",
                      "onMenuShareTimeline" //(1.4.0以前的接口这个要加上否则微信分享无效)
                    ]
                  });

                  Toast.clear();

                  WeixinJSBridge.on("menu:share:appmessage", function(argv) {
                    this.clickShare = false;
                    WeixinJSBridge.invoke(
                      "sendAppMessage",
                      {
                        appid: resdata.data.appId, //appid 设置空就好了。
                        img_url: sharedata.img_url, //分享时所带的图片路径
                        img_width: "120", //图片宽度
                        img_height: "120", //图片高度
                        link: sharedata.url, //分享附带链接地址
                        desc: sharedata.desc, //分享内容介绍
                        title: sharedata.title
                      },
                      function(res) {
                        this.clickShare = false;
                        Dialog.alert({
                          message: "分享成功"
                        }).then(() => {
                          this.clickShare = false;
                        });
                      }
                    );
                  });

                  WeixinJSBridge.on("menu:share:timeline", function(argv) {
                    this.clickShare = false;
                    WeixinJSBridge.invoke(
                      "shareTimeline",
                      {
                        appid: resdata.data.appId, //appid 设置空就好了。
                        img_url: sharedata.img_url, //分享时所带的图片路径
                        img_width: "120", //图片宽度
                        img_height: "120", //图片高度
                        link: sharedata.url, //分享附带链接地址
                        desc: sharedata.desc, //分享内容介绍
                        title: sharedata.title
                      },
                      function(res) {
                        this.clickShare = false;
                        Dialog.alert({
                          message: "分享成功"
                        }).then(() => {
                          this.clickShare = false;
                        });
                      }
                    );
                  });
                } else if (resdata.code == 40005 || resdata.code == 20001) {
                  window.localStorage.removeItem("access_token");
                  this.$router.push({
                    path: "/wechatAuth",
                    query: {
                      store_id: JSON.parse(
                        window.localStorage.getItem("store_id")
                      ),
                      first_user_id: JSON.parse(
                        window.localStorage.getItem("first_user_id")
                      ),
                      url: location.href
                    }
                  });
                } else {
                  Toast.clear();
                  Toast(resdata.msg);
                }
              });
          } else if (resdata.code == 40005 || resdata.code == 20001) {
            window.localStorage.removeItem("access_token");
            this.$router.push({
              path: "/wechatAuth",
              query: {
                store_id: JSON.parse(window.localStorage.getItem("store_id")),
                first_user_id: JSON.parse(
                  window.localStorage.getItem("first_user_id")
                ),
                url: location.href
              }
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }

          Toast.clear();
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
.fsz12 {
  font-size: 12px;
}
.border-l {
  border-left: #f0f0f0 1px solid;
}
.title {
  font-size: 17px;
  font-weight: 600;
}
.img_logo {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
}

.itemimg {
  width: 290px;
  height: 190px;
  margin-bottom: 10px;
}

.img_fenxiang {
  width: 15px;
  height: 16px;
}
.photo {
  padding-top: 15px;
}
.photo img {
  border-radius: 10px;
}
.img_box {
  width: 100%;
  height: 40px;
  position: fixed;
  bottom: 0;
}

.fenxiang-fixed {
  position: fixed;
  overflow: hidden;
  height: 120%;
  width: 100%;
  z-index: 90;
  background: #cecece;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9;
}

.zhidao {
  height: 50px;
  width: 120px;
  border-radius: 30%;
  margin-top: 20px;
}
.num-ss {
  height: 18px;
  width: 18px;
  line-height: 18px;
  border-radius: 50%;
  text-align: center;
  font-size: 15px;
  color: #fff;
  border: 2px solid #f6f6f6;
  margin-right: 5px;
}
.sandian_box {
  font-size: 20px;
  width: 35px;
  height: 35px;
  /* line-height: 35px; */
  margin-left: 5px;
  border-radius: 50%;
}
.img_fenx_box {
  height: 35px;
  width: 35px;
  margin-left: 5px;
  border-radius: 50%;
}
.img_fenx {
  height: 20px;
  width: 20px;
}

.jiantou-box {
  position: absolute;
  top: 30px;
  right: 30px;
}
.jiantou {
  height: 60px;
  width: 40px;
  margin-left: 150px;
}
</style>


