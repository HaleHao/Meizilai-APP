<template>
    <div class="pd-15">
        <div class="fuwu_box bgc" v-show="is_serve == 1">
            <div class="fuwutitle" v-show="serve.order_status==1">待接单</div>
            <div class="fuwu_title" v-show="serve.order_status==2">待服务</div>
            <div class="fuwu_title" v-show="serve.order_status==4">已服务</div>
            <div class="fuwu_title" v-show="serve.order_status==3">未服务</div>
            <div class="pd-lr-15">
                <span>用户姓名:</span>
                <span>{{serve.username}}</span>
            </div>
            <div class="pd-lr-15">
                <span>联系电话:</span>
                <span>{{serve.mobile}}</span>
            </div>
            <div class="fc-fen pd-lr-15">
                <span>服务时间:</span>
                <span>{{serve.serve_time}}</span>
            </div>
            <div class="pd-lr-15">
                <span>当前级别:</span>
                <span>{{serve.card_level}}</span>
            </div>
            <div class="pd-lr-15">
                <div>
                    <span>申请时间:</span>
                    <span>{{serve.submit_time}}</span>
                </div>
            </div>

            <div class="fc-fen pd-lr-15 flex-jc-between flex-align-items" @click="check(serve.order_serve)">
                <div>
                    <span>服务项目:</span>
                    <span>{{serval}}</span>
                </div>
                <img class="img_sanjiao" src="../../assets/photo/icon-triangle.png">
            </div>

            <div class="pd-lr-15">
                <span>支付金额:</span>
                <span>{{serve.total_price}}</span>
            </div>
        </div>
        <div v-show="is_serve == 0">
            <div class="flex-jc-between border-b pd-15" @click="onshowmodel">
                <div>美容师</div>
                <div class="fc-grey flex-align-items">
                    <span class="fc-grey fz13">{{beautician_name==""?'请选择':beautician_name}}</span>
                    <van-icon name="arrow"/>
                </div>
            </div>
        </div>

        <van-popup v-model="show">
            <div class="pd-15 popup-box">
                <div class="flex-align-items" v-for="item in serve.order_serve">
                    <img class="circle-img" src="../../assets/photo/circle.png">
                    {{item.serve_name}}
                </div>
            </div>
        </van-popup>


        <van-popup v-model="showmodel" position="bottom" style="height:350px" :close-on-click-overlay="false">
            <div class="text-c position title">
                请选择服务人员
                <div class="closeicon">
                    <van-icon name="close" color="#979797" @click="onshowmodel"/>
                </div>
            </div>
            <div>
                <van-radio-group v-model="radio" @change="checkedData">
                    <div class="flex-jc-between flex-align-items beautician-list border-b pd-tb-15" @click="radio = index" v-for="(item,index) in beautician" :key="index">
                        <div class="info">
                            <div class="head_img">
                                <img :src="item.avatar">
                            </div>
                            <div class="right_box">
                                <div>{{item.username}}</div>
                                <div class="fz11 fc-grey number">服务次数 {{item.serve_num}}</div>
                                <div class="fz11 fc-fen">好评 {{item.grade}}%</div>
                            </div>
                        </div>
                        <van-radio :name="index" checked-color="#FF508B"></van-radio>
                    </div>
                </van-radio-group>
            </div>
        </van-popup>
        <!--<div class="pays">-->
        <!--<div>-->
        <!--<div class="je">¥ {{total_price}}</div>-->
        <!--<div class="btn" @click="submit()">立即开机</div>-->
        <!--</div>-->
        <!--</div>-->
        <div class="btn_box">
            <div class="je">¥ {{total_price}}</div>
            <div class="btn" @click="submit()">立即开机</div>
            <!--<div class="no_btn" v-else>无法开机</div>-->
        </div>
    </div>
</template>

<script>
    import {Toast, Dialog} from "vant";
    import wx from "weixin-js-sdk";

    export default {
        data() {
            return {
                total_price: "9.9",
                store_id: 0,
                device_id: 0,
                order_id: 0,
                is_show: false,
                serve: "",
                show: false,
                serval: "",
                message_show: false,
                message: "",
                is_serve: 0,
                beautician: [],
                showmodel:false,
                beautician_id: 0,
                beautician_name: "",
                radio: -1,
                serve_id:0,
            };
        },
        created() {
            let store_id = this.$route.query.store_id;
            if (!store_id) {
                store_id = 0;
            }
            this.store_id = store_id;
            //存进缓存，为之后登录做打算
            window.localStorage.setItem("store_id", store_id);

            let device_id = this.$route.query.device_id;
            if (!device_id) {
                device_id = 0;
            }
            this.device_id = device_id;

            this.getData();
        },
        methods: {
            getData() {
                Toast.loading({mask: true, message: "加载中..."});
                this.axios.get(this.API + "/api/v1/device", {
                        params: {
                            store_id: this.store_id,
                            device_id: this.device_id,

                        }
                    }).then(res => {
                        let result = res.data;
                        if (result.code == 200) {
                            let data = result.data;
                            this.total_price = data.total_price;
                            this.store_id = data.store_id;
                            this.device_id = data.device_id;
                            this.serve = data.serve_order;
                            this.serval = "无";
                            this.is_serve = data.is_serve;
                            this.beautician = data.beautician;
                            if (data.is_serve == 1){
                                if (data.serve_order.order_serve.length > 0) {
                                    this.serval = data.serve_order.order_serve[0].serve_name;
                                }
                            }
                            if (data.is_serve == 1){
                                this.serve_id = data.serve_order.id
                            }
                            this.is_show = true;
                            Toast.clear();
                        } else if (result.code == 20003) {
                            Dialog.alert({
                                message: result.msg
                            }).then(() => {
                                window.location.href = `${location.origin}/shopDetail?id=` + this.store_id;
                            });
                        } else if (result.code == 20002) {
                            Dialog.alert({
                                message: result.msg
                            }).then(() => {
                                window.location.href = `${location.origin}/memberCard`;
                            });
                        } else if (result.code == 40005) {
                            Dialog.alert({
                                message: result.msg
                            }).then(() => {
                                window.location.href = `${location.origin}/?store_id=` + this.store_id;
                            });
                        } else {
                            Toast.fail(result.msg);
                        }
                    }).catch(error => {
                        Toast.clear();
                        Toast("网络出错");
                    });
            },

            check(e) {
                console.log(e);

                this.show = true;
            },

            onshowmodel() {
                if (this.showmodel) {
                    this.showmodel = false;
                } else {
                    this.showmodel = true;
                }
            },

            checkedData(res) {
                console.log(res);

                let beautiarr = this.beautician;
                this.beautician_id = beautiarr[res].id;
                this.beautician_name = beautiarr[res].username;
                for (let v of beautiarr) {
                    // if ((v.id = this.beautician_id)) {
                    //   console.log(v.id);
                    //   console.log(v.username);
                    // }
                }
                this.showmodel = false;
            },

            submit() {
                Toast.loading({mask: true, message: "加载中..."});
                //组装参数
                let param = new URLSearchParams();
                param.append("device_id", this.device_id);
                param.append("is_serve",this.is_serve);
                param.append("beautician_id",this.beautician_id);
                param.append("serve_id",this.serve_id);
                this.axios.post(this.API + "/api/v1/device/submit", param).then(res => {
                    let result = res.data;
                    if (result.code == 200) {
                        let data = result.data;
                        this.order_id = data.id;
                        Toast.success(result.msg);
                        //配置微信SDK
                        Toast.loading({mask: true, message: "加载中..."});
                        this.axios
                            .get(this.API + "/api/v1/wechat/config", {
                                params: {
                                    store_id: this.store_id,
                                    url: location.href.split("#")[0]
                                }
                            })
                            .then(res => {
                                let result = res.data;
                                if (result.code == 200) {
                                    wx.config({
                                        debug: false,
                                        appId: result.data.appId, // 必填，公众号的唯一标识
                                        nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
                                        signature: result.data.signature, // 必填，签名，见附录1
                                        timestamp: result.data.timestamp, // 必填，生成签名的时间戳
                                        url: result.data.url,
                                        jsApiList: ["chooseWXPay", "translateVoice"]
                                    });
                                    //支付
                                    let param = new URLSearchParams();
                                    param.append("order_id", this.order_id);
                                    this.axios
                                        .post(this.API + "/api/v1/device/pay", param)
                                        .then(res => {
                                            let result = res.data;
                                            if (result.code == 200) {
                                                wx.chooseWXPay({
                                                    timestamp: result.data.timeStamp, // 支付签名时间戳，
                                                    nonceStr: result.data.nonceStr, // 支付签名随机串，不长于 32 位
                                                    package: result.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                                                    signType: result.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                                    paySign: result.data.paySign, // 支付签名
                                                    success: function (res) {
                                                        // 支付成功后的回调函数
                                                        Dialog.alert({
                                                            message: "支付成功"
                                                        }).then(() => {
                                                            window.location.href = `${
                                                                location.origin
                                                                }/me`;
                                                        });
                                                    }
                                                });
                                            } else {
                                                Toast.fail(result.msg);
                                            }
                                        })
                                        .catch(error => {
                                            Toast.clear();
                                            Toast("网络出错");
                                        });
                                } else if (result.code == 20002) {
                                    Dialog.alert({
                                        message: result.msg
                                    }).then(() => {
                                        window.location.href = `${location.origin}/memberCard`;
                                    });
                                } else if (result.code == 20003) {
                                    // console.log('-----------------')
                                    Dialog.alert({
                                        message: result.msg
                                    }).then(() => {
                                        window.location.href =
                                            `${location.origin}/shopDetail?id=` + this.store_id;
                                    });
                                    // Toast.fail(result.msg);
                                }
                            });
                    } else {
                        Toast.fail(result.msg);
                    }
                });
            }
        }
    };
</script>

<style scoped>

    .beautician-list{
        padding-left: 15px;
        padding-right: 15px;
    }
    .info{
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
    }
    .right_box{
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        padding-left: 10px;
    }
    .head_img > img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .pays {
        height: 100vh;
        width: 100%;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .je {
        font-size: 20px;
        text-align: center;
        color: #fe4171;
    }

    .btn {
        margin-top: 10px;
        font-size: 13px;
        text-align: center;
        color: #fff;
        border-radius: 20px;
        padding: 2px 100px;
        background-image: linear-gradient(90deg, #ff5491, #fe4171);
    }

    .no_btn {
        margin-top: 10px;
        font-size: 13px;
        text-align: center;
        color: #fff;
        border-radius: 20px;
        padding: 10px 100px;
        background-image: linear-gradient(90deg, #c8c9cc, #c8c9cc);
    }

    .fzc13 {
        font-size: 13px;
    }

    .fuwu_box {
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 1px 2px 8px 0px rgba(207, 206, 206, 0.5);
        border-radius: 10px;
        overflow: hidden;
        line-height: 40px;
        padding-bottom: 15px;
    }

    .fuwutitle {
        background-image: linear-gradient(90deg, #ff5491, #fe4171);
        color: #fff;
        padding-left: 15px;
    }

    .fuwu_title {
        background: #dcd7d7;
        color: #fff;
        padding-left: 15px;
    }

    .btn_box {
        margin-top: 30px;
        font-size: 13px;
    }

    .img_sanjiao {
        width: 7px;
        height: 7px;
    }

    .reject {
        color: #ff396e;
        border-radius: 20px;
        padding: 5px 30px;
        margin-left: 15px;
    }

    .agree {
        color: #fff;
        border-radius: 20px;
        padding: 5px 30px;
        margin-right: 15px;
        background-image: linear-gradient(90deg, #ff5491, #fe4171);
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
        background-image: linear-gradient(90deg, #ff5491, #fe4171);
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
        top: 17px;
        font-size: 20px;
    }

    .title {
        font-size: 16px;
        padding-top: 15px;
    }

    .popup-box {
        width: 200px;
    }

    .popup-box > div {
        margin-bottom: 10px;
    }

    .popup-box > div:last-child {
        margin-bottom: 0px;
    }

    .circle-img {
        width: 12px;
        height: 12px;
        margin-right: 10px;
    }
</style>

