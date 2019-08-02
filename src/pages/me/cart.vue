<template>
  <div>
    <van-checkbox-group v-model="result" @change="selectedProduct">
      <div v-for="(item,index) in list" :key="index" class="list_box" @click="toggle(index)">
        <div class="card bgc flex-align-items">
          <van-checkbox :name="item.cart_id" checked-color="#FE4375" ref="checkboxes"></van-checkbox>

          <div class="flex-align-items list_r_box" @click.stop="toDetail(item.goods_id)">
            <img :src="item.cover_url" class="bgc-grey goodsimg">
            <div class="flex-1 right">
              <div class="newline" style=" padding:7px 0">{{item.goods_name}}</div>
              <div class="fc-grey fsz12 mar-b-10">{{item.num}}件</div>
              <div class="flex-jc-between flex-align-items">
                <span class="fc-fen">￥{{item.price}}</span>
                <div class="flex-align-items">
                  <span @click.stop="handle(index)">
                    <img src="../../assets/photo/cut.png" class="img-cut">
                  </span>
                  <span class="fsz15">{{item.num}}</span>
                  <span @click.stop="add(index)">
                    <img src="../../assets/photo/add.png" class="img-add">
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-checkbox-group>

    <div class="height"></div>
    <div class="cart-bottom bgc border-t">
      <div class="check-box" @click="onall">
        <van-checkbox checked-color="#FF508B" v-model="isall" ref="allselect"></van-checkbox>
        <span class="fc-grey">全选</span>
      </div>
      <div class="fc-fen all-price">总计：￥{{totalMoney}}</div>
      <div class="edit flex-center" @click.stop="edit">
        <span v-if="showModel">编辑</span>
        <span v-else>完成</span>
      </div>
      <div class="count flex-center">
        <span v-if="showModel" @click.stop="gohosting">结算</span>
        <span v-else @click.stop="remove">删除</span>
        <!-- <span v-show="result.length!=0">({{result.length}})</span> -->
      </div>
    </div>

    <van-dialog v-model="show" show-cancel-button :before-close="beforeClose">
      <div class="flex-center pd-15 fsz15">提示</div>
      <div class="fc-grey flex-center" style="padding-bottom:15px">确认删除此内容?</div>
    </van-dialog>
  </div>
</template>

<script>
import { accAdd, accMul } from "@/utils/util.js";
import { Dialog, Toast } from "vant";
export default {
  data() {
    return {
      list: [],
      data: [],
      result: [],
      isall: false,
      showModel: true,
      show: false,
      totalMoney: 0,
      cart_ids: [],
      ps: 0
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/cart/list")
        .then(res => {
          console.log(res.data, "cart");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.list = resdata.data;
            console.log(this.data);

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
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    // 加商品数量
    add(index) {
      this.list[index].num++;
      console.log(this.list[index].cart_id);

      let cart_id = this.list[index].cart_id;
      let num = this.list[index].num;

      Toast.loading({ mask: true, message: "加载中..." });

      let param = new URLSearchParams();
      param.append("cart_id", cart_id);
      param.append("num", num);
      this.axios
        .post(this.API + "/api/v1/cart/update", param)
        .then(res => {
          console.log(res.data, "cart/update");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.getData();
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

      this.calcTotalPrice();
    },
    //减商品数量
    handle(index) {
      if (this.list[index].num == 1) {
        Toast("不能再减了");
      } else {
        this.list[index].num--;

        let cart_id = this.list[index].cart_id;
        let num = this.list[index].num;

        Toast.loading({ mask: true, message: "加载中..." });

        let param = new URLSearchParams();
        param.append("cart_id", cart_id);
        param.append("num", num);
        this.axios
          .post(this.API + "/api/v1/cart/update", param)
          .then(res => {
            console.log(res.data, "cart/update");

            let resdata = res.data;
            if (resdata.code == 200) {
              this.getData();
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
        this.calcTotalPrice();
      }
    },
    // 删除
    remove() {
      if (this.result == 0) {
        Toast("请选择要删除的商品");
        return;
      }
      this.show = true;
    },
    beforeClose(action, done) {
      if (action === "confirm") {
        let cart_ids = JSON.stringify(this.cart_ids);
        Toast.loading({ mask: true, message: "加载中..." });

        let param = new URLSearchParams();
        param.append("cart_ids", cart_ids);
        this.axios
          .post(this.API + "/api/v1/cart/del", param)
          .then(res => {
            console.log(res.data, "cart/del");

            let resdata = res.data;
            if (resdata.code == 200) {
              this.getData();
              this.isall = false;
              this.totalMoney = 0;
              // this.calcTotalPrice();
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

        setTimeout(done, 500);
      } else {
        done();
      }
    },
    edit() {
      this.showModel = !this.showModel;
    },
    //全选
    onall() {
      this.$refs.allselect.toggle();
      console.log(this.isall, "this.isall");
      let list = this.list;
      // console.log(list);
      if (this.isall) {
        let resarr = [];
        for (let v of list) {
          resarr.push(v.cart_id);
        }
        this.result = resarr;
      } else {
        this.result = [];
      }
    },

    //多选
    selectedProduct(res) {
      console.log(res);
      this.cart_ids = res;
      let list = this.list;

      //判断全选状态
      if (res.length == list.length) {
        this.isall = true;
      } else {
        this.isall = false;
      }

      this.calcTotalPrice();
    },
    //计算
    calcTotalPrice() {
      let list = this.list;
      let result = this.result;
      let totalMoney = 0;
      let num = 0;
      let ps = 0;
      for (let v of list) {
        for (let v2 of result) {
          if (v.cart_id == v2) {
            // totalMoney = accAdd(v.price, totalMoney);
            console.log(v.num);
            ps += accMul(v.price, v.num);
            // console.log(ps + "psps");
          }
        }
      }
      this.totalMoney = ps;
    },
    //产品详情
    toDetail(id) {
      console.log(id);

      this.$router.push({
        path: "/ProductDetail",
        query: {
          id: id
        }
      });
    },
    // 结算
    gohosting() {
      if (this.result.length == 0) {
        Toast("请选择商品");
      } else {
        let cart_ids = JSON.stringify(this.cart_ids);
        Toast.loading({ mask: true, message: "加载中..." });

        let param = new URLSearchParams();
        param.append("cart_ids", cart_ids);
        this.axios
          .post(this.API + "/api/v1/cart/next", param)
          .then(res => {
            console.log(res.data, "cart/next");

            let resdata = res.data;
            if (resdata.code == 200) {
              this.$router.push({ path: "/confirmationOrder" });
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
      }
    }
  }
};
</script>


<style scoped>
.list_box {
  /* margin: 10px 15px; */
  overflow: hidden;
  border-radius: 5px;
}

.list_r_box {
  width: 90%;
}
.fsz12 {
  font-size: 12px;
}
.fsz15 {
  font-size: 15px;
}
.height {
  height: 50px;
}

.card {
  padding: 10px;
  width: 100%;
}
.card .goodsimg {
  width: 80px;
  height: 82px;
  border-radius: 5px;
  margin-right: 10px;
  margin-left: 10px;
}

.img-cut,
.img-add {
  width: 16px;
  height: 25px;
  padding: 0 10px;
}

.del {
  background-color: #d2d2d2;
  color: #fff;
  width: 60px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-bottom {
  width: 100%;
  height: 50px;
  line-height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  /* align-items: center; */
}
.check-box >>> .van-checkbox {
  z-index: -1;
}
.cart-bottom .check-box {
  display: flex;
  align-items: center;
  height: 50px;
  line-height: 50px;
  padding-left: 15px;
  /* padding-right: 30px; */
  /* position: relative; */
}
.cart-bottom .check-box > span {
  margin: 10px;
  /* margin-left: 50px;
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2; */
}
.cart-bottom .edit {
  background-image: linear-gradient(90deg, #77a7ff, #2f78ff);
  width: 70px;
  color: #fff;
  height: 100%;
  position: absolute;
  right: 70px;
}
.cart-bottom .count {
  background-image: linear-gradient(90deg, #ff5491, #fe4171 100%);
  width: 70px;
  color: #fff;
  height: 100%;
  position: absolute;
  right: 0;
}
</style>
