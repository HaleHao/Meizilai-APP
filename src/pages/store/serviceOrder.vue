<template>
    <div>
        <div class="nav flex-jc-around">
            <div :class="{ 'selected': typenum==1 }" @click="waitting">待服务</div>
            <div :class="{ 'selected': typenum==2 }" @click="already">已服务</div>
            <div :class="{ 'selected': typenum==3 }" @click="cancelled">已取消</div>
        </div>

        <div class="mar-b-10">
            <div v-show="sorder.length==0" class="text-c">暂无此订单状态的订单</div>
            <div class="pd-lr-15 mar-b-10" v-for="(item,index) in sorder">
                <div class="fuwu_box bgc">
                    <div class="fuwutitle border-b flex-jc-between pd-15">
                        <div class="fsz18">#{{item.id}}</div>
                        <div v-show="item.order_status==1">待美容师接单</div>
                        <div v-show="item.order_status==2">待服务</div>
                        <div v-show="item.order_status==3">美容师已拒绝</div>
                        <div v-show="item.order_status==4">已服务</div>
                        <div v-show="item.order_status==5">待评价</div>
                        <div v-show="item.order_status==6">已完成</div>
                        <div v-show="item.order_status==7">已取消</div>
                    </div>

                    <div class="pd-trb0">
                        <span>用户姓名:</span>
                        <span>{{item.username}}</span>
                    </div>
                    <div class="pd-trb0">
                        <span>联系电话:</span>
                        <span class="fsz12 fc-grey">{{item.beautician}}</span>
                    </div>
                    <div class="pd-trb0">
                        <span>美容师:</span>
                        <span class="fsz12 fc-grey">{{item.beautician}}</span>
                    </div>
                    <div class="pd-trb0">
                        <span>服务时间:</span>
                        <span class="fsz12 fc-fen">{{item.serve_time}}</span>
                    </div>
                    <div class="pd-trb0">
                        <span>当前级别:</span>
                        <span class="fsz12 fc-grey">{{item.card_name}}</span>
                    </div>
                    <div class="pd-trb0 flex-jc-between flex-align-items" @click="isshow(item.serve)">
                        <div>
                            <span>服务项目:</span>
                            <span
                                    v-for="(items,ind) in item.serve"
                                    v-if="ind==0"
                                    class="fc-grey"
                            >{{items.serve_name}}</span>
                        </div>
                        <div v-show="item.serve.length!=0">
                            <img class="img_sanjiao" src="../../assets/photo/icon-triangle.png">
                        </div>
                    </div>

                    <div class="pd-trb0">
                        <span>客户金额:</span>
                        <span class="fz15 fc-fen">¥{{item.total_price}}</span>
                    </div>

                    <!-- <div class="pd-trb0" v-show="typenum==7">
                      <span>订单编号:</span>
                      <span class="fsz12 fc-grey">{{item.order_sn}}</span>
                    </div>-->
                    <div class="pd-trb0">
                        <div>
                            <span>申请时间:</span>
                            <span class="fc-grey fsz12">{{item.submit_time}}</span>
                        </div>
                    </div>
                    <div class="pd-trb0" v-show="typenum==7">
                        <div>
                            <span>取消原因:</span>
                            <span class="fc-grey fsz12">{{item.remark}}</span>
                        </div>
                    </div>
                    <div class="pd-trb0" v-show="typenum==7">
                        <div>
                            <span>取消时间:</span>
                            <span class="fc-grey fsz12">{{item.cancel_time}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="height:40px"></div>

        <van-popup v-model="show">
            <div class="pd-15 popup-box">
                <div class="flex-align-items" v-for="items in serve">
                    <img class="circle-img" src="../../assets/photo/circle.png">
                    {{items.serve_name||""}}
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import {Toast} from "vant";
    import {log} from "util";

    export default {
        data() {
            return {
                typenum: 1,
                radio: 0,
                serve: [],
                serve_name: "",
                store_id: "",
                show: false,
                sorder: ""
            };
        },
        created() {
            this.getData();

            this.store_id = JSON.parse(window.localStorage.getItem("store_id"));
        },
        methods: {
            // 点击显示弹窗 获取数组中的数据
            isshow(serve) {
                console.log(serve);
                this.serve = serve;
                this.show = true;
            },
            getData() {
                let store_token = JSON.parse(window.localStorage.getItem("store_token"));
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/store/sorder/list", {
                        params: {
                            type: this.typenum,
                            store_token: store_token
                        }
                    })
                    .then(res => {
                        console.log(res.data, "sorder/list");

                        let resdata = res.data;
                        if (resdata.code == 200) {
                            this.sorder = resdata.data;

                            Toast.clear();
                        } else if (resdata.code == 40006) {
                            Toast(resdata.msg);
                            this.$router.push({
                                path: "/storeLogin"
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
            waitting() {
                this.typenum = 1;
                this.getData();
            },
            already() {
                this.typenum = 2;
                let store_token = JSON.parse(window.localStorage.getItem("store_token"));
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/store/sorder/list", {
                        params: {
                            type: 2,
                            store_token: store_token
                        }
                    })
                    .then(res => {
                        console.log(res.data, "sorder/list");

                        let resdata = res.data;
                        if (resdata.code == 200) {
                            this.sorder = resdata.data;

                            Toast.clear();
                        } else if (resdata.code == 40006) {
                            Toast(resdata.msg);
                            this.$router.push({
                                path: "/storeLogin"
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
            cancelled() {
                this.typenum = 3;
                let store_token = JSON.parse(window.localStorage.getItem("store_token"));
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/store/sorder/list", {
                        params: {
                            type: 3,
                            store_token: store_token
                        }
                    })
                    .then(res => {
                        console.log(res.data, "sorder/list");

                        let resdata = res.data;
                        if (resdata.code == 200) {
                            this.sorder = resdata.data;

                            Toast.clear();
                        } else if (resdata.code == 40006) {
                            Toast(resdata.msg);
                            this.$router.push({
                                path: "/storeLogin"
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

            agree() {
                this.$router.back(-1);
            }
        }
    };
</script>


<style scoped>
    .nav {
        padding: 15px 60px;
    }

    .nav > div {
        height: 30px;
        line-height: 30px;
        display: inline-block;
        text-align: center;
        box-sizing: border-box;
        margin-right: 3px;
        color: #7f7f7f;
    }

    .nav .selected {
        /* background-image: linear-gradient(90deg, #fe4171 100%, #ff5491 100%); */
        color: #fe4171;
        border-bottom: 3px solid #ff5491;
    }

    .fz15 {
        font-size: 15px;
    }

    .fzc13 {
        font-size: 13px;
    }

    .fsz12 {
        font-size: 12px;
    }

    .pd-trb0 {
        padding: 10px 15px 0 15px;
    }

    .fsz18 {
        font-size: 18px;
    }

    .merchlist {
        height: 80px;
        box-shadow: 2px 3px 8px 1px rgba(222, 220, 220, 0.5);
        border-radius: 10px;
        line-height: 30px;
    }

    .fuwu_box {
        box-shadow: 1px 2px 8px 0px rgba(207, 206, 206, 0.5);
        border-radius: 10px;
        overflow: hidden;
        /* line-height: 40px; */
        padding-bottom: 15px;
    }

    .fuwutitle {
        color: #ff396e;
        padding-left: 15px;
    }

    .img_sanjiao {
        width: 8px;
        height: 6px;
    }

    .detail span {
        color: #ff396e;
        border-radius: 20px;
        padding: 5px 10px;
        font-size: 13px;
    }

    .img_fuwu {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }

    .img_sanjiao {
        width: 10px;
        height: 8px;
    }

    .img_slt {
        width: 80px;
        height: 80px;
        padding: 15px;
        border-radius: 20px;
    }

    .img_box img {
        margin-left: 15px;
    }

    .img_location {
        width: 11px;
        height: 14px;
    }

    .tag .dot {
        position: absolute;
        top: 0;
        right: 0;
    }

    .list {
        padding: 14px;
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

    .btn {
        height: 42px;
        line-height: 42px;
        border-radius: 20px;
        color: #fff;
        background-image: linear-gradient(90deg, #fe4171 100%, #ff5491 100%);
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