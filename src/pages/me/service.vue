<template>
  <div class="bgc">
    <div class="bgc">
      <div class="nav bgc border-b flex-jc-around">
        <div
          :class="{ 'selected': typenum==index }"
          @click="clickType(index)"
          v-for="(item,index) in titlelist"
        >{{item.title}}</div>
      </div>
    </div>

    <div class="mar-b-10">
      <div class="merch-box pd-15" v-for="(item,index) in servelist">
        <div class="merchlist flex-jc-between flex-align-items pd-lr-15">
          <div>
            <div class="fz15">办卡会员: {{item.username}}</div>
            <div class="fsz12">申请时间：{{item.submit_time}}</div>
          </div>
          <div class="detail" @click="toserDetail(item.id)" v-show="item.order_status==1">
            <span class="border-fen">查看详情</span>
          </div>
          <div class="detail" @click="toserDetail(item.id)" v-show="item.order_status==2">
            <span class="border-fen">查看详情</span>
          </div>
          <div v-show="item.order_status==5" @click="toserDetail(item.id)">
            <img class="img_fuwu" src="../../assets/photo/yifuwu.png">
          </div>
          <div v-show="item.order_status==4" @click="toserDetail(item.id)">
            <img class="img_fuwu" src="../../assets/photo/yifuwu.png">
          </div>
          <div v-show="item.order_status==6" @click="toserDetail(item.id)">
            <img class="img_fuwu" src="../../assets/photo/yifuwu.png">
          </div>
          <div class="detail" @click="toserDetail(item.id)" v-show="item.order_status==3">
            <span class="border-fen">查看详情</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="servelist.length==0" class="text-c">暂无订单数据</div>
    <div style="height:40px"></div>
    <!-- <div class="flex-center border" @click="onshowmodel">取消订单</div> -->
    <van-popup v-model="showmodel" position="bottom" :close-on-click-overlay="false">
      <div class="text-c position title">
        取消订单
        <div class="closeicon">
          <van-icon name="close" @click="onshowmodel"/>
        </div>
      </div>
      <div class="pd-lr-15">
        <div style="padding:20px 0">请选择取消订单的原因,帮助我们改进(必选):</div>
        <van-radio-group v-model="radio">
          <div
            class="flex-jc-between mar-b-10"
            @click="radio = index"
            v-for="(item,index) in canceltext"
            :key="index"
          >
            <span>{{index+1}}、{{item.text}}</span>
            <van-radio :name="index" checked-color="#2DBBF1"></van-radio>
          </div>
        </van-radio-group>
      </div>
      <div class="pd-15">
        <div class="btn text-c">提交</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";

export default {
  data() {
    return {
      typenum: 0,
      servelist: [],
      radio: 0,
      type: "",
      titlelist: [
        { title: "待接单" },
        { title: "待服务" },
        { title: "已服务" },
        { title: "未服务" }
      ],
      canceltext: [
        { id: 1, text: "我不想租了" },
        { id: 2, text: "收货地址写错了" },
        { id: 3, text: "重新下单" },
        { id: 4, text: "测试下单/误下单" },
        { id: 5, text: "其他" }
      ],
      showmodel: false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.type = this.typenum + 1;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/serve/my", {
          params: {
            type: this.type
          }
        })
        .then(res => {
          console.log(res.data, "serve");
          let resdata = res.data;

          if (resdata.code == 200) {
            this.servelist = resdata.data;
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
    clickType(index) {
      this.typenum = index;
      Toast.loading({ mask: true, message: "加载中..." });
      console.log(this.typenum);
      this.axios
        .get(this.API + "/api/v1/serve/my", {
          params: {
            type: this.typenum + 1
          }
        })
        .then(res => {
          console.log(res.data, "serve");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.servelist = resdata.data;
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

    // 服务详情

    toserDetail(id) {
      this.$router.push({
        path: "/serviceDetail",
        query: {
          id: id
        }
      });
    }
  }
};
</script>


<style scoped>
.nav {
  padding: 15px 10px;
  color: #000;
}

.nav > div {
  width: 70px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  box-shadow: 0 1px 7px 1px #e8e9ea;
  border-radius: 5px;
  text-align: center;
  box-sizing: border-box;
  margin-right: 3px;
}

.nav .selected {
  color: #fff;
  background: linear-gradient(90deg, #fe4171, #ff5491);
}

.fz15 {
  font-size: 15px;
}

.fsz12 {
  font-size: 12px;
}

.fsz10 {
  font-size: 10px;
}

.merchlist {
  height: 80px;
  box-shadow: 2px 3px 8px 1px rgba(222, 220, 220, 0.5);
  border-radius: 10px;
  line-height: 30px;
}

/* .merchlist:last-child {
      border: none;
    } */

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
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
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