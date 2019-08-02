<template>
  <div class="bgc pd-15">
    <div v-show="applyorder.length==0" class="text-c">暂无申请订单</div>
    <div class="order_box mar-b-10" v-for="(item,index) in applyorder">
      <div class="flex-jc-between border-b top pd-tb-15">
        <div class="fz12">{{item.serve_time}}到店</div>
        <div class="fc-fen" v-show="item.order_status==0">待付款</div>
        <div class="fc-fen" v-show="item.order_status==1">待美容师确定</div>
        <div class="fc-fen" v-show="item.order_status==2">待服务</div>
        <div class="fc-fen" v-show="item.order_status==3">已拒绝</div>
        <div class="fc-fen" v-show="item.order_status==4">已服务</div>
        <div class="fc-fen" v-show="item.order_status==5">待评价</div>
        <div class="fc-fen" v-show="item.order_status==6">已完成</div>
        <div class="fc-fen" v-show="item.order_status==7">已取消</div>
      </div>
      <div class="flexbox border-b content pd-tb-15">
        <img class="img_head" :src="item.beautician.avatar">

        <div class="right">
          <div>{{item.beautician.username}}</div>
          <div class="fc-grey fz12">{{item.store.name}}</div>
          <div class="flexbox">
            服务项目:
            <div v-for="(items,indexs) in item.serve">
              <span style="padding-right:4px">{{items.serve_name}}</span>
            </div>
          </div>
          <div>支付费用:¥{{item.total_price}}</div>
        </div>
      </div>

      <div
        class="text-r pd-lr-15 btn"
        @click.stop="onshowmodel(item.id)"
        v-if="item.order_status==1"
      >
        <span class="border">取消订单</span>
      </div>

      <div class="text-r pd-lr-15 btn" @click="toComment(item.id)" v-else-if="item.order_status==5">
        <span class="border-fen fc-fen">立即评论</span>
      </div>

      <div class="text-r pd-lr-15 btn" @click="del(item.id)" v-else-if="item.order_status==3">
        <span class="border">删除订单</span>
      </div>
      <div class="text-r pd-lr-15 btn" @click="del(item.id)" v-else-if="item.order_status==0">
        <span class="border">删除订单</span>
      </div>
      <div class="text-r pd-lr-15 btn" @click="del(item.id)" v-else-if="item.order_status==7">
        <span class="border">删除订单</span>
      </div>
      <div class="text-r pd-lr-15 btn" @click="del(item.id)" v-else-if="item.order_status==6">
        <span class="border">删除订单</span>
      </div>
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
        <div class="btn1 text-c" @click="cancelOrder">确定</div>
      </div>
    </van-popup>

    <van-dialog v-model="show" show-cancel-button :before-close="beforeClose">
      <div class="text-c pd-15">确认删除订单？</div>
    </van-dialog>
  </div>
</template>
<script>
import { Dialog, Toast } from "vant";
export default {
  data() {
    return {
      radio: 0,
      applyorder: [],
      canceltext: [
        { id: 1, text: "测试/误下单" },
        { id: 2, text: "规格、数量选错" },
        { id: 3, text: "不想要了" },
        { id: 4, text: "其他" }
      ],
      showmodel: false,
      show: false,
      order_id: "",
      orderlist: [
        { state: "0", btn_state: "0" },
        { state: "1", btn_state: "1" },
        { state: "2", btn_state: "2" }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios.get(this.API + "/api/v1/serve/order").then(res => {
        console.log(res.data, "serve/order");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.applyorder = resdata.data;
          Toast.clear();
        } else {
          Toast.clear();
          Toast(resdata.msg);
        }
      });
    },

    toComment(id) {
      this.$router.push({
        path: "/comments",
        query: {
          id: id
        }
      });
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

    // 取消订单
    cancelOrder() {
      Toast.loading({ mask: true, message: "加载中..." });
      let param = new URLSearchParams();
      param.append("order_id", this.order_id);
      param.append("cancel_remark", this.cancel_remark);
      this.axios
        .post(this.API + "/api/v1/serve/cancel", param)
        .then(res => {
          console.log(res.data, "serve/cancel");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast(resdata.msg);
            this.getData();
            Toast.clear();
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
      this.showmodel = false;
    },
    onshowmodel(id) {
      console.log(id);
      this.order_id = id;
      if (this.showmodel) {
        this.showmodel = false;
      } else {
        this.showmodel = true;
      }
    },

    // 删除订单
    beforeClose(action, done) {
      if (action === "confirm") {
        Toast.loading({ mask: true, message: "加载中..." });
        let param = new URLSearchParams();
        param.append("order_id", this.order_id);
        this.axios
          .post(this.API + "/api/v1/serve/del", param)
          .then(res => {
            console.log(res.data, "serve/del");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast(resdata.msg);
              this.getData();
              Toast.clear();
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
        setTimeout(done, 500);
      } else {
        done();
      }
    },
    del(id) {
      this.show = true;
      this.order_id = id;
      console.log(id);
    }
  }
};
</script>

<style scoped>
.fz12 {
  font-size: 12px;
}
.fcol {
  color: #686364;
}
.top {
  margin-left: 15px;
  padding-right: 15px;
}
.order_box {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 1px 2px 8px 0px rgba(207, 206, 206, 0.5);
  border-radius: 5px;
}
.content {
  margin-left: 15px;
  padding-right: 15px;
}
.right {
  margin-left: 12px;
}
.right div {
  line-height: 20px;
}
.img_head {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.btn {
  height: 45px;
  line-height: 45px;
}
.btn span {
  padding: 5px 10px;
  border-radius: 5px;
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
.btn1 {
  height: 30px;
  line-height: 30px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #fe4171, #fe4171 100%);
}
</style>
