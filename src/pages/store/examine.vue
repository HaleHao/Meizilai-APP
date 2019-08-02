<template>
    <div>
        <div class="nav flex-jc-around">
            <div :class="{ 'selected': typenum==1 }" @click="watting">待审批</div>
            <div :class="{ 'selected': typenum==2 }" @click="already">已审批</div>
        </div>

        <div class="mar-b-10">
            <div v-show="lorderlist.length==0" class="text-c">暂无此订单状态的订单</div>
            <div class="pd-lr-15 mar-b-10" v-for="(item,index) in lorderlist">
                <div class="fuwu_box bgc">
                    <div class="flex-jc-between pd-trb0">
                        <div>
                            <span>用户姓名:</span>
                            <span>{{item.username}}</span>
                        </div>
                        <div class="fsz12 fc-grey">{{item.submit_time}}</div>
                    </div>

                    <div class="pd-trb0">
                        <span>联系电话:</span>
                        <span class="fsz12 fc-grey text-line">{{item.mobile}}</span>
                    </div>
                    <div class="pd-trb0">
                        <span>注册时间:</span>
                        <span class="fsz12 fc-grey">{{item.reg_time}}</span>
                    </div>
                    <div class="pd-trb0">
                        <span>当前级别:</span>
                        <span class="fsz12 fc-grey">{{item.card_name}}</span>
                    </div>
                    <div class="pd-trb0">
                        <div>
                            <span>升级为:</span>
                            <span class="fc-fen fsz12">{{item.level_name}}</span>
                        </div>
                    </div>

                    <div class="flex-jc-around btn_box" v-show="typenum==1">
                        <!-- <div class="reject" @click="onshowmodel">拒绝申请</div> -->
                        <div class="reject" @click="reject(item.order_id)">拒绝申请</div>
                        <div class="agree border-fen" @click="agree(item.order_id)">同意申请</div>
                    </div>
                </div>
            </div>
        </div>

        <div style="height:40px"></div>
        <van-popup v-model="showmodel" position="bottom" :close-on-click-overlay="false">
            <div class="text-c position title">
                拒绝接单
                <div class="closeicon">
                    <van-icon name="close" @click="onshowmodel"/>
                </div>
            </div>
            <div class="pd-lr-15">
                <div style="padding:20px 0">请选择拒绝的原因(必选):</div>
                <van-radio-group v-model="radio">
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
            <div class="pd-15" @click="onshowmodel">
                <div class="btn text-c">提交</div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import {Toast} from "vant";

    export default {
        data() {
            return {
                typenum: 1,
                radio: 0,
                lorderlist: "",
                canceltext: [
                    {id: 1, text: "原因1"},
                    {id: 2, text: "原因2"},
                    {id: 3, text: "原因3"},
                    {id: 5, text: "其他"}
                ],
                showmodel: false
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                let store_token = JSON.parse(window.localStorage.getItem("store_token"));
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/store/lorder/list", {
                        params: {
                            type: 1,
                            store_token: store_token
                        }
                    })
                    .then(res => {
                        console.log(res.data, "lorder/list");

                        let resdata = res.data;
                        if (resdata.code == 200) {
                            this.lorderlist = resdata.data;
                            let list = this.gorderlist;

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
            watting() {
                this.typenum = 1;
                this.getData();
            },
            already() {
                this.typenum = 2;
                let store_token = JSON.parse(window.localStorage.getItem("store_token"));
                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .get(this.API + "/api/v1/store/lorder/list", {
                        params: {
                            type: 2,
                            store_token: store_token
                        }
                    })
                    .then(res => {
                        console.log(res.data, "lorder/list");

                        let resdata = res.data;
                        if (resdata.code == 200) {
                            this.lorderlist = resdata.data;
                            let list = this.gorderlist;

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
            onshowmodel() {
                if (this.showmodel) {
                    this.showmodel = false;
                } else {
                    this.showmodel = true;
                }
            },
            agree(id) {
                let store_token = JSON.parse(window.localStorage.getItem("store_token"));
                let param = new URLSearchParams();
                param.append("order_id", id);
                param.append("store_token", store_token);

                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .post(this.API + "/api/v1/store/lorder/agree", param)
                    .then(res => {
                        console.log(res.data, "agree");
                        let resdata = res.data;
                        if (resdata.code == 200) {
                            Toast(resdata.data);
                            this.getData();
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
            reject(id) {
                let store_token = JSON.parse(window.localStorage.getItem("store_token"));
                let param = new URLSearchParams();
                param.append("order_id", id);
                param.append("store_token", store_token);

                Toast.loading({mask: true, message: "加载中..."});
                this.axios
                    .post(this.API + "/api/v1/store/lorder/refuse", param)
                    .then(res => {
                        console.log(res.data, "refuse");
                        let resdata = res.data;
                        if (resdata.code == 200) {
                            Toast(resdata.data);
                            this.getData();
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
            // 服务详情

            toserDetail() {
                this.$router.push({path: "/serviceDetail/"});
            }
        }
    };
</script>


<style scoped>
    .nav {
        padding: 15px 90px;
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

    .btn_box {
        margin-top: 20px;
        font-size: 13px;
    }

    .img_sanjiao {
        width: 8px;
        height: 6px;
    }

    .reject {
        color: #787878;
        border-radius: 5px;
        background: #e4e4e4;
        padding: 5px 25px;
        margin-left: 10px;
    }

    .agree {
        color: #fff;
        border-radius: 5px;
        padding: 5px 25px;
        background-image: linear-gradient(90deg, #ff5491, #fe4171);
        margin-right: 10px;
    }

    .tihuo {
        color: #fff;
        border-radius: 5px;
        padding: 5px 100px;
        background-image: linear-gradient(90deg, #ff5491, #fe4171);
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