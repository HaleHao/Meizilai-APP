<template>
  <div>
    <div class="bgc">
      <div class="bgc pd-15">
        <div class="sear" @click="gosearch">
          <div class="flex-align-items">
            <img class="search-img" src="../../assets/photo/search.png">
          </div>
          <span class="fc-grey fz12">搜索商家名</span>
        </div>
      </div>
    </div>
    <div id="mernav">
      <van-tabs @click="ontab">
        <van-tab :title="item.title" v-for="(item,index) in navlist" :key="index">
          <div class="nav bgc border-b">
            <!-- <div :class="{ 'selected': typenum==0 }" @click="show=true">
                          {{areaval==''?'深圳市':areaval}}
                          <img
                            class="img_sanjiao"
                            src="../../assets/photo/icon-triangle.png"
                          >
            </div>-->
            <div @click="showarea=true" class="flex-align-items" style="width:70px">
              <span>{{areaval==''?city:areaval[1].name}}</span>
              <img class="img_sanjiao" src="../../assets/photo/icon-triangle.png">
            </div>
            <div class="select-box">
              <div
                :class="{ 'selected': typenum==index }"
                id="selected"
                v-for="(item,index) in selectitle"
                @click="selecTed(index)"
              >{{item}}</div>
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

          <div class="bgc merch-box">
            <div v-show="merchant.length==0" class="pd-15 text-c">暂无相应商家</div>
            <div
              class="flexbox merchlist"
              v-for="(item,index) in merchant"
              @click="merchantDetail(item.id)"
            >
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
                <div class="pro_title fsz12" @click.stop="getlocat(item)">
                  <img class="img_location" src="../../assets/photo/location.png">
                  <div style="width: 190px; " class="newline">{{item.address}}</div>
                </div>
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
import area from "@/utils/area.js";
import wx from "weixin-js-sdk";

export default {
  data() {
    return {
      navlist: [],
      merchant: [],
      selectitle: ["距离最近", "评价最高", "最新入驻"],
      typenum: -2,
      type: "",
      show: false,
      showarea: false,
      value: "",
      areaval: "",
      city: "深圳市",
      areaList: area,
      category_id: "",
      latitude: "",
      longitude: ""
    };
  },

  created() {
    this.getCategory();
    console.log(this.typenum);
    let point = JSON.parse(window.localStorage.getItem("pointSession"));
    console.log(point, "pointSession");
    this.latitude = point.pointY;
    this.longitude = point.pointX;
  },
  methods: {
    // 一键导航 打开地图
    getlocat(item) {
      console.log(item, "item");

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

              //使用微信内置地图查看位置接口
              wx.openLocation({
                latitude: parseFloat(item.lat), // 纬度，浮点数，范围为90 ~ -90
                longitude: parseFloat(item.lng), // 经度，浮点数，范围为180 ~ -180。
                name: item.name, // 位置名
                address: item.address, // 地址详情说明
                scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: location.href.split("#")[0] // 在查看位置界面底部显示的超链接,可点击跳转（测试好像不可用）
              });
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
          });
      }
    },

    selecTed(index) {
      console.log(index);
      this.typenum = index;
      this.type = this.typenum + 1;
      console.log(this.category_id, "this.category_id");
      // 有城市
      if (this.areaval) {
        //有条件
        if (this.category_id) {
          Toast.loading({ mask: true, message: "加载中..." });
          this.axios
            .get(this.API + "/api/v1/merchant", {
              params: {
                category_id: this.category_id,
                city: this.areaval[1].name,
                type: this.type,
                latitude: this.latitude,
                longitude: this.longitude
              }
            })
            .then(res => {
              console.log(res.data, "merchant");

              let resdata = res.data;
              if (resdata.code == 200) {
                this.merchant = resdata.data.list;
                this.city = resdata.data.city;

                Toast.clear();
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
                    )
                  }
                });
              } else {
                Toast.clear();
                Toast(resdata.msg);
              }
            });
        } else {
          Toast.loading({ mask: true, message: "加载中..." });
          this.axios
            .get(this.API + "/api/v1/merchant", {
              params: {
                category_id: this.navlist[0].id,
                city: this.areaval[1].name,
                type: this.type,
                latitude: this.latitude,
                longitude: this.longitude
              }
            })
            .then(res => {
              console.log(res.data, "merchant");

              let resdata = res.data;
              if (resdata.code == 200) {
                this.merchant = resdata.data.list;
                this.city = resdata.data.city;

                Toast.clear();
              } else if (resdata.code == 40005) {
                this.$router.push({
                  path: "/"
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
                    )
                  }
                });
              } else {
                Toast.clear();
                Toast(resdata.msg);
              }
            });
        }
      } else {
        // 无城市
        if (this.category_id) {
          Toast.loading({ mask: true, message: "加载中..." });
          this.axios
            .get(this.API + "/api/v1/merchant", {
              params: {
                category_id: this.category_id,
                type: this.type,
                latitude: this.latitude,
                longitude: this.longitude
              }
            })
            .then(res => {
              console.log(res.data, "merchant");

              let resdata = res.data;
              if (resdata.code == 200) {
                this.merchant = resdata.data.list;
                this.city = resdata.data.city;
                Toast.clear();
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
                    )
                  }
                });
              } else {
                Toast.clear();
                Toast(resdata.msg);
              }
            });
        } else {
          Toast.loading({ mask: true, message: "加载中..." });
          this.axios
            .get(this.API + "/api/v1/merchant", {
              params: {
                category_id: this.navlist[0].id,
                type: this.type,
                latitude: this.latitude,
                longitude: this.longitude
              }
            })
            .then(res => {
              console.log(res.data, "merchant");

              let resdata = res.data;
              if (resdata.code == 200) {
                this.merchant = resdata.data.list;
                this.city = resdata.data.city;
                Toast.clear();
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
                    )
                  }
                });
              } else {
                Toast.clear();
                Toast(resdata.msg);
              }
            });
        }
      }
    },

    // 获取导航标题
    getCategory() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios.get(this.API + "/api/v1/merchant/category").then(res => {
        console.log(res.data, "category");

        let resdata = res.data;
        if (resdata.code == 200) {
          this.navlist = resdata.data;
          this.getMerchant();
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
      });
    },
    // distance:离我最近 ， evaluate：评分最好 ，new：最新 ，keyword:搜索关键字
    getMerchant() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/merchant", {
          params: {
            category_id: this.navlist[0].id,
            type: this.type,
            latitude: this.latitude,
            longitude: this.longitude
          }
        })
        .then(res => {
          console.log(res.data, "merchant");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.merchant = resdata.data.list;
            this.city = resdata.data.city;
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
        });
    },
    ontab(index, title) {
      console.log(this.navlist[index]);
      this.category_id = this.navlist[index].id;
      console.log(this.category_id, "this.category_id");

      if (this.areaval) {
        Toast.loading({ mask: true, message: "加载中..." });
        this.axios
          .get(this.API + "/api/v1/merchant", {
            params: {
              category_id: this.category_id,
              city: this.areaval[1].name,
              type: this.type,
              latitude: this.latitude,
              longitude: this.longitude
            }
          })
          .then(res => {
            console.log(res.data, "merchant");

            let resdata = res.data;
            if (resdata.code == 200) {
              this.merchant = resdata.data.list;
              this.city = resdata.data.city;

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
          .get(this.API + "/api/v1/merchant", {
            params: {
              category_id: this.category_id,
              type: this.type,
              latitude: this.latitude,
              longitude: this.longitude
            }
          })
          .then(res => {
            console.log(res.data, "merchant");

            let resdata = res.data;
            if (resdata.code == 200) {
              this.merchant = resdata.data.list;
              this.city = resdata.data.city;
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
          });
      }
    },
    onconfirm(val) {
      console.log(val);
      this.areaval = val;
      this.showarea = false;

      if (this.category_id) {
        Toast.loading({ mask: true, message: "加载中..." });
        this.axios
          .get(this.API + "/api/v1/merchant", {
            params: {
              category_id: this.category_id,
              city: this.areaval[1].name,
              type: this.type,
              latitude: this.latitude,
              longitude: this.longitude
            }
          })
          .then(res => {
            console.log(res.data, "merchant");

            let resdata = res.data;
            if (resdata.code == 200) {
              this.merchant = resdata.data.list;
              this.city = resdata.data.city;

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
      } else {
        Toast.loading({ mask: true, message: "加载中..." });
        this.axios
          .get(this.API + "/api/v1/merchant", {
            params: {
              category_id: this.navlist[0].id,
              city: this.areaval[1].name,
              type: this.type,
              latitude: this.latitude,
              longitude: this.longitude
            }
          })
          .then(res => {
            console.log(res.data, "merchant");

            let resdata = res.data;
            if (resdata.code == 200) {
              this.merchant = resdata.data.list;
              this.city = resdata.data.city;

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
      }
    },
    gosearch() {
      this.$router.push({ path: "/search" });
    },
    // 详情
    merchantDetail(id) {
      console.log(id);

      this.$router.push({
        path: "/merchantDetail",
        query: {
          id: id
        }
      });
    },
    gonavigation() {
      this.$router.push({ path: "/navigation" });
    }
  }
};
</script>
<style>
#mernav .van-tabs__line {
  background-color: #fff;
  background-image: linear-gradient(90deg, #fe4171 100%, #ff5491 100%);
}

#mernav .van-tab {
  color: black;
}

#mernav .van-ellipsis {
  font-size: 14px;
}

#mernav .van-tab--active {
  color: #fe4171;
}
</style>

<style scoped>
.fz12 {
  font-size: 12px;
}

.sear {
  display: flex;
  height: 30px;
  line-height: 30px;
  border-radius: 20px;
  background: #f6f5f5;
  justify-content: center;
}

.img_sanjiao {
  width: 8px;
  height: 6px;
  margin-left: 3px;
}

.search-img {
  width: 16px;
  height: 16px;
}

.nav {
  padding: 5px 10px;
  display: flex;
  /* justify-content: space-around; */
}

.nav > div {
  height: 25px;
  line-height: 25px;
  text-align: center;
  box-sizing: border-box;
  font-size: 12px;
  margin-right: 3px;
}

.select-box {
  width: 240px;
  display: flex;
  justify-content: space-around;
}

.select-box > div {
  height: 25px;
  line-height: 25px;
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
  font-size: 12px;
  margin-right: 3px;
}

#selected {
  /* width: 65px; */
}

.nav .selected {
  color: #fe4171;
}

.fsz12 {
  font-size: 12px;
}

.fsz10 {
  font-size: 10px;
}

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
