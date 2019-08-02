<template>
  <div class="bgc">
    <div class="pd-15">
      <van-radio-group v-model="radio" @change="onchoose">
        <div v-for="(item,index) in 7" :key="index" class="card bgc mar-b-10">
          <van-swipe-cell :right-width="65" :on-close="onClose">
            <div class="bgc flex-align-items item">
              <van-radio :name="index" checked-color="#ff5491"></van-radio>
              <div class="flex-1 left" @click="radio=index">
                <div style="margin-bottom:5px">小明 13541414141</div>
                <div class="newline" style="width:250px">
                  <span class="moren border-fen fc-fen" v-if="is_default==1">默认</span>
                  <span>{{item.province+item.city+item.district+item.address}}1111111111111111111111</span>
                </div>
              </div>

              <img class="img_editor" src="../../assets/photo/editor.png" @click="edit(item.id)">
            </div>
            <div slot="right" class="del">删除</div>
          </van-swipe-cell>
        </div>
      </van-radio-group>

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
      typenum: 0,
      list: [{}, {}, {}, {}, {}, {}],
      radio: -1,
      delid: "",
      checked: false,
      store: [],
      is_default: 1
    };
  },
  created() {
    this.selectSore();
  },
  methods: {
    selectSore() {
      this.typenum = 0;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/address/store")
        .then(res => {
          console.log(res.data, "address/store");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.store = resdata.data[0];

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
    selectPost() {
      this.typenum = 1;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/address/list")
        .then(res => {
          console.log(res.data, "address/list");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.list = resdata.data;

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
          }).then(e => {
            if (e == "confirm") {
            }
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
    onchoose(val) {
      console.log(val);
    },
    checkedStore(val) {
      console.log(val);
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
