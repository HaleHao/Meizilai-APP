<template>
  <div>
    <div class="bgc">
      <div class="nav bgc border-b">
        <div :class="{ 'selected': typenum==0 }" @click="answers">百问百答</div>
        <div :class="{ 'selected': typenum==1 }" @click="material">素材发圈</div>
        <div :class="{ 'selected': typenum==2 }" @click="graphic">图文专栏</div>
        <div :class="{ 'selected': typenum==3 }" @click="report">宣传报道</div>
      </div>
    </div>

    <div v-show="typenum==0">
      <div class="bgc pd-lr-15 sear_box">
        <div class="sear flex-align-items" @click="gosearch">
          <van-icon name="search" size="20px" color="#979797"/>
          <span class="fc-grey fz12">输入问答关键字</span>
        </div>
      </div>
      <div class="bgc">
        <div class="merchlist pd-15" v-for="(item,index) in question">
          <div @click="toAnswers(item.id)">
            <div class="problem">{{item.title}}</div>
            <div class="fsz12 flex-align-items store_name">
              <img class="img_logo" src="../../assets/photo/yanzhengma.png">
              <span>魅资莱</span>
            </div>
          </div>
          <div class="flex-jc-between fsz12">
            <span class="fc-grey">{{item.created_at}}</span>
            <div class="img_box flexbox">
              <div @click="editAnswer(item.id)">
                <img class="img_commit" src="../../assets/photo/commit.png">
              </div>
              <div class="text-c" @click.stop="questionLike(item.id)">
                <div>
                  <img
                    v-if="item.is_like==1"
                    class="img_commit"
                    src="../../assets/photo/dianzans.png"
                  >
                  <img v-else class="img_commit" src="../../assets/photo/dianzan.png">
                </div>
              </div>
              <img class="img_fenxiang" src="../../assets/photo/fenxiang.png">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="typenum==1">
      <div
        class="flexbox pd-15 mar-b-10 bgc"
        v-for="(item,index) in matelist"
        @click="tomalDetail(item.id)"
      >
        <div style="width:50px">
          <img class="img_logo1 border" src="../../assets/photo/yanzhengma.png">
        </div>
        <div class="box-right">
          <div class="fc-fen fz15" style="padding-top:10px">魅资莱</div>
          <div class="pd-tb-15">
            <span>{{item.title}}</span>
          </div>

          <div class="imglist" v-for="(items,indexs) in item.images" :key="indexs">
            <img class="itemimg" :src="items.img_url">
          </div>

          <div class="flex-jc-between fsz12" style="padding-top:10px">
            <div class="fc-grey">{{item.created_at}}</div>
            <div class="img_box flexbox">
              <div class="text-c" @click.stop="merLike(item.id)">
                <div>
                  <img
                    v-if="item.is_like==1"
                    class="img_commit"
                    src="../../assets/photo/dianzans.png"
                  >
                  <img v-else class="img_commit" src="../../assets/photo/dianzan.png">
                </div>
              </div>
              <img class="img_fenxiang" src="../../assets/photo/fenxiang.png">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="typenum==2" class="bgc pd-lr-15">
      <div v-for="(item,index) in list" @click="toimageText(item.id)">
        <div class="photo">
          <img :src="item.cover_url">
        </div>
        <div class="txt">{{item.title}}</div>
      </div>
    </div>
    <div v-show="typenum==3">
      <div
        class="mar-b-10 bgc flexbox pd-15"
        v-for="(item,index) in reportlist"
        @click="reportDetail(item.id)"
      >
        <div class="report">
          <img :src="item.cover_url">
        </div>
        <div class="flex-column-space-between right_box">
          <div>{{item.title}}</div>
          <div class="flex-jc-between fsz12" style="padding-top:10px">
            <span class="fc-grey">{{item.created_at}}</span>
            <div class="img_box flexbox">
              <div class="text-c" @click.stop="onlike(item.id)">
                <div>
                  <img
                    v-if="item.is_like==1"
                    class="img_commit"
                    src="../../assets/photo/dianzans.png"
                  >
                  <img v-else class="img_commit" src="../../assets/photo/dianzan.png">
                </div>
              </div>
              <img class="img_fenxiang" src="../../assets/photo/fenxiang.png">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="height:50px"></div>
  </div>
</template>

<script>
import { Toast, Notify } from "vant";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      typenum: 0,
      radio: 0,
      islike: true,
      isdianzan: false,
      images: [],
      list: [],
      reportlist: [],
      matelist: [],
      question: []
    };
  },
  created() {
    this.answers();
  },
  methods: {
    //点赞
    // ondianzan() {
    //   this.isdianzan = !this.isdianzan;
    // },

    // 百问百答搜索
    gosearch() {
      this.$router.push({ path: "/answersSearch/" });
    },
    answers() {
      this.typenum = 0;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios.get(this.API + "/api/v1/question/list").then(res => {
        console.log(res.data, "question/list");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.question = resdata.data;
          Toast.clear();
        } else {
          Toast.clear();
          Toast(resdata.msg);
        }
      });
    },
    questionLike(id) {
      Toast.loading({ mask: true, message: "加载中..." });

      let param = new URLSearchParams();
      param.append("question_id", id);
      this.axios.post(this.API + "/api/v1/question/like", param).then(res => {
        console.log(res.data, "question/like");
        let resdata = res.data;
        if (resdata.code == 200) {
          console.log(resdata.msg);

          this.answers();
          Toast.success(resdata.msg);

          Toast.clear();
        } else {
        }

        Toast.clear();
      });
    },
    // 百问百答评论
    editAnswer(id) {
      this.$router.push({
        path: "/editAnswer",
        query: {
          id: id
        }
      });
    },
    // 百问百答详情
    toAnswers(id) {
      this.$router.push({
        path: "/answers/",
        query: {
          id: id,
          store_id: JSON.parse(window.localStorage.getItem("store_id")),
          first_user_id: JSON.parse(
            window.localStorage.getItem("first_user_id")
          )
        }
      });
    },

    // 素材发圈
    material() {
      this.typenum = 1;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios.get(this.API + "/api/v1/material/list").then(res => {
        console.log(res.data, "material/list");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.matelist = resdata.data;
          Toast.clear();
        } else {
          Toast.clear();
          Toast(resdata.msg);
        }
      });
    },
    merLike(id) {
      Toast.loading({ mask: true, message: "加载中..." });

      let param = new URLSearchParams();
      param.append("material_id", id);

      this.axios.post(this.API + "/api/v1/material/like", param).then(res => {
        console.log(res.data, "material/like");
        let resdata = res.data;
        if (resdata.code == 200) {
          console.log(resdata.msg);
          Toast.success(resdata.msg);
          this.material();
          // Notify({
          //   message: resdata.msg,
          //   duration: 1000,
          //   background: "#1989fa"
          // });
          Toast.clear();
        } else {
        }

        Toast.clear();
      });
    },

    // 素材发圈详情
    tomalDetail(id) {
      this.$router.push({
        path: "/materialDetail",
        query: {
          id: id,
          store_id: JSON.parse(window.localStorage.getItem("store_id")),
          first_user_id: JSON.parse(
            window.localStorage.getItem("first_user_id")
          )
        }
      });
    },
    // 图文专栏
    graphic() {
      this.typenum = 2;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios.get(this.API + "/api/v1/graphic/list").then(res => {
        console.log(res.data, "graphic/list");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.list = resdata.data;
          Toast.clear();
        } else {
          Toast.clear();
          Toast(resdata.msg);
        }
      });
    },
    // 图文专栏详情
    toimageText(id) {
      this.$router.push({
        path: "/imageText",
        query: {
          id: id
        }
      });
    },
    // 宣传报道
    report() {
      this.typenum = 3;
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios.get(this.API + "/api/v1/report/list").then(res => {
        console.log(res.data, "report/list");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.reportlist = resdata.data;

          Toast.clear();
        } else if (resdata.code == 40005 || resdata.code == 20002) {
          window.localStorage.removeItem("access_token");
          this.$router.push({
            path: "/wechatAuth",
            query: {
              store_id: JSON.parse(window.localStorage.getItem("store_id")),
              first_user_id: JSON.parse(
                window.localStorage.getItem("first_user_id")
              ),
              url: location.href
            }
          });
        } else {
          Toast.clear();
          Toast(resdata.msg);
        }
      });
    },
    onlike(id) {
      console.log(id);

      let param = new URLSearchParams();
      param.append("report_id", id);
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .post(this.API + "/api/v1/report/like", param)
        .then(res => {
          console.log(res.data, "report/like");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.report();
            // Notify({
            //   message: resdata.msg,
            //   duration: 1000,
            //   background: "#1989fa"
            // });
            Toast.success(resdata.msg);
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
    // 宣传报道详情
    reportDetail(id) {
      this.$router.push({
        path: "/reportDetail",
        query: {
          id: id,
          store_id: JSON.parse(window.localStorage.getItem("store_id")),
          first_user_id: JSON.parse(
            window.localStorage.getItem("first_user_id")
          )
        }
      });
    }
  }
};
</script>



<style scoped>
.fz15 {
  font-size: 15px;
}
.nav {
  padding: 15px 10px;
}
.nav > div {
  width: 68px;
  height: 25px;
  line-height: 25px;
  display: inline-block;
  border-radius: 20px;
  text-align: center;
  box-sizing: border-box;
  font-size: 13px;
  margin-right: 3px;
}
.nav .selected {
  color: #fff;
  background: linear-gradient(90deg, #fe4171, #ff5491);
}
.fz12 {
  font-size: 12px;
}
.sear_box {
  padding: 10px;
}
.sear {
  height: 30px;
  line-height: 30px;
  border-radius: 20px;
  background: #f6f5f5;
}

.sear .van-icon {
  padding-left: 100px;
}

.fsz12 {
  font-size: 12px;
}
.fsz10 {
  font-size: 10px;
}

.merchlist {
  border-bottom: 10px solid #f0f0f0;
}

.merchlist:last-child {
  border: none;
}
.problem {
  font-size: 17px;
  font-weight: 600;
}

.store_name {
  padding: 10px 0;
}

.img_logo {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  margin-right: 10px;
}
.img_logo1 {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
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

.img_commit {
  width: 16px;
  height: 16px;
}
.img_fenxiang {
  width: 15px;
  height: 16px;
}
.box-right {
  width: 230px;
  margin-left: 10px;
}
.imglist {
  display: inline-block;
}
.itemimg {
  width: 68px;
  height: 72px;
  border-radius: 5px;
  margin: 2px 3px;
}

.photo {
  padding-top: 15px;
}
.photo img {
  border-radius: 10px;
}
.txt {
  line-height: 40px;
}

.report img {
  width: 104px;
  height: 80px;
  border-radius: 5px;
}

.right_box {
  width: 204px;
  padding-left: 10px;
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