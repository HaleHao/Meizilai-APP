<template>
  <div>
    <div class="bgc">
      <div class="nav bgc border-b flex-jc-between">
        <div class="flexbox">
          <div class="fs15">评分</div>
          <div @click="commenttype1">
            <img v-if="commenttype==1" class="img_haoping" src="../../assets/photo/haoping.png">
            <img v-else class="img_haoping" src="../../assets/photo/haopinghui.png">
          </div>
          <div @click="commenttype2">
            <img v-if="commenttype==2" class="img_haoping" src="../../assets/photo/yiban.png">
            <img v-else class="img_haoping" src="../../assets/photo/yibanhui.png">
          </div>
          <div @click="commenttype3">
            <img v-if="commenttype==3" class="img_haoping" src="../../assets/photo/chaping.png">
            <img v-else class="img_haoping" src="../../assets/photo/chapinghui.png">
          </div>
        </div>
        <div class="fc-fen">
          <div v-show="commenttype==1">满意</div>
          <div v-show="commenttype==2">一般</div>
          <div v-show="commenttype==3">差评</div>
        </div>
      </div>
    </div>
    <div class="textarea bgc">
      <textarea rows="6" v-model.trim="contentval" placeholder="您的每一句悉心评论对其他小伙伴都是很重要的参考哦!"></textarea>
    </div>
    <div class="bgc imglist">
      <img
        @click="onImagePreview(index)"
        :src="item.content"
        v-for="(item,index) in imgarr"
        :key="index"
      >
      <van-uploader :after-read="onRead" :accept="'image/*'" multiple v-show="showupload">
        <img src="../../assets/photo/uplode.png">
      </van-uploader>
    </div>

    <div class="btn text-c" @click="submit">发表评论</div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      contentval: "",
      imgarr: [],
      commenttype: 1,
      showupload: true
    };
  },
  watch: {
    imgarr() {
      if (this.imgarr.length == 3) {
        this.showupload = false;
      }
    }
  },
  created() {},
  methods: {
    commenttype1() {
      this.commenttype = 1;
    },
    commenttype2() {
      this.commenttype = 2;
    },
    commenttype3() {
      this.commenttype = 3;
    },
    //图片
    onRead(file) {
      console.log(file);
      this.imgarr.push(file);
      console.log(this.imgarr);
    },
    //预览
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
      console.log(this.imgarr);
      if (this.contentval == "") {
        Toast("请先填写内容");
        return;
      }
      console.log(this.commenttype, "this.commenttype");

      Toast.loading({ mask: true, message: "加载中..." });
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };

      let formData = new FormData();

      for (let v of this.imgarr) {
        formData.append("images[]", v.file); //多图上传
      }

      formData.append("order_id", this.$route.query.id);
      formData.append("content", this.contentval);
      formData.append("grade", this.commenttype);

      this.axios
        .post(this.API + "/api/v1/serve/comment", formData, config)
        .then(res => {
          console.log(res.data, "submit");
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
    }
  }
};
</script>


<style scoped>
.fs15 {
  font-size: 17px;
}
.nav {
  padding: 15px 10px;
}
.nav > div {
  /* width: 68px; */
  height: 25px;
  line-height: 25px;
  margin-right: 3px;
}

.img_haoping {
  width: 25px;
  height: 25px;
  margin-left: 22px;
}
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
  position: fixed;
  bottom: 20px;
  left: 15px;
  width: 90%;
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #fe4171, #fe4171);
}
</style>
