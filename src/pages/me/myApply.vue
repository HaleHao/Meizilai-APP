<template>
  <div>
    <div class="pd-15">请选择</div>
    <div class="nav flex-jc-around bgc">
      <div :class="{ 'selected': typenum==0 }" @click="typenum=0">创业门槛</div>
      <div :class="{ 'selected': typenum==1 }" @click="typenum=1">魅资莱会员</div>
      <!-- <div :class="{ 'selected': typenum==2 }" @click="typenum=2">魅资莱店主</div> -->
    </div>
    <div class="bgc" v-show="typenum==0">
      <div class="pd-lr-15">
        <div>产品价格</div>
        <van-radio-group v-model="radio" @change="checkedName" class="pd-tb-15">
          <div
            class="flex-jc-between mar-b-10"
            @click="radio = index"
            v-for="(item,index) in canceltext"
            :key="index"
          >
            <div class="flex-jc-between" style="width:305px">
              <div class="newline">{{index+1}}、{{item.name}}</div>
              <div>
                <span class="n_price fc-fen">¥ {{item.mall_price}}</span>
              </div>
            </div>

            <van-radio :name="index" checked-color="#FE4171"></van-radio>
          </div>
        </van-radio-group>
      </div>
    </div>
    <div class="btn" @click="toUpgrade">下一步</div>
  </div>
</template>

<script>
import { Toast } from "vant";

export default {
  data() {
    return {
      typenum: 0,
      radio: -1,
      goods_id: "",
      isdianzan: false,
      canceltext: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/product/list")
        .then(res => {
          console.log(res.data, "product/list");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast(resdata.msg);
            this.canceltext = resdata.data;
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
    },

    checkedName(res) {
      console.log(res);
      this.goods_id = this.canceltext[res].id;
    },

    // 下一步
    toUpgrade() {
      if (this.typenum == 0) {
        if (this.goods_id) {
          let param = new URLSearchParams();
          param.append("goods_id", this.goods_id);
          param.append("num", "1");

          Toast.loading({ mask: true, message: "加载中..." });

          this.axios
            .post(this.API + "/api/v1/goods/next", param)
            .then(res => {
              console.log(res.data, "next");
              let resdata = res.data;
              if (resdata.code == 200) {
                this.$router.push({
                  path: "/ConfirmationOrder"
                });
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
        } else {
          Toast("请选择产品");
        }
      } else {
        this.$router.push({ path: "/menberCard" });
      }
    }
  }
};
</script>
<style scoped>
.nav {
  padding: 30px 10px;
}
.nav > div {
  width: 90px;
  height: 120px;
  line-height: 120px;
  display: inline-block;
  text-align: center;
  border-radius: 10px;
  box-sizing: border-box;
  margin-right: 3px;
  color: #7f7f7f;
  box-shadow: 2px 3px 8px 1px rgba(222, 220, 220, 0.5);
}
.nav .selected {
  color: #fff;
  background-image: linear-gradient(to bottom, #ff5491, #fe4171);
}

.btn {
  margin: 30px 15px;
  padding: 10px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  border-radius: 20px;
  background-image: linear-gradient(90deg, #ff5491, #fe4171 100%);
}

.title {
  font-size: 16px;
  padding-top: 15px;
}

.n_price {
  font-size: 14px;
  padding-left: 10px;
}

.o_price {
  font-size: 12px;
  margin-left: 10px;
}
</style>


