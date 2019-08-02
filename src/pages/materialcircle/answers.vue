<template>
    <div>
        <div class="pd-15 border-b bgc">
            <div class="title">{{data.title}}</div>

            <div class="flex-align-items" style="padding-top:10px">
                <img class="img_logo border" src="../../assets/photo/yanzhengma.png">
                <span class="fz12" style="padding:10px">魅资莱</span>
                <span class="fc-grey fz12">{{data.created_at}}</span>
            </div>
            <div class="pd-tb-15" v-html="data.description"></div>
            <div class="title">问答</div>
            <div class="flex-align-items pd-tb-15">
                <img class="img_header border" src="../../assets/photo/banner.png">
                <span class="fz12 welcome">欢迎提问~</span>
            </div>
            <div v-for="(item,index) in data.comments">
                <div class="flexbox mar-b-10">
                    <img class="img_header border" :src="item.user.avatar">
                    <div class="right">
                        <div class="fz12">{{item.user.nickname}}</div>
                        <div class="fc-grey fz12 right-time">{{item.updated_at}}</div>
                        <div class="right-con mar-b-10" @click="huifu(item)">{{item.content}}</div>
                        <div class="answer" v-for="(items,ind) in item.children">
                            {{items.user.nickname}}:
                            {{items.content}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="height:40px"></div>
        <div class="img_box flex-jc-around flex-align-items bgc">
            <div class="text-c border-l">
                <div @click="editAnswer()">
                    <img class="img_commit" src="../../assets/photo/commit.png">
                </div>
            </div>
            <div @click="ondianzan" class="text-c border-l">
                <img v-if="data.is_like==1" class="img_commit" src="../../assets/photo/dianzans.png">
                <img v-else class="img_commit" src="../../assets/photo/dianzan.png">
            </div>
            <div class="text-c border-l" @click="share">
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
    import {Toast} from "vant";

    export default {
        data() {
            return {
                isdianzan: false,
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
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/question/detail", {
                        params: {
                            question_id: this.$route.query.id
                        }
                    })
                    .then(res => {
                        console.log(res.data, "report/detail");
                        let resdata = res.data;
                        if (resdata.code == 200) {
                            this.data = resdata.data;
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
                    })
                    .catch(error => {
                        Toast.clear();
                        Toast("网络出错");
                    });
            },
            //点赞
            ondianzan() {
                // this.isdianzan = !this.isdianzan;
                Toast.loading({mask: true, message: "加载中..."});

                let param = new URLSearchParams();
                param.append("question_id", this.$route.query.id);
                this.axios
                    .post(this.API + "/api/v1/question/like", param)
                    .then(res => {
                        console.log(res.data, "question/like");
                        let resdata = res.data;
                        if (resdata.code == 200) {
                            console.log(resdata.msg);

                            this.getData();
                            Toast.success(resdata.msg);

                            Toast.clear();
                        } else {
                        }

                        Toast.clear();
                    })
                    .catch(error => {
                        Toast.clear();
                        Toast("网络出错");
                    });
            },

            // 分享
            share() {
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/share", {
                        params: {
                            url: location.href.replace("#", ""),
                            id: this.$route.query.id,
                            type: 2
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

                                        WeixinJSBridge.on("menu:share:appmessage", function (argv) {
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
                                                function (res) {
                                                    this.clickShare = false;
                                                }
                                            );
                                        });

                                        WeixinJSBridge.on("menu:share:timeline", function (argv) {
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
                                                function (res) {
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
            },
            editAnswer() {
                this.$router.push({
                    path: "/editAnswer",
                    query: {
                        id: this.$route.query.id
                    }
                });
            },
            huifu(item) {
                console.log(item);
                this.$router.push({
                    path: "/editAnswer",
                    query: {
                        item: item
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

    .title {
        font-size: 17px;
        font-weight: 600;
    }

    .img_logo {
        width: 25px;
        height: 25px;
        border-radius: 50%;
    }

    .right {
        padding-top: 5px;
    }

    .right-time {
        line-height: 20px;
    }

    .right-con {
        word-wrap: break-word;
        word-break: break-all;
    }

    .img_header {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .welcome {
        width: 220px;
        background: #f0f0f0;
        border-radius: 20px;
        padding: 5px 10px;
    }

    .answer {
        width: 220px;
        background: #f0f0f0;
        padding: 5px 10px;
    }

    .img_box {
        height: 40px;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff;
    }

    .img_box > div {
        width: 110px;
    }

    .border-l {
        border-right: #f0f0f0 1px solid;
    }

    .img_location {
        width: 11px;
        height: 14px;
    }

    .img_commit {
        width: 16px;
        height: 16px;
    }

    .img_fenxiang {
        width: 15px;
        height: 16px;
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
