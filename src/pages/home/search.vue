<template>
  <div>
    <!-- <div class="mar-b-10">
      <van-search placeholder="请输入搜索关键词" v-model.trim="value" show-action>
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
    </div>-->
    <div id="search" class="mar-b-10">
      <van-search
        v-model.trim="seavalue"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        background="#fff"
      >
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
    </div>
    <div class="bgc merch-box">
      <div class="flexbox merchlist" v-for="(item,index) in merchant" @click="merDetail(item.id)">
        <img class="img_slt" :src="item.cover_url">
        <div class="flex-column-space-between right">
          <div class="flex-jc-between">
            <div>{{item.name}}</div>
            <div>{{item.distance}}km</div>
          </div>
          <div class="fsz12 flex-align-items">
            <van-rate
              v-model="item.grade"
              :size="10"
              :count="5"
              color="#FFB10E"
              void-color="#ceefe8"
            />
            <span>{{item.grade}}分</span>
          </div>
          <div class="pro_title fsz12" @click.stop="getlocat">
            <img class="img_location" src="../../assets/photo/location.png">
            <div style="width: 210px; " class="newline">{{item.address}}</div>
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
      seavalue: "",

      merchant: []
    };
  },
  created() {
    // let searchSession = JSON.parse(
    //   window.sessionStorage.getItem("searchSession")
    // );
    // if (searchSession) {
    //   this.value = searchSession.value;
    // }
    console.log(this.seavalue);
    // this.getMerchant();
  },
  methods: {
    // 获取搜索结果
    getMerchant() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/merchant", {
          params: { keyword: this.seavalue }
        })
        .then(res => {
          console.log(res.data, "merchant");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.merchant = resdata.data;
            if (this.merchant.length == 0) {
              Toast("暂无数据");
            }
            Toast.clear();
          } else if (resdata.code == 40005) {
            this.$router.push({
              path: "/"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }
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
    // 店铺详情
    merDetail(id) {
      let searchSession = {
        value: this.value
      };
      window.sessionStorage.setItem(
        "searchSession",
        JSON.stringify(searchSession)
      );
      this.$router.push({
        path: "/merchantDetail/",
        query: {
          id: id
        }
      });
    },
    onSearch() {
      console.log(this.seavalue);
      this.getMerchant();
    }
  }
};
</script>

<style>
#search .van-search__content {
  border-radius: 20px;
}
</style>


<style scoped>
.merchlist {
  border-bottom: 10px solid #f0f0f0;
}
.merchlist:last-child {
  border: none;
}
.img_slt {
  width: 80px;
  height: 80px;
  padding: 15px;
  border-radius: 20px;
}
.right {
  width: 200px;
  padding: 15px 0;
}
.pro_title {
  display: flex;
  color: #979797;
  font-size: 12px;
}
.img_location {
  width: 11px;
  height: 14px;

  padding: 3px 5px 0 0;
}
</style>
