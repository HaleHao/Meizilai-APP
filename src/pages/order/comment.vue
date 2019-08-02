<template>
  <div>
    <div class="goods bgc mar-b-10 box-sizing flexbox">
      <img class="img_pro" :src="goods_img">
      <div class="flex-1 pd-10">
        <div style="font-weight: bold;" class="mar-b-10">{{goods_name}}</div>
        <div class="fc-grey">{{goods_num}}件</div>
      </div>
    </div>

    <div class="border-b text-c bgc ratebox flex-align-items">
      <span class="pigfen">评分</span>
      <van-rate v-model="rateval" @change="onRating" :size="size"/>
      <span class="fc-fen" v-if="rateval>3">好评</span>
      <span class="fc-fen" v-else-if="rateval<2">不好</span>
      <span class="fc-fen" v-else>一般</span>
    </div>

    <div class="textarea bgc">
      <textarea rows="6" v-model.trim="contentval" placeholder="您的每一句悉心评论对其他小伙伴都是很重要的参考哦!"></textarea>
    </div>
    <div class="bgc imglist">
      <!-- <van-icon name="close" @click="delImg(index)" class="delte"/> -->
      <img
        @click="onImagePreview(index)"
        :src="item.content"
        v-for="(item,index) in imgarr"
        :key="index"
      >
      <!-- accept="image/png, image/jpeg" -->
      <van-uploader :after-read="onRead" :accept="'image/*'" multiple v-show="showupload">
        <img src="../../assets/photo/uplode.png">
      </van-uploader>
    </div>
    <div class="pd-15">
      <div class="btn text-c" @click="submit">提交</div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      rateval: 5,
      size: 30,
      contentval: "",
      goods_img: "",
      goods_name: "",
      goods_num: "",
      goods_id: "",
      order_id: "",
      imgarr: [],
      data: "",
      showupload: true
    };
  },
  watch: {
    imgarr() {
      console.log(this.imgarr.length);

      if (this.imgarr.length > 2) {
        this.showupload = false;
      }
    }
  },
  created() {
    console.log(this.$route.query.good);
    if (this.$route.query.good) {
      let good = this.$route.query.good;
      this.goods_id = good.goods_id;
      this.order_id = good.order_id;
      this.goods_img = good.goods_img;
      this.goods_name = good.goods_name;
      this.goods_num = good.goods_num;
    }
    console.log(this.$route.query.goods);

    if (this.$route.query.goods) {
      let good = this.$route.query.goods;
      this.goods_id = good.id;
      this.goods_img = good.images[0].img_url;
      this.goods_name = good.name;
      this.goods_num = 1;
    }
  },
  methods: {
    getdata() {},
    //评星
    onRating(e) {
      console.log(e);
      this.rateval = e;
    },
    //上传图片
    onRead(file) {
      console.log(file);
      this.imgarr.push(file);
    },

    // 删除图片
    delImg() {},
    //预览图片
    onImagePreview(index) {
      let arr = [];
      for (let v of this.imgarr) {
        arr.push(v.content);
      }
      ImagePreview({
        images: arr,
        startPosition: index
      });
    },
    submit() {
      console.log(this.order_id);
      if (this.contentval == "") {
        Toast("请先填写内容");
        return;
      }

      if (this.order_id) {
        // 订单产品评价
        Toast.loading({ mask: true, message: "加载中..." });
        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };
        console.log(this.imgarr);

        let formData = new FormData();
        for (let v of this.imgarr) {
          formData.append("images[]", v.file); //多图上传
        }

        formData.append("order_id", this.order_id);
        formData.append("goods_id", this.goods_id);
        formData.append("content", this.contentval);
        formData.append("star", this.rateval);

        this.axios
          .post(this.API + "/api/v1/order/comment", formData, config)
          .then(res => {
            console.log(res.data, "order/comment");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              Dialog.alert({
                message: "操作成功"
              }).then(e => {
                this.$router.go(-2);
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
      } else {
        // 后台设置不出售产品评价
        Toast.loading({ mask: true, message: "加载中..." });
        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };
        console.log(this.imgarr);

        let formData = new FormData();
        for (let v of this.imgarr) {
          formData.append("images[]", v.file); //多图上传
        }

        formData.append("goods_id", this.goods_id);
        formData.append("content", this.contentval);
        formData.append("star", this.rateval);
        this.axios
          .post(this.API + "/api/v1/goods/comment", formData, config)
          .then(res => {
            console.log(res.data, "goods/comment");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              Dialog.alert({
                message: "操作成功"
              }).then(e => {
                this.$router.go(-1);
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
  }
};
</script>
<style>
.ratebox .van-rate__item {
  padding: 0 5px;
}
</style>

<style scoped>
.pd-10 {
  padding: 10px 0;
}
.goods {
  padding: 10px;
}
.goods img {
  width: 90px;
  height: 90px;
}
.img_pro {
  width: 60px;
  height: 70px;
  margin-right: 10px;
  border-radius: 5px;
}

.ratebox {
  padding: 10px 15px;
  justify-content: space-between;
}
.pigfen {
  font-size: 17px;
  font-weight: bold;
  margin-right: 10px;
}
.textarea {
  padding: 10px;
}
.textarea textarea {
  width: 100%;
}
.imglist {
  padding: 10px 0;
}
.imglist img {
  width: 92px;
  height: 92px;
  padding-left: 10px;
  padding-bottom: 10px;
}
.btn {
  margin-top: 76px;
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #fe4171, #fe4171 100%);
}

.closeicon {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 20px;
}
</style>
