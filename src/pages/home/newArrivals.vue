<template>
  <div>
    <div class="bgc">
      <div class="title flex-align-items">新项目</div>
      <div class="pic">
        <ul id="category-head">
          <li v-for="(item,index) in serve">
            <div class="img_service">
              <img :src="item.cover_url">
            </div>
            <div class="text-line ser_title">{{item.name}}</div>
            <div class="n_price fc-fen">¥{{item.price}}/次</div>
          </li>
        </ul>
      </div>

      <div class="title flex-align-items">新产品</div>
      <div class="product" v-for="(item,index) in goods" @click="toDetail(item.id)">
        <div class="img_pro">
          <img :src="item.cover_url">
        </div>
        <div class="pro_title newline">{{item.name}}</div>

        <div class="pro_price">
          <span class="n_price fc-fen">¥{{item.mall_price}}</span>
          <del class="o_price fc-grey">¥{{item.market_price}}</del>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      serve: [],
      goods: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //产品详情
    toDetail(id) {
      this.$router.push({
        path: "/ProductDetail/",
        query: {
          id: id
        }
      });
    },
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/new/products", {
          params: {
            store_id: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res.data, "products");

          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
            this.serve = resdata.data.serve;
            this.goods = resdata.data.goods;
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
    }
  }
};
</script>

<style scoped>
.pic {
  margin-left: 10px;
}
#category-head {
  width: 100%;
  white-space: nowrap;
  overflow-x: scroll;
  float: left;
  overflow-y: hidden;
}
#category-head li {
  display: inline-block;
}

.img_service {
  width: 170px;
  height: 100px;
  margin-right: 10px;
  border-radius: 5px;
}
.img_service img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.ser_title {
  width: 173px;
  height: 30px;
  line-height: 30px;
}
.title {
  font-size: 17px;
  font-weight: 600;
  padding: 10px;
  height: 30px;
  line-height: 30px;
}
.product {
  display: inline-block;
  width: 143px;
  height: 259px;
  border-radius: 10px;
  box-shadow: 0px 3px 7px 0px rgba(238, 238, 238, 1);
  margin: 0 0 10px 10px;
}

.img_pro {
  width: 143px;
  height: 160px;
}
.img_pro img {
  width: 100%;
  height: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.pro_title {
  width: 122px;
  height: 35px;
  margin: 10px 0 10px 10px;
}

.pro_price {
  width: 122px;
  height: 20px;
  line-height: 20px;
  margin-left: 10px;
}

.n_price {
  font-size: 15px;
}
.o_price {
  font-size: 12px;
  margin-left: 10px;
}
</style>
