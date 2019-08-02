<template>
  <div>
    <div class="textarea bgc" v-if="one">
      <textarea rows="10" v-model.trim="contentval" placeholder="发表评论......"></textarea>
    </div>
    <div class="textarea bgc" v-else>
      <div class="fc-grey">回复{{nickname}}：</div>
      <textarea rows="10" v-model.trim="contentval"></textarea>
    </div>
    <div class="pd-15">
      <div class="btn text-c" @click="submit">发表</div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      contentval: "",
      one: "",
      nickname: "",
      parent_id: "",
      question_id: ""
    };
  },
  watch: {},
  created() {
    console.log(this.$route.query.item);
    if (this.$route.query.item) {
      let item = this.$route.query.item;
      this.nickname = item.user.nickname;
      this.parent_id = item.id;
      this.question_id = item.question_id;
      console.log(this.nickname);
    }
    this.one = this.$route.query.id;
  },
  methods: {
    submit() {
      if (this.contentval == "") {
        Toast("请填写评论内容");
        return;
      }
      Toast.loading({ mask: true, message: "加载中..." });
      let param = new URLSearchParams();

      param.append("content", this.contentval);
      if (this.$route.query.item) {
        param.append("parent_id", this.parent_id);
        param.append("question_id", this.question_id);
      } else {
        param.append("question_id", this.$route.query.id);
      }
      this.axios
        .post(this.API + "/api/v1/question/comment", param)
        .then(res => {
          console.log(res.data, "question/comment");
          let resdata = res.data;
          if (resdata.code == 200) {
            console.log(resdata.msg);
            Toast.success(resdata.msg);

            Toast.clear();
            this.$router.back(-1);
          } else {
            Toast(resdata.msg);
            Toast.clear();
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
.textarea {
  padding: 10px;
}
.textarea textarea {
  width: 100%;
}

.btn {
  margin-top: 20px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  color: #fff;
  background: linear-gradient(90deg, #ff5491, #fe4171);
}
</style>
