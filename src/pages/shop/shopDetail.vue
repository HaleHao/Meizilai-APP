<template>
    <div>
        <!-- <div class="flex-jc-between shop"  :style="bgimg"> -->
        <div class="position">
            <img class="img_shop" :src="data.cover_url">
            <div class="shop_mess pd-15">
                <div class="shop_name">{{data.name}}</div>
                <div class="fz12 pd-tb-15">营业时间: 10:30~23:00</div>
                <div class="flex-jc-between" @click="getlocat">
                    <div class="fz12 address">{{data.address}}</div>
                    <img class="img_location" src="../../assets/photo/locations.png">
                </div>
            </div>
        </div>

        <div class="shopnav position" id="shopnav">
            <van-tabs @click="ontab" v-model="ind">
                <van-tab :title="item" v-for="(item,index) in navtitle" :key="index">
                    <div v-show="ind==0">
                        <ul>
                            <li v-for="(item,index) in servelist" @click="selectIndex(index)">
                                <input
                                        :type="serve_check"
                                        :value="item.id"
                                        :id="'choice'+index"
                                        v-model="checkedNum"
                                        style="display:none"
                                >
                                <label :for="'choice'+index" class="choice-item flex-jc-between pd-15">
                                    <span>{{item.name}}</span>
                                    <span>{{item.price}}</span>
                                </label>
                            </li>
                        </ul>
                        <!-- <div>{{checkedNum}}</div> -->
                        <div class="btn_next text-c" @click="toconfirOrder">下一步</div>
                    </div>

                    <div v-show="ind ==1">
                        <div v-show="beautician.iength==0" class="text-c pd-15">暂无美容师</div>
                        <div v-for="(item,index) in beautician" :key="index" @click="gobeautyDetail(item.id)">
                            <div class="flexbox flex-align-items">
                                <div class="pd-lr-15">
                                    <img class="img_header" :src="item.avatar">
                                </div>

                                <div class="flex-jc-between border-b right pd-tb-15 flex-align-items">
                                    <div>
                                        <div class="name">{{item.username}}</div>
                                        <div class="ser_number">服务{{item.serve_num}}次</div>
                                        <div class="fz12 fc-fen">好评 {{item.grade}}%</div>
                                    </div>
                                    <div>
                                        <div class="ser_btn" v-if="item.serve_status==1">可服务</div>
                                        <div class="xiuxi_btn" v-else>休息中</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-show="ind ==2">
                        <div class="bgc">
                            <div class="border-b">
                                <div class="bgc pd-tb-15">
                                    <div class="nav bgc">
                                        <div
                                                :class="{ 'selected': typenum==0 }"
                                                @click="checkedGrade"
                                        >全部({{datanum.total_num}})
                                        </div>
                                        <div
                                                :class="{ 'selected': typenum==1 }"
                                                @click="checkedGrade1"
                                        >满意({{datanum.good_num}})
                                        </div>
                                        <div
                                                :class="{ 'selected': typenum==2 }"
                                                @click="checkedGrade2"
                                        >一般({{datanum.com_num}})
                                        </div>
                                        <div
                                                :class="{ 'selected': typenum==3 }"
                                                @click="checkedGrade3"
                                        >不满意({{datanum.bad_num}})
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="word_mouth pd-lr-15">
                                <div v-show="comment.iength==0" class="text-c pd-15">无评论数据</div>
                                <div v-for="(item,index ) in comment" :key="index">
                                    <div class="flexbox pd-tb-15">
                                        <div class="head_img">
                                            <img :src="item.user.avatar">
                                        </div>
                                        <div class="pg-right">
                                            <div class="flex-jc-between">
                                                <div class="head_name">{{item.user.nickname}}</div>
                                                <div>
                                                    <div class="flex-align-items" v-if="item.grade==1">
                                                        <img class="pingjia_img" src="../../assets/photo/haoping.png">
                                                        <span class="grey_12">满意</span>
                                                    </div>
                                                    <div class="flex-align-items" v-else-if="item.grade==2">
                                                        <img class="pingjia_img" src="../../assets/photo/yiban.png">
                                                        <span class="grey_12">一般</span>
                                                    </div>
                                                    <div class="flex-align-items" v-else>
                                                        <img class="pingjia_img" src="../../assets/photo/chaping.png">
                                                        <span class="grey_12">不满意</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="com_det">{{item.content}}</div>
                                            <div class="imglist_b">
                                                <div class="imglist" v-for="(items,indexs) in item.images"
                                                     :key="indexs">
                                                    <img class="itemimg" :src="items">
                                                </div>
                                            </div>
                                            <div class="flex-jc-between">
                                                <div class="grey_12">美容师:{{item.beautician.username}}</div>
                                                <div class="grey_12">{{item.comment_time}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>

        <!-- </div> -->
    </div>
</template>

<script>
    import wx from "weixin-js-sdk";
    import {Toast} from "vant";

    export default {
        data() {
            return {
                data: "",
                datanum: "",
                navtitle: ["服务项目", "美容师", "服务评价"],
                beautician: [],
                ind: 0,
                lat: "",
                lng: "",
                serve_check: "radio",
                servelist: [],
                checkedNum: [],
                selectList: [],
                isborder: false,
                comment: [],

                typenum: 0,
                first_user_id: ""
                // bgimg: {
                //   background:
                //     "url(" +
                //     require("../../assets/photo/shopimg1.png") +
                //     ") no-repeat top",
                //   backgroundSize: "100% 100%"
                // }
            };
        },
        created() {
            // 非首次登录
            // if (JSON.parse(window.localStorage.getItem("access_token"))) {
            //
            //     let old_store_id = window.localStorage.getItem("store_id");
            //     // 新的店铺id与旧的店铺id不同 则重新登录  否则不需要重新登录
            //     if (old_store_id != JSON.stringify(this.$route.query.id)) {
            //
            //         let code = window.location.search.split("&")[0].slice(6);
            //         console.log(code);
            //         if (code) {
            //
            //             window.localStorage.setItem("code", JSON.stringify(code));
            //             this.getToken(code);
            //         }
            //
            //         // 把新的store_id  店铺id缓存起来
            //         let store_id = this.$route.query.id;
            //         window.localStorage.setItem("store_id", JSON.stringify(store_id));
            //         this.login(store_id);
            //
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
            //
            //     } else {
            //
            //         this.getDetail();
            //         this.serveList();
            //
            //     }
            //
            // } else {
            //
            //     // 首次登录
            //     if (this.$route.query.id) {
            //         let code = window.location.search.split("&")[0].slice(6);
            //         console.log(code);
            //         if (code) {
            //             window.localStorage.setItem("code", JSON.stringify(code));
            //             this.getToken(code);
            //         } else {
            //             let store_id = this.$route.query.id;
            //             window.localStorage.setItem("store_id", JSON.stringify(store_id));
            //             if (this.$route.query.first_user_id) {
            //                 this.first_user_id = this.$route.query.first_user_id;
            //                 window.localStorage.setItem("first_user_id", JSON.stringify(this.first_user_id));
            //             } else {
            //                 this.first_user_id = 0;
            //                 window.localStorage.setItem("first_user_id", JSON.stringify(this.first_user_id));
            //             }
            //             console.log("----------" + this.first_user_id);
            //
            //             this.login(store_id);
            //         }
            //     }
            //
            // }
            // let code = window.location.search.split("&")[0].slice(6);
            // if (window.localStorage.getItem("access_token")) {
            //     this.getDetail();
            //     this.serveList();
            // } else if (code) {
            //     this.getToken(code);
            //
            // } else if (this.$route.query.id) {
            //     let store_id = this.$route.query.id;
            //     if (this.$route.query.first_user_id) {
            //         this.first_user_id = this.$route.query.first_user_id;
            //     } else {
            //         this.first_user_id = 0;
            //     }
            //     console.log("----------" + this.first_user_id);
            //     window.localStorage.removeItem("access_token");
            //     window.localStorage.setItem("first_user_id", JSON.stringify(this.first_user_id));
            //     this.login(store_id);
            // } else {
            //     window.localStorage.removeItem("access_token");
            //     Toast('请扫码进入公众号');
            // }
            // let code = window.location.search.split("&")[0].slice(6);
            // if (window.localStorage.getItem('access_token')) {
            //     alert(1);
            //     this.getDetail();
            //     this.serveList();
            // } else if (code) {
            //     alert(5);
            //     alert('code:' + code);
            //     this.getToken(code);
            // } else if (this.$route.query.id) {
            //     alert(7);
            //     let store_id = this.$route.query.id;
            //
            //     if (this.$route.query.first_user_id) {
            //         this.first_user_id = this.$route.query.first_user_id;
            //     } else {
            //         this.first_user_id = 0;
            //     }
            //     window.localStorage.setItem("first_user_id", JSON.stringify(this.first_user_id));
            //     this.login(store_id);
            // } else {
            //     window.localStorage.removeItem("access_token");
            //     Toast('请扫码进入店铺');
            // }

            let code = window.location.search.split("&")[0].slice(6);
            if (this.$route.query.id) {

                let store_id = this.$route.query.id;
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
                this.getDetail();
                this.serveList();
                // this.isshow = false;
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
                    this.axios.get(this.API + "/api/v1/wechat/login", {
                        params: {
                            store_id: JSON.parse(store_id),
                            url: location.origin + "/shopDetail"
                        }
                    }).then(res => {
                        console.log(res.data, "login");
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
                        // if (resdata.data.is_mobile == 0) {
                        //     this.$router.push({path: "/register/"});
                        // }
                        this.serveList();
                        this.getDetail();
                        Toast.clear();
                    } else {
                        Toast.clear();
                        Toast(resdata.msg);
                    }
                }).catch(error => {
                    Toast.clear();
                    Toast("网络出错");
                });
            },
            selectIndex(index) {
            },

            getDetail() {
                Toast.loading({mask: true, message: "加载中..."});
                this.axios.get(this.API + "/api/v1/store/detail", {
                        params: {
                            store_id: JSON.parse(window.localStorage.getItem('store_id'))
                        }
                    }).then(res => {
                    console.log(res.data, "store/detail");
                    let resdata = res.data;
                    if (resdata.code == 200) {
                        this.data = resdata.data;
                        this.lat = resdata.data.lat;
                        this.lng = resdata.data.lng;
                        if (resdata.data.serve_check) {
                            this.serve_check = resdata.data.serve_check;
                        }
                        Toast.clear();
                    } else if (resdata.code == 40005) {
                        window.localStorage.removeItem("access_token");
                        let store_id = JSON.parse(window.localStorage.getItem('store_id'));
                        this.login(store_id);
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
                                            let store_id = JSON.parse(
                                                window.localStorage.getItem("store_id")
                                            );
                                            this.login(store_id);
                                        } else {
                                            Toast(resdata.msg);
                                        }
                                    });
                            }
                        })
                        .catch(error => {
                            Toast.clear();
                            Toast("网络出错");
                        });
                }
            },
            serveList() {
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/store/serve/list", {
                        params: {
                            store_id: JSON.parse(window.localStorage.getItem('store_id'))
                        }
                    })
                    .then(res => {
                        console.log(res.data, "serve/list");
                        let resdata = res.data;
                        if (resdata.code == 200) {
                            this.servelist = resdata.data;
                            Toast.clear();
                        } else if (resdata.code == 40005) {
                            window.localStorage.removeItem("access_token");
                            let store_id = JSON.parse(window.localStorage.getItem('store_id'));
                            this.login(store_id);
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
            ontab(index, title) {
                console.log(index, title);
                if (this.ind == 0) {
                    this.serveList();
                    return;
                }
                // 美容师
                if (this.ind == 1) {
                    Toast.loading({mask: true, message: "加载中..."});
                    this.axios
                        .get(this.API + "/api/v1/store/beautician/list", {
                            params: {
                                store_id: JSON.parse(window.localStorage.getItem('store_id'))
                            }
                        })
                        .then(res => {
                            console.log(res.data, "beautician/list");
                            let resdata = res.data;
                            if (resdata.code == 200) {
                                this.beautician = resdata.data;
                                Toast.clear();
                            } else if (resdata.code == 40005) {
                                let store_id = JSON.parse(
                                    window.localStorage.getItem("store_id")
                                );
                                this.login(store_id);
                            } else {
                                Toast.clear();
                                Toast(resdata.msg);
                            }
                        })
                        .catch(error => {
                            Toast.clear();
                            Toast("网络出错");
                        });
                    return;
                }
                // 服务评价
                if (this.ind == 2) {
                    Toast.loading({mask: true, message: "加载中..."});
                    this.axios
                        .get(this.API + "/api/v1/store/comment/list", {
                            params: {
                                store_id: JSON.parse(window.localStorage.getItem('store_id')),
                                grade: 0
                            }
                        })
                        .then(res => {
                            console.log(res.data, "comment/list");
                            let resdata = res.data;
                            if (resdata.code == 200) {
                                this.datanum = resdata.data;
                                this.comment = resdata.data.comment;

                                Toast.clear();
                            } else if (resdata.code == 40005) {
                                let store_id = JSON.parse(
                                    window.localStorage.getItem("store_id")
                                );
                                this.login(store_id);
                            } else {
                                Toast.clear();
                                Toast(resdata.msg);
                            }
                        })
                        .catch(error => {
                            Toast.clear();
                            Toast("网络出错");
                        });
                    return;
                }
            },

            checkedGrade() {
                this.typenum = 0;
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/store/comment/list", {
                        params: {
                            store_id: JSON.parse(window.localStorage.getItem('store_id')),
                            grade: 0
                        }
                    })
                    .then(res => {
                        console.log(res.data, "comment/list");
                        let resdata = res.data;
                        if (resdata.code == 200) {
                            this.comment = resdata.data.comment;
                            Toast.clear();
                        } else if (resdata.code == 40005) {
                            let store_id = JSON.parse(window.localStorage.getItem("store_id"));
                            this.login(store_id);
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
            checkedGrade1() {
                this.typenum = 1;
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/store/comment/list", {
                        params: {
                            store_id: JSON.parse(window.localStorage.getItem('store_id')),
                            grade: 1
                        }
                    })
                    .then(res => {
                        console.log(res.data, "comment/list");
                        let resdata = res.data;
                        if (resdata.code == 200) {
                            this.comment = resdata.data.comment;
                            Toast.clear();
                        } else if (resdata.code == 40005) {
                            let store_id = JSON.parse(window.localStorage.getItem("store_id"));
                            this.login(store_id);
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
            checkedGrade2() {
                this.typenum = 2;
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/store/comment/list", {
                        params: {
                            store_id: JSON.parse(window.localStorage.getItem('store_id')),
                            grade: 2
                        }
                    })
                    .then(res => {
                        console.log(res.data, "comment/list");
                        let resdata = res.data;
                        if (resdata.code == 200) {
                            this.comment = resdata.data.comment;
                            Toast.clear();
                        } else if (resdata.code == 40005) {
                            let store_id = JSON.parse(window.localStorage.getItem("store_id"));
                            this.login(store_id);
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
            checkedGrade3() {
                this.typenum = 3;
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/store/comment/list", {
                        params: {
                            store_id: JSON.parse(window.localStorage.getItem('store_id')),
                            grade: 3
                        }
                    })
                    .then(res => {
                        console.log(res.data, "comment/list");
                        let resdata = res.data;
                        if (resdata.code == 200) {
                            this.comment = resdata.data.comment;
                            Toast.clear();
                        } else if (resdata.code == 40005) {
                            let store_id = JSON.parse(window.localStorage.getItem("store_id"));
                            this.login(store_id);
                        } else {
                            Toast.clear();
                            Toast(resdata.msg);
                        }
                    });
            },
            // 美容师详情
            gobeautyDetail(id) {
                this.$router.push({
                    path: "/beautyDetail",
                    query: {
                        id: id
                    }
                });
            },
            // 下一步
            toconfirOrder() {
                // console.log(JSON.stringify(this.checkedNum));
                console.log(this.checkedNum);
                // this.$router.push({
                //   path: "/confirOrder/",
                //   query: {
                //     checkedNum: this.checkedNum
                //   }
                // });
                if (this.checkedNum == "") {
                    Toast("请选择服务项目");
                    return;
                }
                let serve_ids = JSON.stringify(this.checkedNum);
                this.$router.push({
                    path: "/confirOrder/",
                    query: {
                        serve_ids: serve_ids
                    }
                });
                if (this.checkedNum.length != 0) {
                    Toast.loading({mask: true, message: "加载中..."});
                    let param = new URLSearchParams();
                    param.append("serve_ids", serve_ids);
                    this.axios.post(this.API + "/api/v1/serve/confirm", param).then(res => {
                        console.log(res.data, "confirm");
                        let resdata = res.data;
                        if (resdata.code == 200) {
                            Toast.clear();
                            this.$router.push({
                                path: "/confirOrder/",
                                query: {
                                    serve_ids: serve_ids
                                }
                            });
                        } else if (resdata.code == 40005) {
                            let store_id = JSON.parse(window.localStorage.getItem("store_id"));
                            this.login(store_id);
                        } else {
                            Toast.clear();
                            Toast(resdata.msg);
                        }
                    });
                } else {
                    Toast("请选择服务项目");
                }
            }
        }
    };
</script>
<style>
    #shopnav .van-tabs__line {
        background-color: #fff;
        background-image: linear-gradient(90deg, #fe4171 100%, #ff5491 100%);
    }

    #shopnav .van-tab {
        color: black;
        font-size: 14px;
    }

    #shopnav .van-tab--active {
        color: #fe4171;
    }
</style>
<style scoped>
    .fz12 {
        font-size: 12px;
    }

    .img_shop {
        width: 100%;
        height: 160px;
    }

    .shopnav {
        background: #fff;
        margin: 0px 15px 0 15px;
        border-radius: 10px;
        box-shadow: 1px 2px 8px 0 rgba(207, 206, 206, 0.5);
        top: -30px;
        overflow: hidden;
    }

    .img_gouxuan {
        position: absolute;
        left: 269px;
        margin-top: 31px;
        width: 28px;
        height: 27px;
    }

    .btn_next {
        height: 35px;
        line-height: 35px;
        margin: 10px 0;
        background: linear-gradient(90deg, #ff5491, #fe4171);
        color: #fff;
        border-radius: 20px;
    }

    .shop {
        align-items: center;
        width: 100%;
        height: 180px;
    }

    .shop_mess {
        width: 290px;
        position: absolute;
        top: 0;
        color: #fff;
    }

    .shop_name {
        font-size: 16px;
    }

    .address {
        width: 200px;
    }

    .img_location {
        width: 12px;
        height: 15px;
    }

    .img_header {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }

    .right {
        width: 200px;
        padding-right: 15px;
        padding-left: 5px;
    }

    .name {
        font-size: 14px;
        font-weight: 600;
    }

    .ser_number {
        padding: 5px 0;
        font-size: 12px;
        color: #979797;
    }

    .right :last-child {
        border-bottom: 1px solid #fff;
    }

    .ser_btn {
        height: 25px;
        line-height: 25px;
        background: linear-gradient(90deg, #ff5491, #fe4171);
        border-radius: 20px;
        color: #fff;
        padding: 0 15px;
    }

    .xiuxi_btn {
        height: 25px;
        line-height: 25px;
        background: #a7a6a5;
        border-radius: 20px;
        padding: 0 15px;
    }

    .grey_12 {
        font-size: 12px;
        color: #979797;
    }

    .nav {
        margin: 0 11px;
    }

    .nav > div {
        height: 25px;
        line-height: 25px;
        padding: 0 5px;
        display: inline-block;
        border-radius: 20px;
        text-align: center;
        border: 1px solid #8c8c8c;
        box-sizing: border-box;
        font-size: 10px;
        margin-right: 3px;
    }

    .nav .selected {
        color: #fff;
        background: linear-gradient(90deg, #fe4171, #ff5491);
        border: none;
    }

    .word_mouth {
        /* padding: 0 10px; */
        height: 100%;
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
        margin-right: 10px;
    }

    .pg-right {
        width: 210px;
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

    .dettail {
        font-size: 15px;
        font-weight: 600;
        padding: 13px 0;
    }

    .weight {
        padding: 10px 0;
    }

    .pro_img {
        width: 100%;
        height: 450px;
        border-radius: 5px;
        padding: 10px 0;
    }

    .footer {
        width: 100%;
        height: 50px;
        position: fixed;
        bottom: 0;
    }

    /*普通样式*/
    .choice-item {
        color: #000;
    }

    /*input被选中时，label的样式*/
    input:checked + .choice-item {
        background: url(../../assets/photo/gouxuan.png) no-repeat;
        background-size: 30px auto;
        background-position: 268px 31px;
        border: 1px solid #ff508b;
        color: #ff508b;
    }
</style>