<template>
  <div class="pd-15">
    <div class="fuwu_box bgc">
      <div class="fuwutitle" v-show="data.order_status==1">待接单</div>
      <div class="fuwu_title" v-show="data.order_status==2">待服务</div>
      <div class="fuwu_title" v-show="data.order_status==4">已服务</div>
      <div class="fuwutitle" v-show="data.order_status==5">待评价</div>
      <div class="fuwu_title" v-show="data.order_status==3">未服务</div>
      <div class="fuwutitle" v-show="data.order_status==6">已完成</div>
      <div class="pd-lr-15">
        <span>用户姓名:</span>
        <span>{{data.username}}</span>
      </div>
      <div class="pd-lr-15">
        <span>联系电话:</span>
        <span>{{data.mobile}}</span>
      </div>
      <div class="fc-fen pd-lr-15">
        <span>服务时间:</span>
        <span>{{data.serve_time}}</span>
      </div>
      <div class="pd-lr-15">
        <span>当前级别:</span>
        <span>{{data.card_level}}</span>
      </div>
      <div class="pd-lr-15">
        <div>
          <span>申请时间:</span>
          <span>{{data.submit_time}}</span>
        </div>
      </div>

      <div
        class="fc-fen pd-lr-15 flex-jc-between flex-align-items"
        @click="check(data.order_serve)"
      >
        <div>
          <span>服务项目:</span>
          <span>{{serval}}</span>
        </div>
        <img class="img_sanjiao" src="../../assets/photo/icon-triangle.png">
      </div>

      <div class="pd-lr-15">
        <span>支付金额:</span>
        <span>{{data.total_price}}</span>
      </div>
      <div class="pd-lr-15" v-show="data.order_status==3">
        <span>未服务理由:</span>
        <span>{{data.remark}}</span>
      </div>
    </div>
    <div class="flex-jc-around btn_box" v-show="data.order_status==1">
      <div class="reject border-fen" @click="onshowmodel(data.id)">拒绝</div>
      <div class="agree border-fen" @click="agree(data.id)">
        <span class>同意</span>
      </div>
    </div>

    <van-popup v-model="show">
      <div class="pd-15 popup-box">
        <div class="flex-align-items" v-for="item in data.order_serve">
          <img class="circle-img" src="../../assets/photo/circle.png">
          {{item.serve_name}}
        </div>
      </div>
    </van-popup>

    <van-popup v-model="showmodel" position="bottom" :close-on-click-overlay="false">
      <div class="text-c position title">
        拒绝服务
        <div class="closeicon">
          <van-icon name="close" @click="onshowmodel"/>
        </div>
      </div>
      <div class="pd-lr-15">
        <div style="padding:20px 0">请选择拒绝的原因,以便让客户理解</div>
        <van-radio-group v-model="radio" @change="checkedName">
          <div
            class="flex-jc-between mar-b-10"
            @click="radio = index"
            v-for="(item,index) in canceltext"
            :key="index"
          >
            <span class="fzc13">{{index+1}}、{{item.text}}</span>
            <van-radio :name="index" checked-color="#FF508A"></van-radio>
          </div>
        </van-radio-group>
      </div>
      <div class="pd-15">
        <div class="btn text-c" @click="submit">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      radio: 0,
      data: "",
      order_id: "",
      remark: "今日繁忙",
      canceltext: [
        { id: 1, text: "今日繁忙" },
        { id: 2, text: "今日不在店内" },
        { id: 3, text: "在外学习" },
        { id: 4, text: "其他" }
      ],
      showmodel: false,
      show: false,
      serval: "",
      areaList: [
        { id: 0, val: "测试11" },
        { id: 1, val: "测试22" },
        { id: 1, val: "镇静舒缓修敏护理" }
      ]
    };
  },

  created() {
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/serve/detail", {
          params: {
            order_id: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res.data, "serve");
          let resdata = res.data;

          if (resdata.code == 200) {
            this.data = resdata.data;
            this.serval = "暂无";
            if (resdata.data.order_serve.length > 0) {
              this.serval = resdata.data.order_serve[0].serve_name;
            }
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
    agree(id) {
      Toast.loading({ mask: true, message: "加载中..." });

      let param = new URLSearchParams();
      param.append("order_id", id);

      this.axios
        .post(this.API + "/api/v1/serve/agree", param)
        .then(res => {
          console.log(res.data, "agree");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.success(resdata.msg);
            this.getData();
            Toast.clear();
          } else {
            Toast(resdata.msg);
            Toast.clear();
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
      // this.$router.back(-1);
    },
    submit() {
      Toast.loading({ mask: true, message: "加载中..." });

      let param = new URLSearchParams();
      param.append("order_id", this.order_id);
      param.append("remark", this.remark);
      this.axios
        .post(this.API + "/api/v1/serve/reject", param)
        .then(res => {
          console.log(res.data, "reject");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
            this.showmodel = false;
            this.getData();
            Toast.success(resdata.msg);
          } else {
            Toast(resdata.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
    },
    check(e) {
      console.log(e);

      this.show = true;
    },
    checkedName(res) {
      console.log(res);
      if (res == 0) {
        this.remark = "今日繁忙";
      } else if (res == 1) {
        this.remark = "今日不在店内";
      } else if (res == 2) {
        this.remark = "在外学习";
      } else {
        this.remark = "其他";
      }
    },
    // 拒绝
    onshowmodel(id) {
      this.order_id = id;
      console.log(this.order_id);
      if (this.showmodel) {
        this.showmodel = false;
      } else {
        this.showmodel = true;
      }
    }
  }
};
</script>

<style scoped>
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


