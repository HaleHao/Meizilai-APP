<template>
  <div>
    <div class="pd-lr-15 sear_box flex-jc-between">
      <div class="flex-align-items text-line" @click="showarea=true" style="width:90px">
        <div>{{areaval==''?'深圳市':areaval[1].name}}</div>
        <img class="img_sanjiao" src="../../assets/photo/sanjiao.png">
      </div>

      <div id="searchs">
        <van-search
          v-model="value"
          placeholder="搜索店铺"
          show-action
          @search="onSearch"
          background="#f7f7f7"
        >
          <div slot="action" @click="onSearch" class="sear-btn">搜索</div>
        </van-search>
      </div>
    </div>
    <div v-show="list.length==0" class="pd-15 text-c">暂无搜索结果</div>
    <div class="shoplist">
      <div v-for="(item,index) in list" :key="index" :title="item" @click="goshopDetail(item.id)">
        <div class="item">
          <div class="flex-jc-between">
            <div class="shop_title">{{item.name}}</div>
            <div>{{item.distance}}km</div>
          </div>
          <div class="flexbox" style=" padding-top: 10px;" @click="getlocat">
            <img class="img_location" src="../../assets/photo/location.png">
            <div class="fz12 fc-grey">{{item.address}}</div>
          </div>
        </div>
      </div>
    </div>

    <van-popup v-model="showarea" position="bottom" :close-on-click-overlay="false">
      <van-area
        :area-list="areaList"
        :columns-num="2"
        @cancel="showarea=false"
        @confirm="onconfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import area from "@/utils/area.js";
import { Toast } from "vant";
export default {
  data() {
    return {
      list: [],
      value: "",
      areaval: "",
      showarea: false,
      areaList: area,
      show: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
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

    getList() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/store/list", {
          params: {
            city: "深圳市"
          }
        })
        .then(res => {
          console.log(res.data, "list");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.list = resdata.data;
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
    // 搜索

    onSearch() {
      if (this.value == "") {
        Toast("请输入店铺名");
        return;
      }

      if (this.areaval) {
        Toast.loading({ mask: true, message: "加载中..." });
        this.axios
          .get(this.API + "/api/v1/store/list", {
            params: {
              city: this.areaval[1].name,
              keyword: this.value
            }
          })
          .then(res => {
            console.log(res.data, "list");
            let resdata = res.data;
            if (resdata.code == 200) {
              this.list = resdata.data;
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
      } else {
        Toast.loading({ mask: true, message: "加载中..." });
        this.axios
          .get(this.API + "/api/v1/store/list", {
            params: {
              city: "深圳市",
              keyword: this.value
            }
          })
          .then(res => {
            console.log(res.data, "list");
            let resdata = res.data;
            if (resdata.code == 200) {
              this.list = resdata.data;
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
      }
    },
    goshopDetail(id) {
      // this.$router.push({
      //   path: "/shopDetail",
      //   query: {
      //     id: id
      //   }
      // });
    },
    onconfirm(val) {
      console.log(val);
      this.areaval = val;
      this.showarea = false;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/store/list", {
          params: {
            city: this.areaval[1].name,
            keyword: this.value
          }
        })
        .then(res => {
          console.log(res.data, "list");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.list = resdata.data;
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
    }
  }
};
</script>


<style>
#searchs {
  width: 250px;
}
#searchs .van-search__content {
  border-radius: 20px;
  background: #fff;
}

#searchs .van-search {
  padding: 0;
  background: red;
}
</style>
<style scoped>
.fz12 {
  font-size: 12px;
}
.img_sanjiao {
  width: 12px;
  height: 10px;
  margin-right: 5px;
}
.sear_box {
  padding-top: 10px;
  font-size: 13px;
}
/* .sear {
  width: 220px;
  height: 30px;
  line-height: 30px;
  border-radius: 20px;
  background: #fff;
}

.sear .van-icon {
  padding-left: 80px;
} */
.sear-btn {
}
.shoplist {
  margin-bottom: 60px;
}
.item {
  background: #fff;
  padding: 10px 20px;
  margin: 12px 14px 0 14px;
  border-radius: 10px;
  box-shadow: 1px 0px 6px 1px rgba(237, 237, 237, 1);
}
.shop_title {
  font-size: 15px;
  font-weight: 600;
}
.img_sanjiao {
  width: 12px;
  height: 10px;
}
.img_location {
  width: 12px;
  height: 16px;
  margin-right: 5px;
}
</style>