<template>
  <div class="bgc">
    <div class="pd-15">
      <van-radio-group v-model="radio" @change="onchoose">
        <div v-for="(item,index) in list" :key="index" class="card bgc mar-b-10">
          <van-swipe-cell :right-width="65" :on-close="onClose">
            <div class="bgc flex-align-items item">
              <van-radio :name="item.id" checked-color="#ff5491"></van-radio>
              <div class="flex-1 left" @click="radio=item.id">
                <div style="margin-bottom:5px">{{item.consignee}} {{item.mobile}}</div>
                <div class="newline" style="line-height:20px">
                  <span class="moren border-fen fc-fen" v-if="item.is_default==1">默认</span>
                  <span>{{item.province+item.city+item.district+item.address}}</span>
                </div>
              </div>

              <img class="img_editor" src="../../assets/photo/editor.png" @click="edit(item.id)">
            </div>
            <div slot="right" class="del" @click="del(item.id)">删除</div>
          </van-swipe-cell>
        </div>
      </van-radio-group>
      <div v-if="list.length==0" class="text-c">暂无配送地址</div>
      <div class="add">
        <router-link to="/addInformation">
          <div class="btn text-c">新增地址</div>
        </router-link>
      </div>
      <div class="height" v-show="list.length>7"></div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
export default {
  data() {
    return {
      list: [],
      radio: "",
      delid: "",
      checked: false,
      store: [],
      delid: ""
    };
  },
  created() {
    this.selectPost();
  },
  methods: {
    selectPost() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/address/list")
        .then(res => {
          console.log(res.data, "address/list");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.list = resdata.data;
            console.log(resdata.data, "resdata.data");

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
    // 删除
    onClose(clickPosition, instance) {
      switch (clickPosition) {
        case "left":
        case "cell":
        case "outside":
          instance.close();
          break;
        case "right":
          Dialog.confirm({
            message: "确定删除吗？"
          })
            .then(e => {
              if (e == "confirm") {
                let param = new URLSearchParams();
                param.append("address_id", this.delid);
                Toast.loading({ mask: true, message: "加载中..." });
                this.axios
                  .post(this.API + "/api/v1/address/del", param)
                  .then(res => {
                    console.log(res.data, "address");
                    let resdata = res.data;
                    if (resdata.code == 200) {
                      Toast.clear();
                      Toast(resdata.message);
                      this.selectPost();
                    } else if (resdata.code == 40005 || resdata.code == 20001) {
                      window.localStorage.removeItem("access_token");
                      this.$router.push({
                        path: "/wechatAuth",
                        query: {
                          store_id: JSON.parse(
                            window.localStorage.getItem("store_id")
                          ),
                          first_user_id: JSON.parse(
                            window.localStorage.getItem("first_user_id")
                          )
                        }
                      });
                    } else {
                      Toast.clear();
                      Toast(resdata.message);
                    }
                  });
              }
            })
            .catch(error => {
              Toast.clear();
              Toast("网络出错");
            });
          break;
      }
    },
    edit(id) {
      this.$router.push({
        path: "/addInformation",
        query: {
          id: id
        }
      });
    },
    del(id) {
      console.log(id);
      this.delid = id;
    },
    onchoose(val) {
      console.log(val);
      let param = new URLSearchParams();
      param.append("address_id", val);
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .post(this.API + "/api/v1/address/default", param)
        .then(res => {
          console.log(res.data, "default");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.selectPost();
            this.$router.push({
              path: "/confirmationOrder"
            });
            Toast.clear();
          } else if (resdata.code == 40005 || resdata.code == 20001) {
            window.localStorage.removeItem("access_token");
            this.$router.push({
              path: "/wechatAuth",
              query: {
                store_id: JSON.parse(window.localStorage.getItem("store_id")),
                first_user_id: JSON.parse(
                  window.localStorage.getItem("first_user_id")
                )
              }
            });
          } else {
            Toast.clear();
            Toast(resdata.message);
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
    }
  }
};
</script>


<style scoped>
.nav {
  padding: 10px 60px;
  background: #f6f6f6;
}
.nav > div {
  height: 30px;
  line-height: 30px;

  display: inline-block;
  text-align: center;
  box-sizing: border-box;
  margin-right: 3px;
}
.nav .selected {
  color: #fe4171;
  border-bottom: 3px solid #ff5491;
}

.height {
  height: 85px;
}
.add {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 15px;
  background: #fff;
  box-sizing: border-box;
}
.btn {
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #ff5491, #fe4171);
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

.card {
  box-shadow: 2px 3px 8px 1px rgba(222, 220, 220, 0.5);
  border-radius: 8px;
  overflow: hidden;
}
.card .item {
  padding: 10px;
}
.card .left {
  padding: 0 10px;
}
.moren {
  padding: 0 5px;
  font-size: 12px;
  border-radius: 5px;
}
.img_editor {
  width: 20px;
  height: 20px;
}

.img_location {
  width: 12px;
  height: 16px;
  margin-right: 5px;
}
</style>
