<template>
  <div>
    <div class="bgc">
      <div class="border-b">
        <div class="flex-align-items xx_comment pd-lr-15">
          <span>评分</span>
          <span class="wuxing">
            <van-rate v-model="data.star_total" disabled disabled-color="#FFB10E"/>
          </span>
          <span>{{data.grade_total}}%</span>
        </div>

        <div class="bgc mar-b-10">
          <div class="nav bgc">
            <div
              :class="{ 'selected': comment_type==0 }"
              @click="allComment"
            >全部({{data.comment_total}})</div>
            <div :class="{ 'selected': comment_type==1 }" @click="goodnum">好评({{data.good_num}})</div>
            <div :class="{ 'selected': comment_type==2 }" @click="comnum">一般({{data.com_num}})</div>
            <div :class="{ 'selected': comment_type==3 }" @click="badnum">不好({{data.bad_num}})</div>
          </div>
        </div>
      </div>
      <div class="word_mouth_box">
        <div class="word_mouth">
          <div v-for="(item,index ) in comment" :key="index">
            <div class="flex-align-items head_name">
              <img class="head_img" :src="item.user.avatar">
              <span>{{item.user.nickname}}</span>
            </div>
            <div>
              <span class="grey_12">{{item.comment_time}}</span>
            </div>
            <div class="com_det">{{item.content}}</div>
            <div class="imglist_b">
              <div class="imglist" v-for="(items,ind) in item.images" :key="ind">
                <img class="itemimg" :src="items">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-c fc-grey pd-15" v-show="comment.length==0">没有更多了</div>
  </div>
</template>
<script>
import { Toast } from "vant";

export default {
  data() {
    return {
      imglist: [
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201306/2013062320262198.jpg",
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201306/2013062320262198.jpg",
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201306/2013062320262198.jpg",
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201306/2013062320262198.jpg",
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201306/2013062320262198.jpg"
      ],
      comment: [],
      value: "",
      comment_type: 0,
      grade_total: "",
      comment_total: "",
      data: []
    };
  },
  created() {
    this.allComment();
  },
  methods: {
    allComment() {
      this.comment_type = 0;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/beautician/comment/list", {
          params: {
            beautician_id: this.$route.query.id,
            comment_type: this.comment_type
          }
        })
        .then(res => {
          console.log(res.data, "comment/list");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.comment = resdata.data.comment;
            this.data = resdata.data;
            Toast.clear();
          } else if (resdata.code == 40005) {
            this.$router.push({
              path: "/shopDetail"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }

          Toast.clear();
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
    },
    goodnum() {
      this.comment_type = 1;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/beautician/comment/list", {
          params: {
            beautician_id: this.$route.query.id,
            comment_type: 1
          }
        })
        .then(res => {
          console.log(res.data, "comment/list");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.comment = resdata.data.comment;
            this.data = resdata.data;
            Toast.clear();
          } else if (resdata.code == 40005) {
            this.$router.push({
              path: "/shopDetail"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }
          Toast.clear();
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
    },
    comnum() {
      this.comment_type = 2;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/beautician/comment/list", {
          params: {
            beautician_id: this.$route.query.id,
            comment_type: 2
          }
        })
        .then(res => {
          console.log(res.data, "comment/list");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.comment = resdata.data.comment;
            this.data = resdata.data;
            Toast.clear();
          } else if (resdata.code == 40005) {
            this.$router.push({
              path: "/shopDetail"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }

          Toast.clear();
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
    },
    badnum() {
      this.comment_type = 3;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/beautician/comment/list", {
          params: {
            beautician_id: this.$route.query.id,
            comment_type: 3
          }
        })
        .then(res => {
          console.log(res.data, "comment/list");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.comment = resdata.data.comment;
            this.data = resdata.data;
            Toast.clear();
          } else if (resdata.code == 40005) {
            this.$router.push({
              path: "/shopDetail"
            });
          } else {
            Toast.clear();
            Toast(resdata.msg);
          }

          Toast.clear();
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
.grey_12 {
  font-size: 12px;
  color: #979797;
}

.nav > div {
  height: 25px;
  width: 62px;
  padding: 0 3px;
  line-height: 25px;
  display: inline-block;
  border-radius: 20px;
  text-align: center;
  border: 1px solid #8c8c8c;
  box-sizing: border-box;
  font-size: 12px;
  margin-left: 10px;
}

.nav .selected {
  color: #fff;
  background: linear-gradient(90deg, #fe4171, #ff5491);
  border: none;
}

.wuxing {
  padding: 0 10px 0 5px;
}

.xx_comment {
  line-height: 40px;
}

.word_mouth_box {
  border-top: 10px solid #f0f0f0;
}

.word_mouth {
  margin: 0 10px;
  height: 100%;
}

.word_mouth > div {
  border-bottom: 1px solid #f0f0f0;
}

.word_mouth :last-child {
  border-bottom: 1px solid #fff;
}

.head_name,
.com_det {
  padding: 5px 0;
}

.head_img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.imglist_b {
  margin: 5px 0 10px 0;
}

.imglist {
  display: inline-block;
  margin-top: 5px;
}

.itemimg {
  width: 90px;
  height: 92px;
  border-radius: 5px;
  margin: 0 5px;
}

.dettail {
  font-size: 15px;
  font-weight: 600;
  padding: 13px 0;
}

.weight {
  padding: 10px 0;
}

.pro_img {
  width: 100%;
  height: 450px;
  border-radius: 5px;
  padding: 10px 0;
}

.footer {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
}
</style>

