<template>
  <div>
    <div class="flex-jc-center bgc">
      <div class="banner bgc">
        <van-swipe :autoplay="3000" indicator-color="#FC9745">
          <van-swipe-item v-for="(item, index) in detail.images" :key="index">
            <div class="img_box flex-center">
              <img :src="item.img_url">
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>

    <div class="bgc flex-jc-between pd-15 border-b">
      <div>
        <div class="text-line pro_title">{{detail.name}}</div>
        <div class="pro_price">
          <span class="n_price fc-fen">¥{{detail.mall_price}}</span>
          <del class="o_price fc-grey">¥{{detail.market_price}}</del>
        </div>
      </div>
      <div @click="share">
        <div>
          <img class="img_fen" src="../../assets/photo/fenxiang.png">
        </div>
        <div class="fc-grey fz-10">分享</div>
      </div>
    </div>
    <van-cell is-link @click="showinfo=true" v-show="detail.is_buy==1">
      <template slot="title">
        <div>
          <span class="c-text" v-if="guige==''">选择规格</span>
          <div v-else>
            <span style="padding-right:5px">已选择</span>
            <!-- {{speclist[0].spec_name}}:{{guige}};&nbsp{{count}}件 -->
            {{count}}件
          </div>
        </div>
      </template>
    </van-cell>
    <div class="bgc word_mouth_box pd-10">
      <div class="flex-jc-between" @click="toMouthw(detail.id)">
        <div>
          商品评价
          {{detail.comment_num}}
        </div>
        <div class="fc-grey flex-align-items">
          <span>好评度</span>
          <span>{{detail.grade}}%</span>
          <van-icon name="arrow"/>
        </div>
      </div>
    </div>
    <div class="bgc" style="margin-top:10px">
      <div class="product_det text-c flex-jc-center">
        <div class="dettail pd-lr-15">商品详情</div>
        <div class="line"></div>
      </div>
      <div class="pd-10">
        <div v-html="detail.description"></div>
      </div>
    </div>

    <div class="height"></div>
    <div class="bgc footer flex-align-items border-t flex-jc-between">
      <router-link to="/">
        <div class="text-c margin_l">
          <div>
            <img class="img_sy" src="../../assets/photo/index.png">
          </div>
          <div class="f10_col">首页</div>
        </div>
      </router-link>
      <div class="text-c">
        <div>
          <img class="img_kf" src="../../assets/photo/kefu.png">
        </div>
        <div class="f10_col">在线客服</div>
      </div>
      <div class="flexbox" v-show="detail.is_buy==1">
        <div class="btn bcolor fc-fen" @click="showinfocar=true">加入购物车</div>
        <div class="btn bcol" @click="goshop">立即购买</div>
      </div>
      <div class="btn_pj bcol" v-show="detail.is_buy==0" @click="toComment()">我要评价</div>
    </div>

    <!-- 选择规格 -->
    <div class="model full" v-show="showinfo||showinfocar">
      <div class="main bgc">
        <div class="goods1 flexbox pd-15">
          <div class="flex-1">
            <div class="mar-b-10 position">
              <div class="closeicon" @click="showinfo=false,showinfocar=false">
                <van-icon name="close"/>
              </div>
            </div>
            <div class="flexbox">
              <img class="img_slt" :src="detail.cover_url">
              <div class="pd-15">
                <div class="text-line pro_title1">{{detail.name}}</div>
                <div class="fc-fen" style="padding:10px 0">¥{{detail.mall_price}}</div>
                <div class="fsz12">请选择规格</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 多规格 -->
        <!-- <div class="pd-lr-15">
          <div v-for="(item,index) in speclist" :key="index">
            <div class="mar-b-10 fsz12">{{item.spec_name}}</div>
            <div class="items">
              <div
                :class="items.checked?'border-fen fc-fen':'border'"
                v-for="(items,indexs) in item.spec"
                :key="indexs"
                @click="onchooseguige(index,indexs)"
              >{{items.attr_name}}</div>
            </div>
          </div>
        </div>-->
        <div>
          <div class="mar-b-10 pd-lr-15">数量</div>
          <div class="pd-lr-15">
            <van-stepper :value="count" async-change @change="onChange"/>
          </div>
        </div>
        <div class="pd-15" v-show="showinfo">
          <div class="gbtn text-c" @click="purchase">确定</div>
        </div>
        <div class="pd-15" v-show="showinfocar">
          <div class="gbtn text-c" @click="addcart">加入购物车</div>
        </div>
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
import { Toast } from "vant";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      images: [
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201306/2013062320262198.jpg",
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201306/2013062320262198.jpg"
      ],
      discountlist: [],
      showmodel: false,
      discountmodel: false,
      numval: "",
      showinfo: false,
      showinfocar: false,
      iscollection: false,
      count: 1,
      guige: "",
      spec_name: "",
      detail: "",
      user_id: "",
      clickShare: false
      // speclist: [
      //   {
      //     spec_name: "尺寸",
      //     spec: [
      //       {
      //         attr_name: "A"
      //       },
      //       {
      //         attr_name: "B"
      //       }
      //     ]
      //   }
      // ]
    };
  },
  created() {
    // https://meizilai.zx-xcx.com/app/#/ProductDetail?id=15&store_id=4&first_user_id=122

    // let url = `${
    //   location.origin
    // }/ProductDetail?store_id=${store_id}&first_user_id=${first_user_id}`;

    this.goodsDetail();

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

    goodsDetail() {
      console.log(this.$route.query.id);
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/goods/detail", {
          params: {
            goods_id: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res.data, "goods/detail");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.detail = resdata.data;
            Toast.clear();
          } else if (resdata.code == 40005 || resdata.code == 20002) {
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
        });
    },

    //选择规格
    onchooseguige(index, indexs) {
      let speclist = this.speclist;
      let count = this.count;
      for (let [k, v] of speclist.entries()) {
        if (k == index) {
          for (let [k1, v1] of v.spec.entries()) {
            if (k1 == indexs) {
              v1.checked = true;
              console.log(v1);

              this.guige = v1.attr_name;
            } else {
              v1.checked = false;
            }
          }
        }
      }
      this.speclist = [...speclist];
      console.log(this.speclist);
    },
    onChange(count) {
      this.count = count;
      console.log(this.count);
    },
    //口碑
    toMouthw(id) {
      this.$router.push({
        path: "/WordMouth",
        query: {
          id: id
        }
      });
    },
    // 立即购买
    goshop() {
      this.showinfo = true;
    },
    purchase() {
      if (this.count) {
        let param = new URLSearchParams();
        param.append("goods_id", this.$route.query.id);
        param.append("num", this.count);

        console.log(this.count);
        Toast.loading({ mask: true, message: "加载中..." });

        this.axios.post(this.API + "/api/v1/goods/next", param).then(res => {
          console.log(res.data, "next");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.$router.push({
              path: "/ConfirmationOrder"
            });
            this.showinfo = false;
          } else if (resdata.code == 40005 || resdata.code == 20002) {
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
        });
      }

      // let arr = [];
      // for (let v of this.speclist) {
      //   for (let v1 of v.spec) {
      //     if (v1.checked) {
      //       arr.push(v1);
      //     }
      //   }
      // }
      // if (arr.length == this.speclist.length) {
      //   this.showinfo = false;
      //   传参
      //   this.$router.replace({
      //     path: "/ConfirmationOrder",
      //     query: {
      //       id: this.$route.params.id,
      //       guige: encodeURI(JSON.stringify(arr))
      //     }
      //   });
      // } else {
      //   Toast("请先选择规格");
      // }
    },
    addcart() {
      if (this.count) {
        let param = new URLSearchParams();
        param.append("goods_id", this.$route.query.id);
        param.append("num", this.count);

        console.log(this.count);
        Toast.loading({ mask: true, message: "加载中..." });
        // let postData = this.$qs.stringify({
        //   goods_id: this.$route.query.id,
        //   num: this.count
        // });
        this.axios.post(this.API + "/api/v1/cart/add", param).then(res => {
          console.log(res.data, "cart/add");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.showinfocar = false;
          } else if (resdata.code == 40005 || resdata.code == 20002) {
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
        });
      }
      // let arr = [];
      // let attr_ids = [];
      // let attr_names = [];
      // for (let v of this.speclist) {
      //   for (let v1 of v.spec) {
      //     console.log(v1);
      //     if (v1.checked) {
      //       arr.push(v1);
      //       attr_ids.push(v1.guigezhi_id);
      //       attr_names.push(v1.attr_name);
      //       console.log(attr_names);
      //     }
      //   }
      // }
      // if (arr.length == this.speclist.length) {
      // } else {
      //   Toast("请先选择规格");
      // }
    },
    toComment() {
      this.$router.push({
        path: "/comment/",
        query: {
          goods: this.detail
        }
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
            type: 1
          }
        })
        .then(res => {
          console.log(res.data, "goods/share");
          let resdata = res.data;
          if (resdata.code == 200) {
            let sharedata = resdata.data;

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
                  this.clickShare = true;
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
.fz-10 {
  font-size: 10px;
}
.fsz12 {
  font-size: 12px;
}
.pd-10 {
  padding: 10px;
}
.banner {
  width: 320px;
  height: 320px;
}
.img_box {
  width: 320px;
  height: 320px;
}
.img_box img {
  width: 100%;
  height: 100%;
}
.pro_title {
  width: 260px;
}
.pro_price {
  width: 122px;
  height: 20px;
  line-height: 20px;
  margin-top: 10px;
}

.n_price {
  font-size: 15px;
}
.o_price {
  font-size: 12px;
  margin-left: 10px;
}
.c-text {
  font-size: 13px;
}
.img_fen {
  width: 18px;
  height: 18px;
  margin-left: 2px;
}

.img_zq {
  width: 13px;
  height: 16px;
  margin-right: 10px;
}
.img_myj {
  width: 17px;
  height: 17px;
  margin-right: 10px;
}
.process {
  margin-top: 10px;
}
.process_det {
  padding-bottom: 15px;
}

.word_mouth_box {
  margin-top: 10px;
}

.wordlist_box {
  border-bottom: 1px solid #f0f0f0;
}

.itemimg {
  width: 88px;
  height: 89px;
  border-radius: 5px;
  margin-right: 10px;
}
.product_det {
  width: 100%;
  height: 40px;
  padding: 10px 0;
  position: relative;
}
.dettail {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  background: #fff;
  position: absolute;
  top: 20px;
  left: 118px;
}
.line {
  width: 180px;
  height: 1px;
  background: #fe4171;
  margin-top: 20px;
}
.height {
  width: 100%;
  height: 45px;
}
.footer {
  width: 100%;
  height: 40px;
  position: fixed;
  bottom: 0;
}
.btn {
  height: 40px;
  line-height: 40px;
  width: 108px;
  font-size: 14px;
  text-align: center;
}
.btn_pj {
  height: 40px;
  line-height: 40px;
  width: 228px;
  font-size: 14px;
  text-align: center;
}
.bcolor {
  background: linear-gradient(90deg, #fdebf1, #fdd3e1);
}
.bcol {
  background: linear-gradient(90deg, #ff5491, #fe4171);
  color: #fff;
}
.img_sy {
  width: 20px;
  height: 20px;
}
.img_kf {
  width: 18px;
  height: 18px;
}
.f10_col {
  font-size: 10px;
  color: #030303;
}
.margin_l {
  margin-left: 10px;
}

.model {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.model .main {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.s_title {
  width: 92%;
  height: 40px;
  line-height: 40px;
}
.img_fx {
  width: 50px;
  height: 50px;
}

.close,
.lineheight {
  height: 50px;
  line-height: 50px;
  width: 100%;
}

.dis_clasify {
  font-size: 12px;
  color: #fc3434;
}

.caricon {
  position: absolute;
  bottom: 10px;
  right: 20px;
  font-size: 24px;
  z-index: 100;
}
/* 选择规格 */

.img_slt {
  width: 80px;
  height: 80px;
}

.pro_title1 {
  width: 190px;
}
.model .items > div {
  padding: 2px 10px;
  display: inline-block;
  border-radius: 2px;
  margin-right: 10px;
}
.model .closeicon {
  position: absolute;
  right: 5px;
  top: -5px;
  font-size: 18px;
}

.gbtn {
  height: 35px;
  line-height: 35px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #ff5190 100%, #fe4171 100%);
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

