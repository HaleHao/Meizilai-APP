<template>
  <div>
    <div class="flexbox flex-align-items bgc pd-tb-15">
      <div class="pd-lr-15">
        <img class="img_header" :src="data.avatar">
      </div>

      <div>
        <div class="name">{{data.name}}</div>
        <div class="fz12 fc-grey ser_number">服务{{data.serve_num}}次</div>
        <div class="fc-fen">好评 {{data.grade}}%</div>
      </div>
    </div>
    <div class="bgc pd-15 address">
      <div>{{store.name}}</div>
      <div class="flexbox" style=" padding-top: 10px;" @click="getlocat">
        <img class="img_location" src="../../assets/photo/location.png">
        <div class="fz12 fc-grey">{{store.province+store.city+store.district+store.address}}</div>
      </div>
    </div>
    <div class="word_mouth_box bgc">
      <div class="flex-jc-between pd-15 border-b" @click="toMore(data.id)">
        <div>服务评价</div>
        <div class="fc-grey flex-align-items">
          查看更多
          <van-icon name="arrow"/>
        </div>
      </div>
      <div class="word_mouth pd-lr-15">
        <div v-show="comment.length==0" class="text-c pd-15">该美容师暂无服务评价</div>
        <div v-for="(item,index) in comment" :key="index">
          <div class="flexbox pd-tb-15">
            <div class="head_img">
              <img :src="item.user.avatar">
            </div>
            <div class="pg-right">
              <div class="flex-jc-between">
                <div class="head_name">{{item.user.nickname}}</div>
                <div class="grey_12">
                  <div class="flex-align-items" v-if="item.grade==1">
                    <img class="pingjia_img" src="../../assets/photo/haoping.png">
                    <span>满意</span>
                  </div>
                  <div class="flex-align-items" v-else-if="item.grade==2">
                    <img class="pingjia_img" src="../../assets/photo/yiban.png">
                    <span>一般</span>
                  </div>
                  <div class="flex-align-items" v-else>
                    <img class="pingjia_img" src="../../assets/photo/chaping.png">
                    <span>不满意</span>
                  </div>
                </div>
              </div>

              <div class="com_det">{{item.content}}</div>
              <div class="imglist_b">
                <div class="imglist" v-for="(items,indexs) in item.images" :key="indexs">
                  <img class="itemimg" :src="items">
                </div>
              </div>
              <div class="flex-jc-between grey_12">
                <div>美容师:{{data.name}}</div>
                <div>{{item.comment_time}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      state: 1,
      data: "",
      comment: [],
      store: ""
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/store/beautician/detail", {
          params: {
            beautician_id: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res.data, "beautician/detail");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;
            this.comment = resdata.data.comment;
            this.store = resdata.data.store;
            console.log(resdata.data.comment);
            Toast.clear();
          } else if (resdata.code == 40005) {
            this.$router.push({
              path: "/shopDetail"
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

    // 一键导航 打开地图

    getlocat() {
      if (JSON.parse(window.localStorage.getItem("access_token"))) {
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
                url: location.href.split("#")[0],
                jsApiList: [
                  "checkJsApi",
                  "translateVoice",
                  "openLocation",
                  "getLocation"
                ]
              });

              wx.checkJsApi({
                jsApiList: ["checkJsApi", "openLocation", "translateVoice"],
                success: function(res) {
                  if (res.checkResult.openLocation == false) {
                    alert(
                      "你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！"
                    );
                    return;
                  }
                }
              });
              Toast.loading({ mask: true, message: "加载中..." });
              // 获取后台传过来经纬度
              this.axios
                .get(this.API + "/api/v1/location", {
                  params: {
                    store_id: JSON.parse(
                      window.localStorage.getItem("store_id")
                    )
                  }
                })
                .then(res => {
                  console.log(res.data, "location");
                  let resdata = res.data;
                  if (resdata.code == 200) {
                    Toast.clear();

                    //使用微信内置地图查看位置接口
                    wx.openLocation({
                      latitude: parseFloat(resdata.data.lat), // 纬度，浮点数，范围为90 ~ -90
                      longitude: parseFloat(resdata.data.lng), // 经度，浮点数，范围为180 ~ -180。
                      name: resdata.data.name, // 位置名
                      address: resdata.data.address, // 地址详情说明
                      scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
                      infoUrl: location.href.split("#")[0] // 在查看位置界面底部显示的超链接,可点击跳转（测试好像不可用）
                    });
                  } else if (resdata.code == 40005) {
                    let store_id = JSON.parse(
                      window.localStorage.getItem("store_id")
                    );
                    this.login(store_id);
                  } else {
                    Toast(resdata.msg);
                  }
                })
                .catch(error => {
                  Toast.clear();
                  Toast("网络出错");
                });
            }
          });
      }
    },

    // 更多
    toMore(id) {
      this.$router.push({
        path: "/beautyComment",
        query: {
          id: id
        }
      });
    }
  }
};
</script>

<style scoped>
.fz12 {
  font-size: 12px;
}

.name {
  font-size: 15px;
  font-weight: 600;
}
.ser_number {
  padding: 5px 0;
}
.img_header {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.address {
  margin-top: 10px;
}
.img_location {
  width: 12px;
  height: 16px;
  margin-right: 10px;
}
.grey_12 {
  font-size: 12px;
  color: #979797;
}
.word_mouth_box {
  margin-top: 10px;
}

.word_mouth {
  height: 100%;
}
.pg-right {
  width: 250px;
}
.word_mouth > div {
  border-bottom: 1px solid #f0f0f0;
}

.word_mouth :last-child {
  border-bottom: 1px solid #fff;
}
.head_name {
  padding: 3px 0;
}
.pingjia_img {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
.head_img > img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.imglist_b {
  padding: 5px 0;
}
.imglist {
  display: inline-block;
  margin-top: 4px;
}
.itemimg {
  width: 63px;
  height: 63px;
  margin-right: 7px;
  border-radius: 5px;
}
</style>

