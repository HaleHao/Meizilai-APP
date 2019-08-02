<template>
  <div>
    <div class="select_container">
      <!--左侧-->
      <div class="left">
        <div class="left_item">
          <div
            v-for="(item,index) in data"
            @click="selectPro(index,item.id)"
            :class="{ 'pro_active': index==activeTitle}"
          >{{item.title}}</div>
        </div>
        <div style="height: 50px;" v-show="data.length>12"></div>
      </div>

      <!--右侧-->

      <div class="right bgc">
        <ul>
          <li v-show="goodslist.length==0" class="pd-15">暂无此类产品</li>

          <li v-for="(item,index) in goodslist" @click="toDetail(item.id)">
            <div class="item">
              <div>
                <img class="item-img" :src="item.cover_url">
              </div>
              <div class="item-right flex-column-space-between">
                <div class="title newline">{{item.name}}</div>
                <div class="flex-jc-between">
                  <div class="pro_price">
                    <span class="n_price fc-fen">¥{{item.mall_price}}</span>
                    <del class="o_price fc-grey">¥{{item.market_price}}</del>
                  </div>
                  <div class="add_btn">+</div>
                </div>
              </div>
            </div>
          </li>
          <div style="height: 50px;" v-show="goodslist.length>4"></div>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      activeTitle: 0,
      data: [],
      goodslist: [],
      category_id: ""
    };
  },
  created() {
    this.getcategory();
  },
  methods: {
    selectPro(index, id) {
      console.log(id);
      this.activeTitle = index;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/goods/list", {
          params: {
            category_id: id
          }
        })
        .then(res => {
          console.log(res.data, "goods/list");
          let resdata = res.data;
          if (resdata.code == 200) {
            console.log(resdata.data.length);

            if (resdata.data.length == 0) {
              this.goodslist = [];
            } else {
              this.goodslist = resdata.data;
            }

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
            Toast(resdata.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
    },
    // 获取左边商品分类
    getcategory() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios.get(this.API + "/api/v1/goods/category").then(res => {
        console.log(res.data, "goods/category");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.data = resdata.data;

          Toast.loading({ mask: true, message: "加载中..." });

          this.axios
            .get(this.API + "/api/v1/goods/list", {
              params: {
                category_id: resdata.data[0].id
              }
            })
            .then(res => {
              console.log(res.data, "goods/list");
              let resdata = res.data;
              if (resdata.code == 200) {
                this.goodslist = resdata.data;
                Toast.clear();
              } else {
                Toast.clear();
                Toast(resdata.msg);
              }
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
          Toast(resdata.msg);
        }
      });
    },

    //产品详情
    toDetail(id) {
      this.$router.push({
        path: "/ProductDetail",
        query: {
          id: id
        }
      });
    }
  }
};
</script>

<style  scoped>
/* 大盒子 */
.select_container {
  height: 100vh;
  overflow: hidden;
  background: #fff;
  display: flex;
  position: relative;
}

/* 左侧 */
.left {
  width: 70px;
  height: 100vh;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
}

.left_item {
  width: 70px;
  height: 100%;
  list-style: none;
  overflow-x: hidden;
  overflow-y: scroll;
  background: #eee;
}

.left_item > div {
  padding: 15px 5px;
  text-align: center;
  word-break: break-all;
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
}

/* 左侧选中 */
.pro_active {
  background: #fff;
  color: #fc4f88;
  border-left: 3px solid #fc4f88;
  font-weight: 700px;
}

/* 右侧 */

.right {
  width: 250px;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 70px;
}
.right ul {
  width: 250px;
  height: 100%;
  list-style: none;
  overflow-x: hidden;
  overflow-y: scroll;
}
.class-title {
  padding: 7px 10px;
  background: #eee;
}
.item {
  display: flex;
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.item-right {
  padding: 0 10px;
}
.item-img {
  width: 80px;
  height: 80px;
  background: #f6f6f6;
}
.title {
  width: 130px;
}

.pro_price {
  height: 20px;
  line-height: 20px;
}

.o_price {
  font-size: 12px;
  margin-right: 5px;
}
.add_btn {
  width: 21px;
  height: 21px;
  line-height: 21px;
  border-radius: 50%;
  color: #fff;
  background: #ff5491;
  text-align: center;
  font-size: 22px;
}
</style>
