<template>
  <div class="bgc full">
    <div class="nav flex-jc-around">
      <div :class="{ 'selected': typenum==0 }" @click="selectSore">门店自提</div>
      <div :class="{ 'selected': typenum==1 }" @click="selectPost">快递配送</div>
    </div>
    <div v-show="typenum==0" class="pd-15">
      <div class="card">
        <div class="bgc flex-align-items item">
          <!-- <van-checkbox v-model="checked" checked-color="#ff5491" @change="checkedStore"></van-checkbox> -->
          <div class="flex-1">
            <div class="mar-b-10 flex-jc-between">
              <div>{{store.name}}</div>
              <div>1.2km</div>
            </div>
            <div class="flexbox" @click="getlocat">
              <div>
                <img class="img_location" src="../../assets/photo/location.png">
              </div>
              <div
                class="newline"
                style="width:250px"
              >{{store.province+store.city+store.district+store.address}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="typenum==1" class="pd-15">
      <van-radio-group v-model="radio" @change="onchoose">
        <div v-for="(item,index) in list" :key="index" class="card bgc mar-b-10">
          <van-swipe-cell :right-width="65" :on-close="onClose">
            <div class="bgc flex-align-items item">
              <!-- <van-radio :name="index" checked-color="#ff5491"></van-radio> -->
              <div class="flex-1" @click="radio=index">
                <div style="margin-bottom:5px">{{item.consignee}} {{item.mobile}}</div>
                <div class="newline" style="padding:3px 0">
                  <span class="moren border-fen fc-fen" v-if="item.is_default==1">默认</span>
                  <span>{{item.province+item.city+item.district+item.address}}</span>
                </div>
              </div>

              <img class="img_editor" src="../../assets/photo/editor.png" @click="edit(item.id)">
            </div>
            <div slot="right" class="del" @click="del(item.id)">删除</div>
          </van-swipe-cell>
        </div>
      </van-radio-group>
      <div v-if="list.length==0" class="text-c">暂无配送地址</div>
      <div class="add">
        <router-link to="/addInformation">
          <div class="btn text-c">新增地址</div>
        </router-link>
      </div>
      <div class="height" v-show="list.length>7"></div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      typenum: 1,
      list: [{}, {}, {}, {}, {}, {}],
      radio: -1,
      delid: "",
      checked: false,
      store: [],
      delid: ""
    };
  },
  created() {
    this.selectPost();
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
    selectSore() {
      let point = JSON.parse(window.localStorage.getItem("pointSession"));
      console.log(point, "pointSession");

      this.typenum = 0;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/address/store", {
          params: {
            latitude: point.pointY,
            longitude: point.pointX
          }
        })
        .then(res => {
          console.log(res.data, "address/store");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.store = resdata.data[0];

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
    selectPost() {
      this.typenum = 1;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/address/list")
        .then(res => {
          console.log(res.data, "address/list");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.list = resdata.data;

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
    // 删除
    onClose(clickPosition, instance) {
      switch (clickPosition) {
        case "left":
        case "cell":
        case "outside":
          instance.close();
          break;
        case "right":
          Dialog.confirm({
            message: "确定删除吗？"
          }).then(e => {
            if (e == "confirm") {
              let param = new URLSearchParams();
              param.append("address_id", this.delid);
              Toast.loading({ mask: true, message: "加载中..." });
              this.axios
                .post(this.API + "/api/v1/address/del", param)
                .then(res => {
                  console.log(res.data, "address");
                  let resdata = res.data;
                  if (resdata.code == 200) {
                    Toast.clear();
                    Toast(resdata.message);
                    this.selectPost();
                  } else {
                    Toast.clear();
                    Toast(resdata.message);
                  }
                })
                .catch(error => {
                  Toast.clear();
                  Toast("网络出错");
                });
            }
          });
          break;
      }
    },
    del(id) {
      console.log(id);
      this.delid = id;
    },
    edit(id) {
      this.$router.push({
        path: "/addInformation",
        query: {
          id: id
        }
      });
    },
    onchoose(val) {
      console.log(val);
    },
    checkedStore(val) {
      console.log(val);
    }
  }
};
</script>


<style scoped>
.nav {
  padding: 10px 60px;
  background: #f6f6f6;
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

.height {
  height: 85px;
}
.add {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 15px;
  background: #fff;
  box-sizing: border-box;
}
.btn {
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #ff5491, #fe4171);
}

.del {
  background-color: #d2d2d2;
  color: #fff;
  width: 65px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  box-shadow: 2px 3px 8px 1px rgba(222, 220, 220, 0.5);
  border-radius: 8px;
  overflow: hidden;
}
.card .item {
  padding: 10px;
}
.card .left {
  padding: 0 10px;
}
.moren {
  padding: 0 5px;
  font-size: 12px;
  border-radius: 5px;
}
.img_editor {
  width: 20px;
  height: 20px;
  margin-left: 10px;
}

.img_location {
  width: 12px;
  height: 16px;
  margin-right: 5px;
}
</style>
