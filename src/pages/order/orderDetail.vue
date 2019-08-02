<template>
    <div>
        <div class="pd-15 flexbox" v-show="order_status==0">
            <img class="img_daifu" src="../../assets/photo/daifukuan.png">
            <div>
                <div>待付款</div>
                <div class="fz13 pd-t">剩余{{hour}}小时{{minute}}分订单自动关闭</div>
            </div>
        </div>

        <div class="pd-15 flexbox" v-show="order_status==1">
            <img class="img_daifa" src="../../assets/photo/daifahuo.png">
            <div>
                <div>待发货</div>
                <div class="fz13 pd-t">商家已打包，等待快递揽收</div>
            </div>
        </div>
        <!-- 点击跳转物流详情 -->
        <!-- <div class="pd-15 flexbox" v-show="order_status==2" @click="postm"> -->
        <div class="pd-15 flexbox" v-show="order_status==2">
            <img class="img_daishou" src="../../assets/photo/daishouhuo.png">
            <div>
                <div>待收货</div>

                <div class="flex-jc-between flex-align-items pd-10 wuliu">
                    <span class="fz12">物流信息：
                        <div>
                            <span>{{express.express_time}}</span>
                            <span>{{express.express_info}}</span>
                        </div>
                    </span>
                    <!-- <van-icon name="arrow"/> -->
                </div>
                <!-- <div class="fz13">2019–01-30 11:33:34</div> -->
            </div>
        </div>

        <div class="pd-15 flex-align-items" v-show="order_status==3">
            <img class="img_daishou" src="../../assets/photo/daishouhuo.png">
            <div>待取货</div>
        </div>

        <div class="pd-15 flexbox" v-show="order_status==4">
            <img class="img_daipinglun" src="../../assets/photo/daipinglun.png">
            <div>
                <div>待评论</div>
                <div class="flex-jc-between flex-align-items pd-10 wuliu">
                    <span class="fz12">物流信息：<div>
                            <span>{{express.express_time}}</span>
                            <span>{{express.express_info}}</span>
                        </div>
                    </span>
                    <!-- <van-icon name="arrow"/> -->
                </div>
                <!-- <div class="fz13">2019–01-30 11:33:34</div> -->
            </div>
        </div>
        <div v-show="data.delivery_method==1">
            <div class="pd-15 flexbox bgc mar-b-10">
                <img class="img_location" src="../../assets/photo/location.png">
                <div>
                    <div>{{data.username}} {{data.mobile}}</div>
                    <div class="fz12 pd-t">{{data.address}}</div>
                </div>
            </div>
        </div>

        <div v-show="data.delivery_method==2">
            <div class="pd-15 flexbox bgc mar-b-10">
                <img class="img_location" src="../../assets/photo/location.png">
                <div>
                    <div>自提门店 ：</div>
                    <div class="fz12 pd-t">{{store.name}}</div>
                    <div class="fz12 pd-t">{{store.province+store.city+store.district+store.address}}</div>
                </div>
            </div>
        </div>

        <div class="pd-15 bgc mar-b-10">
            <div class="flexbox product" v-for="(item,index) in data.order_goods">
                <img class="img_pro" :src="item.goods_img">
                <div>
                    <div class="mar-b-10">{{item.goods_name}}</div>
                    <div class="fz12 fc-grey">数量：{{item.goods_num}}件</div>
                </div>
            </div>
        </div>
        <div class="pd-15 bgc mar-b-10">
            <div class="flex-jc-between">
                <div>
                    <div class="flex-jc-between">
                        <div>订单号:</div>
                    </div>
                </div>
                <div class="fz12 fc-grey">{{data.order_sn}}</div>
            </div>
            <div class="flex-jc-between pd-t20">
                <div>商品总额:</div>
                <div class="fz12 fc-grey">¥{{data.goods_price}}</div>
            </div>
            <div class="flex-jc-between pd-t20">
                <div>配送方式:</div>
                <div class="fz12 fc-grey" v-show="data.delivery_method==1">快递配送</div>
                <div class="fz12 fc-grey" v-show="data.delivery_method==2">门店自提</div>
            </div>
            <div class="flex-jc-between pd-t20">
                <div>运费:</div>
                <div class="fz12 fc-grey">¥{{data.carriage}}</div>
            </div>
            <div class="flex-jc-between pd-t20">
                <div>备注:</div>
                <div class="fz12 fc-grey">{{data.remark }}</div>
            </div>

            <div class="flex-jc-between pd-t20 fc-fen">
                <div>应付金额：</div>
                <div class="fz12">¥{{data.total_price}}</div>
            </div>
        </div>

        <div class="btn_box pd-10 bgc" v-show="order_status==0">
            <span class="fc-fen text-c border-fen" @click="toPay">待付款</span>
            <span class="fc-grey text-c border" @click="onshowmodel">取消订单</span>
        </div>
        <div class="btn_box pd-10 bgc" v-show="order_status==2" @click="confirm">
            <span class="fc-fen text-c border-fen">确认收货</span>
        </div>
        <div class="btn_box pd-10 bgc" v-show="order_status==3" @click="confirm">
            <span class="fc-fen text-c border-fen">确认取货</span>
        </div>
        <div class="btn_box pd-10 bgc" v-show="order_status==4" @click="del">
            <!-- <span class="fc-fen text-c border-fen" @click="toComment">待评论</span> -->
            <span class="fc-grey text-c border">删除订单</span>
        </div>
        <van-popup v-model="showmodel" position="bottom" :close-on-click-overlay="false">
            <div class="text-c position title">
                取消订单
                <div class="closeicon">
                    <van-icon name="close" @click="onshowmodel"/>
                </div>
            </div>
            <div class="pd-lr-15">
                <div class="pd-tb-15">请选择取消订单的原因,让我们更好的改进哦！</div>
                <van-radio-group v-model="radio" @change="checkedName">
                    <div
                            class="flex-jc-between mar-b-10"
                            @click="radio = index"
                            v-for="(item,index) in canceltext"
                            :key="index"
                    >
                        <span>{{index+1}}、{{item.text}}</span>
                        <van-radio :name="index" checked-color="#FE4171"></van-radio>
                    </div>
                </van-radio-group>
            </div>
            <div class="pd-15">
                <div class="btn text-c" @click="cancelOrder">确定</div>
            </div>
        </van-popup>

        <van-dialog v-model="show" show-cancel-button :before-close="beforeClose">
            <div class="text-c pd-15">确认删除订单？</div>
        </van-dialog>
    </div>
</template>

<script>
    import {Toast} from "vant";
    import wx from "weixin-js-sdk";

    export default {
        data() {
            return {
                hour: "",
                minute: "",
                data: "",
                express: "",
                store: "",
                cancel_remark: "测试/误下单",
                order_status: "",
                radio: 0,
                showmodel: false,
                show: false,
                canceltext: [
                    {id: 1, text: "测试/误下单"},
                    {id: 2, text: "规格、数量选错"},
                    {id: 3, text: "不想要了"},
                    {id: 4, text: "其他"}
                ]
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/order/detail", {
                        params: {
                            order_id: this.$route.query.id
                        }
                    })
                    .then(res => {
                        console.log(res.data, "order/detail");
                        let resdata = res.data;
                        if (resdata.code == 200) {
                            this.hour = resdata.data.hour;
                            this.minute = resdata.data.minute;
                            console.log(resdata.data.hour);
                            this.express = resdata.data.express;
                            this.data = resdata.data.order;
                            this.order_status = resdata.data.order.order_status;
                            this.store = resdata.data.store;
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
            onshowmodel() {
                if (this.showmodel) {
                    this.showmodel = false;
                } else {
                    this.showmodel = true;
                }
            },

            // 取消订单
            cancelOrder() {
                Toast.loading({mask: true, message: "加载中..."});

                let param = new URLSearchParams();
                param.append("order_id", this.$route.query.id);
                param.append("cancel_remark", this.cancel_remark);

                this.axios
                    .post(this.API + "/api/v1/order/cancel", param)
                    .then(res => {
                        console.log(res.data, "order/cancel");
                        let resdata = res.data;
                        this.$router.back(-1);
                        Toast.clear();
                        Toast(resdata.msg);
                    })
                    .catch(error => {
                        Toast.clear();
                        Toast("网络出错");
                    });
                this.showmodel = false;
            },
            del() {
                this.show = true;
            },
            checkedName(res) {
                console.log(res);
                if (res == 0) {
                    this.cancel_remark = "测试/误下单";
                } else if (res == 1) {
                    this.cancel_remark = "规格、数量选错";
                } else if (res == 2) {
                    this.cancel_remark = "不想要了";
                } else {
                    this.cancel_remark = "其他";
                }
            },
            postm() {
                this.$router.push({
                    path: "/postMessage",
                    query: {
                        id: this.$route.query.id
                    }
                });
            },
            // 去付款
            toPay() {
                let param = new URLSearchParams();
                param.append("order_id", this.$route.query.id);
                // 获取签名信息
                this.axios.get(this.API + "/api/v1/wechat/config", {
                    params: {
                        store_id: JSON.parse(window.localStorage.getItem("store_id")),
                        url: location.href.split("#")[0]
                    }
                }).then(res => {
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
                            jsApiList: ["chooseWXPay", "translateVoice"]
                        });
                        this.axios.post(this.API + "/api/v1/order/pay", param).then(res => {
                            let resdata = res.data;
                            console.log();
                            if (resdata.code == 200) {
                                wx.chooseWXPay({
                                    timestamp: resdata.data.timeStamp, // 支付签名时间戳，
                                    nonceStr: resdata.data.nonceStr, // 支付签名随机串，不长于 32 位
                                    package: resdata.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                                    signType: resdata.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                    paySign: resdata.data.paySign, // 支付签名
                                    success: function (res) {
                                        // 支付成功后的回调函数
                                        Toast("微信支付成功");

                                        Dialog.alert({
                                            message: "微信支付成功"
                                        }).then(() => {
                                            window.location.href = `${location.origin}/app/#/me`;
                                        });
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
                    } else if (resdata.code == 40005) {
                        this.$router.push({
                            path: "/"
                        });
                    } else {
                        Toast(resdata.msg);
                    }
                })
                    .catch(error => {
                        Toast.clear();
                        Toast("网络出错");
                    });
            },
            // 确认收货 取货
            confirm() {
                console.log(this.order_id);
                Toast.loading({mask: true, message: "加载中..."});

                let param = new URLSearchParams();
                param.append("order_id", this.$route.query.id);
                this.axios.post(this.API + "/api/v1/order/confirm", param).then(res => {
                    console.log(res.data, "order/confirm");
                    let result = res.data;
                    if (result.code == 200) {
                        this.getData();
                        Toast.clear();
                        Toast(resdata.msg);
                    } else {
                        this.getData();
                        Toast.clear();
                        Toast(resdata.msg);
                    }

                });
            },
            // 删除订单
            beforeClose(action, done) {
                if (action === "confirm") {
                    // setTimeout(done, 500);

                    Toast.loading({mask: true, message: "加载中..."});

                    let param = new URLSearchParams();
                    param.append("order_id", this.$route.query.id);

                    this.axios
                        .post(this.API + "/api/v1/order/del", param)
                        .then(res => {
                            console.log(res.data, "order/del");
                            this.$router.back(-1);
                            Toast.clear();
                            Toast(resdata.msg);
                        })
                        .catch(error => {
                            Toast.clear();
                            Toast("网络出错");
                        });
                } else {
                    done();
                }
            }
            // toComment() {
            //   this.$router.push({
            //     path: "/comment/",
            //     query: {
            //       id: this.$route.query.id
            //     }
            //   });
            // }
        }
    };
</script>

<style scoped>
    .pd-t {
        padding-top: 10px;
    }

    .pd-t20 {
        padding-top: 20px;
    }

    .pd-10 {
        padding: 10px 0;
    }

    .fz13 {
        font-size: 13px;
    }

    .fz12 {
        font-size: 12px;
    }

    .img_daifu {
        width: 17px;
        height: 17px;
        margin-right: 10px;
    }

    .img_daifa {
        width: 20px;
        height: 17px;
        margin-right: 10px;
    }

    .img_daishou {
        width: 20px;
        height: 19px;
        margin-right: 10px;
    }

    .img_daipinglun {
        width: 21px;
        height: 19px;
        margin-right: 10px;
    }

    .wuliu {
        width: 265px;
    }

    .img_location {
        width: 13px;
        height: 16px;
        margin: 2px 10px 0 0;
    }

    .product {
        margin-bottom: 10px;
    }

    .product:last-child {
        margin-bottom: 0px;
    }

    .img_pro {
        width: 60px;
        height: 65px;
        margin-right: 10px;
        border-radius: 5px;
    }

    .btn_box {
        display: flex;
        flex-direction: row-reverse;
        margin-top: 30px;
    }

    .btn_box span {
        width: 80px;
        height: 30px;
        margin-right: 15px;
        line-height: 30px;
        border-radius: 5px;
    }

    .tag .dot {
        position: absolute;
        top: 0;
        right: 0;
    }

    .list {
        padding: 14px;
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

    .btn {
        height: 30px;
        line-height: 30px;
        border-radius: 20px;
        color: #fff;
        background-image: linear-gradient(90deg, #fe4171, #fe4171 100%);
    }

    .codeimg {
        width: 180px;
        height: 180px;
        margin-bottom: 20px;
    }

    .closeimg {
        width: 34px;
        height: 34px;
        position: absolute;
        right: 20px;
        top: 100px;
        font-size: 34px;
    }

    .title .closeicon {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 20px;
    }

    .title {
        font-size: 16px;
        padding-top: 15px;
    }
</style>
