<template>
  <div class="bgc">
    <div>
      <div class="bg-c"></div>
      <!-- <div class="bg-c bgcolor2" v-show="state==1"></div>
      <div class="bg-c bgcolor3" v-show="state==2"></div>
      <div class="bg-c bgcolor4" v-show="state==3"></div>-->
      <div class="menber position" @click="toMenber">
        <!-- 银卡 -->
        <div class="pd-lr-15 menber_card">
          <img :src="card.img_url">
        </div>

        <!-- <div class="pd-lr-15 menber_card" v-show="state==1">
          <img src="../../assets/photo/menber2.png">
        </div>
      
        <div class="pd-lr-15 menber_card" v-show="state==2">
          <img src="../../assets/photo/menber3.png">
        </div>
     
        <div class="pd-lr-15 menber_card" v-show="state==3">
          <img src="../../assets/photo/menber4.png">
        </div>-->
        <div class="store-name">
          <!-- <span class="fz10 write_col">魅资莱</span> -->
          <!-- <img class="img_logo" src="../../assets/photo/mzlicon.png"> -->
        </div>
        <div class="time fz10 write_col">{{user.expiration_time}}到期</div>
        <div class="head_img text-c write_col">
          <img :src="user.avatar">
          <div class="fz15">{{user.username}}</div>
          <div class="fz13">{{type_name}}</div>
        </div>
        <div class="flex-jc-around profit_box write_col">
          <div>
            <div class="fz12">总收益(元)</div>
            <div class="fz20 text-c">{{user.earnings}}</div>
            <div class="text-c flex-align-items" style="margin-top:15px">
              <img class="img_chonzhi" src="../../assets/photo/chonzhi.png">
              <span>充值</span>
            </div>
          </div>
          <div>
            <div class="fz12">剩余次数</div>
            <div class="text-c fz20">{{user.card_num}}</div>
            <div
              class="text-c flex-align-items"
              style="margin-top:15px"
              @click.stop="toCash(user.earnings)"
            >
              <img class="img_tixian" src="../../assets/photo/tixian.png">
              <span>提现</span>
            </div>
          </div>
        </div>
      </div>
      <div class="pd-15">
        <div class="my_order">
          <van-cell value="查看更多" is-link @click="toAaifu(id=1)">
            <template slot="title">
              <span class="custom-t">我的订单</span>
            </template>
          </van-cell>
          <div class="flex-jc-around flex-align-items pd-tb-15">
            <div class="text-c pd-lr-15" @click="toAaifu(id=1)">
              <div style="height: 30px;">
                <img class="img_daifu" src="../../assets/photo/daifu.png">
              </div>
              <div>待付款</div>
            </div>

            <div class="text-c pd-lr-15" @click="toAaifa(id=2)">
              <div style="height: 30px;">
                <img class="img_daifa" src="../../assets/photo/daifa.png">
              </div>
              <div>待发货</div>
            </div>

            <div class="text-c pd-lr-15" @click="toAaishou(id=3)">
              <div style="height: 30px;">
                <img class="img_daishou" src="../../assets/photo/daishou.png">
              </div>
              <div>待收货</div>
            </div>

            <div class="text-c pd-lr-15" @click="toAaiping(id=4)">
              <div style="height: 30px;">
                <img class="img_daiping" src="../../assets/photo/daiping.png">
              </div>
              <div>待评价</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pd-lr-15 mar-bottom">
        <div class="tool">
          <div class="cy-txt">常用工具</div>

          <div class="flexbox flex-align-items pd-tb-15">
            <div class="text-c" @click="toTeam" style="width: 85px;">
              <div>
                <img class="img_daifu" src="../../assets/photo/tuandui.png">
              </div>
              <div>我的团队</div>
            </div>
            <div class="text-c" @click="toProfit" style="width: 85px;">
              <div>
                <img class="img_daishou" src="../../assets/photo/wodeshouyi.png">
              </div>
              <div>我的收益</div>
            </div>
            <div class="text-c" @click="toService" style="width: 85px;">
              <div>
                <img class="img_daishou" src="../../assets/photo/fuwu.png">
              </div>
              <div>我的服务</div>
            </div>
            <div class="text-c" @click="toAppl" style="width: 85px;">
              <div>
                <img class="img_daiping" src="../../assets/photo/dingdan.png">
              </div>
              <div>申请订单</div>
            </div>
          </div>
          <div class="flexbox flex-align-items pd-tb-15">
            <div class="text-c" @click="shang" style="width: 85px;">
              <div>
                <img class="img_daifu" src="../../assets/photo/shangji.png">
              </div>
              <div>我的上级</div>
            </div>
            <div class="text-c" @click="toStatistics" style="width: 85px;">
              <div>
                <img class="img_daishou" src="../../assets/photo/paihangbang@2x.png">
              </div>
              <div>排行榜</div>
            </div>
            <div class="text-c" @click="toSign(user_type)" style="width: 85px;">
              <div>
                <img class="img_daishou" src="../../assets/photo/qiandao.png">
              </div>
              <div>签到</div>
            </div>
            <div class="text-c" @click="toStore" style="width: 85px;">
              <div>
                <img class="img_daiping" src="../../assets/photo/dianpu.png">
              </div>
              <div>店铺入口</div>
            </div>
          </div>
          <div class="flexox flex-align-items pd-tb-15">
            <div class="text-c" @click="toApply" style="width: 85px;">
              <div>
                <img class="img_daifu" src="../../assets/photo/shenqing.png">
              </div>
              <div>我要申请</div>
            </div>
            <div class="text-c" @click="toAuthorization" style="width: 85px;">
              <div>
                <img class="img_daishou" src="../../assets/photo/chaxund.png">
              </div>
              <div>授权查询</div>
            </div>
            <div class="text-c" style="width: 85px;" @click="toPoster">
              <div>
                <img class="img_daiping" src="../../assets/photo/qr@2x.png">
              </div>
              <div>我的海报</div>
            </div>
            <div class="text-c" style="width: 85px;">
              <div @click="myInformat">
                <img class="img_daiping" src="../../assets/photo/shezhi@2x.png">
              </div>
              <div>设置</div>
            </div>
          </div>
          <div class="cart text-c" @click="toCart">
            <div>
              <img class="img_daiping" src="../../assets/photo/gouwuche.png">
            </div>
            <div>购物车</div>
          </div>
        </div>
      </div>
    </div>

    <van-dialog v-model="show" show-cancel-button :before-close="beforeClose">
      <div class="pd-15 text-c">请购买会员卡！</div>
    </van-dialog>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      state: 1,
      id: "0",
      card: "",
      user: "",
      user_type: "",
      type_name: "",
      show: false,
      username: "",
      password: ""

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
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/my")
        .then(res => {
          console.log(res.data, "/my");
          let resdata = res.data;

          if (resdata.code == 200) {
            if(resdata.data.is_moilbe != 1){
                this.$router.push({path: "/register"});
            }
            // this.card = resdata.data.card;
            if (resdata.data.is_card != 0) {
              this.card = resdata.data.card;
            } else {
              // this.show = true;
              this.$router.push({ path: "/menberCard" });
            }

            this.user = resdata.data.user;

            this.user_type = resdata.data.user.user_type;
            if (this.user_type == 0) {
              this.type_name = "普通用户";
            } else if (this.user_type == 1) {
              this.type_name = "会员卡会员";
            } else if (this.user_type == 2) {
              this.type_name = "共享合伙人";
            } else if (this.user_type == 3) {
              this.type_name = "美容师";
            } else {
              this.type_name = "店主";
            }

            // for (let v of resdata.data) {
            //   this.order_id = v.id;
            // }
            Toast.clear();
          } else if (resdata.code == 40005) {
            this.$router.push({
              path: "/"
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

    beforeClose(action, done) {
      if (action === "confirm") {
        this.toMenber();
        setTimeout(done, 1000);
      } else {
        done();
      }
    },
    // 订单
    toAaifu(id) {
      this.$router.push({
        path: "/myOrder",
        query: {
          id: id
        }
      });
    },
    toAaifa(id) {
      this.$router.push({
        path: "/myOrder",
        query: {
          id: id
        }
      });
    },
    toAaishou(id) {
      this.$router.push({
        path: "/myOrder",
        query: {
          id: id
        }
      });
    },
    toAaiping(id) {
      this.$router.push({
        path: "/myOrder",
        query: {
          id: id
        }
      });
    },

    // 提现
    toCash(e) {
      console.log(e);

      this.$router.push({
        path: "/cash",
        query: {
          id: this.user_type,
          earnings: e
        }
      });
    },
    // 会员卡
    toMenber() {
      this.$router.push({ path: "/menberCard" });
    },
    // 我的团队
    toTeam() {
      this.$router.push({ path: "/team" });
    },
    // 我的收益
    toProfit() {
      this.$router.push({ path: "/profit" });
    },
    // 我的服务
    toService() {
      if (this.user_type == 3) {
        this.$router.push({ path: "/service" });
      } else {
        Toast("您不是美容师");
      }
    },

    shang() {
      Toast("暂无内容");
    },
    // 排行榜
    toStatistics() {
      Toast("暂无内容");
      // this.$router.push({
      //   path: "/advertisement"
      // });
    },
    // 申请订单
    toAppl() {
      this.$router.push({
        path: "/applyOrder"
        // path: "/advertisement"
      });
    },

    // 签到
    toSign(id) {
      if (this.user_type == 2 || this.user_type == 3) {
        this.$router.push({
          path: "/signIntwo",
          query: {
            id: id
          }
        });
      } else if (this.user_type == 4) {
        this.$router.push({
          path: "/signInthree",
          query: {
            id: id
          }
        });
      } else {
        this.$router.push({ path: "/signIn" });
      }
    },
    // 店铺入口
    toStore() {
      if (this.user_type == 4) {
        let store_token = JSON.parse(
          window.localStorage.getItem("store_token")
        );
        if (store_token) {
          this.$router.push({ path: "/backstage" });
        } else {
          this.$router.push({ path: "/storeLogin" });
        }
      } else {
        Toast("您不是店主");
      }
    },
    // 我的申请
    toApply() {
      this.$router.push({ path: "/applicationUpgrade" });
    },
    // 我的授权
    toAuthorization() {
      this.$router.push({ path: "/authorization" });
    },
    // 我的海报
    toPoster() {
      this.$router.push({ path: "/poster" });
    },
    //设置
    myInformat(url) {
      this.$router.push({ path: "/MyInformation" });
    },
    toCart() {
      this.$router.push({ path: "/cart" });
    }
  }
};
</script>


<style scoped>
.pd-lr {
  padding: 0 10px;
}
.pd-lr-12 {
  padding: 0 12px;
}
.fz10 {
  font-size: 10px;
}
.fz12 {
  font-size: 12px;
}
.fz13 {
  font-size: 13px;
}

.fz15 {
  font-size: 15px;
}
.fz20 {
  font-size: 20px;
}
.write_col {
  color: #fff;
}
.bg-c {
  width: 100%;
  height: 150px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.bgcolor1 {
  background: #f2f2f2;
}
.bgcolor2 {
  background: #fdf8ef;
}
.bgcolor3 {
  background: #fdf2f2;
}
.bgcolor4 {
  background: #fdf6ff;
}
.menber {
  z-index: 2;
  top: -110px;
}
.profit_box {
  position: absolute;
  width: 280px;
  top: 65px;
  left: 20px;
}

.store-name {
  position: absolute;
  top: 10px;
  left: 25px;
  display: flex;
  justify-items: center;
}
.img_logo {
  width: 25px;
  height: 17px;
}
.time {
  position: absolute;
  top: 25px;
  left: 25px;
}
.head_img {
  position: absolute;
  top: -30px;
  left: 130px;
}
.head_img img {
  width: 60px;
  height: 60px;

  border-radius: 50%;
}
.menber_card {
  position: absolute;
  z-index: -1;
  width: 290px;
  height: 140px;
}
.menber_card img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.img_chonzhi {
  width: 20px;
  height: 14px;
  margin-right: 5px;
}
.img_tixian {
  width: 20px;
  height: 17px;
  margin-right: 5px;
}
.my_order {
  width: 290px;
  height: 110px;
  margin-top: 30px;
  border-radius: 10px;
  box-shadow: 2px 3px 8px 1px rgba(224, 222, 222, 0.5);
}
.tool {
  width: 290px;
  height: 310px;
  border-radius: 10px;
  box-shadow: 2px 3px 8px 1px rgba(224, 222, 222, 0.5);
}
.custom-t {
  font-size: 16px;
  font-weight: 600;
}
.mar-bottom {
  padding-bottom: 20px;
}
.cy-txt {
  font-size: 16px;
  font-weight: 600;
  padding: 15px 0 0 15px;
}
.img_daifu {
  width: 17px;
  height: 18px;
}
.img_daifa {
  width: 19px;
  height: 16px;
}
.img_daishou {
  width: 19px;
  height: 19px;
}
.img_daiping {
  width: 19px;
  height: 20px;
}
.cart {
  width: 50px;
  padding-left: 8px;
}
</style>