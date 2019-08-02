<template>
    <div>
        <div class="fixed" v-show="isshow">
            <div class="text-c">请通过扫码进入公众号</div>
        </div>
        <div class="flex-jc-center bgc">
            <div class="banner bgc">
                <van-swipe :autoplay="3000" indicator-color="#FC9745">
                    <van-swipe-item v-for="(item, index) in images" :key="index">
                        <div class="img_box flex-center">
                            <img :src="item.img_url">
                        </div>
                    </van-swipe-item>
                </van-swipe>
            </div>
        </div>

        <div class="flex-jc-around bgc">
            <div class="tg">
                <router-link to="/CompanyIntroduction">
          <span class="flex-jc-center">
            <img src="../assets/photo/gsjs.png">
          </span>
                    <span>公司介绍</span>
                </router-link>
            </div>
            <div class="tg">
                <router-link to="/shopstyle">
          <span class="flex-jc-center">
            <img src="../assets/photo/dpfc.png">
          </span>
                    <span>店铺风采</span>
                </router-link>
            </div>
            <div class="tg">
                <router-link to="/operationalGuide">
          <span class="flex-jc-center">
            <img src="../assets/photo/czzy.png">
          </span>
                    <span>操作指引</span>
                </router-link>
            </div>
            <div class="tg">
                <router-link to="/teamstyle">
          <span class="flex-jc-center">
            <img src="../assets/photo/tdfc.png">
          </span>
                    <span>团队风采</span>
                </router-link>
            </div>
        </div>

        <div class="flexbox bgc">
            <div class="tg" @click="getlocat">
                <!-- <router-link to="/navigation"> -->
                <span class="flex-jc-center">
          <img src="../assets/photo/yjdh.png">
        </span>
                <span>一键导航</span>
                <!-- </router-link> -->
            </div>
            <div class="tg">
                <router-link to="/newActivities">
          <span class="flex-jc-center">
            <img src="../assets/photo/zxhd.png">
          </span>
                    <span>最新活动</span>
                </router-link>
            </div>
            <div class="tg" @click="newGoods">
        <span class="flex-jc-center">
          <img src="../assets/photo/xptj.png">
        </span>
                <span>新品推荐</span>
            </div>
            <div class="tg">
                <router-link to="/merchantEntry">
          <span class="flex-jc-center">
            <img src="../assets/photo/sjrz.png">
          </span>
                    <span>商家入驻</span>
                </router-link>
            </div>
        </div>
        <!-- <div id="notice" class="pd-lr-15 bgc">
          <van-notice-bar left-icon="volume-o" :wrapable="true" :scrollable="false">{{content}}</van-notice-bar>
        </div>-->

        <!-- 公告 -->
        <div class="bgc pd-tb-15">
            <div class="notice2">
                <div class="notice-a2">
                    <img src="../assets/photo/icon-notice.png" class="icon-notice">
                </div>

                <div class="notice-box2">
                    <div class="notice-content2">
                        <div style="display: inline-block;">{{content}}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 公告end -->
        <div class="bgc">
            <div class="title flex-align-items">
                <img src="../assets/photo/re.png" class="img_rx"> 热销产品
            </div>

            <div class="product" v-for="(item,index) in goods" @click="toDetail(item.id)">
                <div class="img_pro">
                    <img :src="item.cover_url">
                </div>
                <div class="pro_title newline">{{item.name}}</div>

                <div class="pro_price flexbox">
                    <span class="n_price fc-fen">￥ {{item.mall_price}}</span>
                    <del class="o_price fc-grey">￥{{item.market_price}}</del>
                </div>
            </div>
        </div>
        <div class="height"></div>
    </div>
</template>

<script>
    import {Toast} from "vant";
    import wx from "weixin-js-sdk";

    export default {
        data() {
            let self = this;

            return {
                images: [],
                isshow: false,
                goods: [],
                first_user_id: "",
                content: ""
            };
        },

        mounted() {
            // if (JSON.parse(window.localStorage.getItem("access_token"))) {
            //     let old_store_id = window.localStorage.getItem("store_id");
            //     // 新的店铺id与旧的店铺id不同 则重新登录  否则不需要重新登录
            //     // alert(1);
            //
            //     if (old_store_id != JSON.stringify(this.$route.query.store_id)) {
            //         // alert(2);
            //         let code = window.location.search.split("&")[0].slice(6);
            //         console.log(code);
            //         if (code) {
            //             // alert(3);
            //             window.localStorage.setItem("code", JSON.stringify(code));
            //             this.getToken(code);
            //         }
            //         // 把新的store_id  店铺id缓存起来
            //         let store_id = this.$route.query.store_id;
            //         alert('yes_store_id' + store_id);
            //         window.localStorage.setItem("store_id", JSON.stringify(store_id));
            //         this.login(store_id);
            //
            //         let old_first_user_id = JSON.parse(window.localStorage.getItem("first_user_id"));
            //         // 存在新的first_user_id 上级id 并且不等于旧的first_user_id
            //         if (this.$route.query.first_user_id && old_first_user_id != this.$route.query.first_user_id) {
            //             // 把新的first_user_id  上级id缓存起来
            //             this.first_user_id = this.$route.query.first_user_id;
            //             window.localStorage.setItem("first_user_id", JSON.stringify(this.first_user_id));
            //         } else {
            //             this.first_user_id = 0;
            //             window.localStorage.setItem("first_user_id", JSON.stringify(this.first_user_id));
            //         }
            //     } else {
            //         this.getdata();
            //         this.getWxConfig();
            //         this.isshow = false;
            //     }
            // } else {
            let code = window.location.search.split("&")[0].slice(6);
            if (this.$route.query.store_id) {

                let store_id = this.$route.query.store_id;
                if (this.$route.query.first_user_id) {
                    this.first_user_id = this.$route.query.first_user_id;
                } else {
                    this.first_user_id = 0;
                }
                console.log("----------" + this.first_user_id);
                window.localStorage.removeItem('access_token');
                window.localStorage.setItem("first_user_id", JSON.stringify(this.first_user_id));
                // window.localStorage.setItem("store_id", JSON.stringify(store_id));
                this.login(store_id);
            } else if (window.localStorage.getItem("access_token")) {

                this.getdata();

                this.getWxConfig();

                this.isshow = false;

            } else if (code) {

                this.getToken(code);

            } else {
                window.localStorage.removeItem('access_token');
                this.isshow = true;
            }
        },

        methods: {
            login(store_id) {

                Toast.loading({mask: true, message: "加载中..."});
                if (store_id) {
                    this.axios
                        .get(this.API + "/api/v1/wechat/login", {
                            params: {
                                store_id: store_id
                            }
                        })
                        .then(res => {
                            console.log(res.data, "login");
                            // console.log(res)

                            let resdata = res.data;
                            if (resdata.code == 200) {
                                // 获取code

                                window.localStorage.setItem("store_id", JSON.stringify(store_id));
                                window.location.href = resdata.data;
                                Toast.clear();
                            } else {
                                Toast.clear();
                                Toast(resdata.msg);
                            }
                        }).catch(error => {
                        Toast.clear();
                        Toast("网络出错");
                    });
                }
            },
            getToken(code) {

                window.localStorage.setItem("code", JSON.stringify(code));
                Toast.loading({mask: true, message: "加载中..."});
                this.axios.get(this.API + "/api/v1/wechat/register", {
                    params: {
                        code: code,
                        store_id: JSON.parse(window.localStorage.getItem("store_id")),
                        first_user_id: JSON.parse(window.localStorage.getItem("first_user_id"))
                    }
                }).then(res => {
                    console.log(res.data, "register");
                    let resdata = res.data;
                    if (resdata.code == 200) {

                        window.localStorage.setItem("access_token", JSON.stringify(resdata.data.token));
                        if (resdata.data.is_mobile == 0) {
                            this.$router.push({path: "/register"});
                        }
                        this.getdata();
                        this.getWxConfig();
                        this.isshow = false;
                        Toast.clear();
                    } else {
                        this.isshow = true;
                        Toast.clear();
                        Toast(resdata.msg);
                    }
                }).catch(error => {
                    Toast.clear();
                    Toast("网络出错");
                });
            },
            getdata() {

                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/home")
                    .then(res => {
                        console.log(res.data, "home");

                        let resdata = res.data;

                        if (resdata.code == 200) {

                            let user = resdata.data.user;
                            // if (user.is_mobile == 0) {
                            //     alert('is.mobile'+0);
                            //     this.$router.push({path: "/register"});
                            // }

                            this.images = resdata.data.banner;

                            this.goods = resdata.data.goods;

                            let notice = resdata.data.notice;
                            let content = "";
                            for (let v of notice) {
                                console.log(v.content);

                                content = content + v.content + "；";
                            }

                            console.log(content);
                            this.content = content;

                            Toast.clear();
                        } else if (resdata.code == 40005) {
                            // window.localStorage.setItem("access_token", 0);
                            window.localStorage.removeItem("access_token");
                            let store_id = JSON.parse(window.localStorage.getItem('store_id'));
                            this.login(store_id);
                            this.isshow = false;
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

            // 获取地理位置  获取微信配置

            getWxConfig() {
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
                                jsApiList: ["checkJsApi", "getLocation", "translateVoice"]
                            });
                            wx.checkJsApi({
                                jsApiList: ["getLocation"],
                                success: function (res) {
                                    if (res.checkResult.getLocation == false) {
                                        alert(
                                            "你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！"
                                        );
                                        return;
                                    }
                                }
                            });
                            wx.ready(function () {
                                wx.getLocation({
                                    success: function (res) {
                                        console.log(res, "wx.getLocation");

                                        let pointSession = {
                                            pointY: res.latitude,
                                            pointX: res.longitude
                                        };
                                        window.localStorage.setItem(
                                            "pointSession",
                                            JSON.stringify(pointSession)
                                        );
                                    },
                                    cancel: function (res) {
                                        alert("用户拒绝授权获取地理位置");
                                    }
                                });
                            });
                            wx.error(function (res) {
                                console.log(res);
                            });
                        } else if (resdata.code == 40005) {
                            let store_id = JSON.parse(window.localStorage.getItem("store_id"));

                            this.login(store_id);
                            this.isshow = false;
                            window.localStorage.removeItem("access_token");
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
                                    success: function (res) {
                                        if (res.checkResult.openLocation == false) {
                                            alert(
                                                "你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！"
                                            );
                                            return;
                                        }
                                    }
                                });
                                Toast.loading({mask: true, message: "加载中..."});
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
                                            window.localStorage.removeItem("access_token");
                                            let store_id = JSON.parse(
                                                window.localStorage.getItem("store_id")
                                            );
                                            this.login(store_id);
                                            this.isshow = true;
                                        } else {
                                            Toast(resdata.msg);
                                        }
                                    })
                                    .catch(error => {
                                        Toast.clear();
                                        Toast("网络出错");
                                    });
                            }
                        })
                        .catch(error => {
                            Toast.clear();
                            Toast("网络出错");
                        });
                }
            },
            //产品详情
            toDetail(id) {
                this.$router.push({
                    path: "/ProductDetail",
                    query: {
                        id: id,
                        store_id: JSON.parse(window.localStorage.getItem("store_id")),
                        first_user_id: JSON.parse(
                            window.localStorage.getItem("first_user_id")
                        )
                    }
                });
            },
            // 新品推荐
            newGoods() {
                this.$router.push({
                    path: "/newArrivals",
                    query: {
                        id: this.$route.query.store_id
                    }
                });
            }
        }
    };
</script>

<style>
    #notice {
        padding-top: 10px;
    }

    #notice .van-notice-bar {
        background-color: #faf2f2;
        border-radius: 20px;
        height: 30px;
    }
</style>

<style scoped>
    .fixed {
        overflow: hidden;
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 100%;
        background: #fff;
        z-index: 90;
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .f12 {
        font-size: 12px;
    }

    .top_sear {
        width: 100%;
        height: 44px;
    }

    .sear {
        height: 32px;
        border-radius: 5px;
        background: #f6f5f5;
    }

    .sear .van-icon {
        padding-left: 10px;
    }

    .dw {
        width: 50%;
        height: 44px;
        line-height: 44px;
        margin-left: 13px;
        font-size: 13px;
    }

    .dw span {
        display: inline-block;
        width: 50px;
        height: 100%;
    }

    .banner {
        width: 320px;
        height: 184px;
    }

    .img_box {
        width: 320px;
        height: 184px;
    }

    .img_box img {
        width: 100%;
        height: 100%;
    }

    .tg {
        width: 80px;
        text-align: center;
        line-height: 30px;
        padding-top: 10px;
    }

    .tg img {
        display: block;
        width: 48px;
        height: 48px;
    }

    .title {
        font-size: 17px;
        font-weight: 600;
        padding: 10px;
        height: 30px;
        line-height: 30px;
    }

    .img_rx {
        width: 14px;
        height: 20px;
        margin-right: 10px;
    }

    .product {
        display: inline-block;
        width: 142px;
        height: 249px;
        border-radius: 10px;
        box-shadow: 0px 3px 7px 0px rgba(238, 238, 238, 1);
        margin: 0 0 15px 10px;
    }

    .img_pro {
        width: 142px;
        height: 160px;
    }

    .img_pro img {
        width: 100%;
        height: 100%;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .pro_title {
        width: 122px;
        height: 35px;
        margin: 10px 0 10px 10px;
    }

    .pro_price {
        width: 122px;
        height: 20px;
        line-height: 20px;
        margin-left: 10px;
    }

    .n_price {
        font-size: 15px;
    }

    .o_price {
        font-size: 12px;
        margin-left: 3px;
    }

    .height {
        width: 100%;
        height: 60px;
        background: #fff;
    }

    /* 公告 */

    .notice2 {
        width: 90%;
        height: 30px;
        background: #faf2f2;
        color: #030303;
        font-size: 12px;
        margin: 0 auto;
        border-radius: 20px;
        display: -webkit-box;
        display: flex;
        -webkit-box-orient: horizontal;
        -ms-flex-direction: row;
        flex-direction: row;
        padding-right: 10px;
    }

    .notice-a2 {
        position: relative;
        background-color: #faf2f2 100%;
        z-index: 10;
        padding-left: 10px;
        min-width: 0;
        -webkit-box-flex: 0;
        -ms-flex-positive: 0;
        flex-grow: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        -ms-grid-row-align: center;
        align-items: center;
    }

    .icon-notice {
        width: 15px;
        height: 14px;
        margin-right: 5px;
    }

    .notice-box2 {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
        word-break: break-all;
        line-height: 30px;
        min-width: 0;
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
    }

    .notice-content2 {
        z-index: 5;
        animation: 25s 0s run2 infinite linear;
        transform: translateX(0%);
        display: inline-block;
    }

    @keyframes run2 {
        0% {
            transform: translateX(0);
        }

        100% {
            transform: translateX(-100%);
            /* transform: translateX(calc(-50% - 70rpx));
                transform: translateX(-moz-calc(-50% - 70rpx));
                transform: translateX(-webkit-calc(-50% - 70rpx));  */
        }
    }

    .notice-b2 {
        position: relative;
        background-color: #fdf7f7;
        z-index: 10;
        padding-right: 20 rpx;
    }
</style>