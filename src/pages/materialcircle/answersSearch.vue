<template>
  <div>
    <div id="search">
      <van-search
        v-model="value"
        placeholder="请输入问答关键字"
        show-action
        @search="onSearch"
        background="#fff"
      >
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
    </div>
    <div v-show="question.length==0" class="pd-tb-15 text-c bgc">暂无搜索结果</div>
    <div class="merchlist pd-15 bgc" v-for="(item,index) in question">
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

          <div class="text-c" @click.stop="ondianzan(item.id)">
            <div>
              <img v-if="item.is_like==1" class="img_commit" src="../../assets/photo/dianzans.png">
              <img v-else class="img_commit" src="../../assets/photo/dianzan.png">
            </div>
          </div>
          <img class="img_fenxiang" src="../../assets/photo/fenxiang.png">
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
      isdianzan: false,
      value: "",
      question: []
    };
  },

  created() {
    // this.answers();
    let searchSession = JSON.parse(
      window.sessionStorage.getItem("searchSession")
    );
    if (searchSession) {
      this.value = searchSession.value;
    }
  },
  methods: {
    onSearch() {
      console.log(this.value);
      this.answers();
    },

    answers() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/question/list", {
          params: {
            keyword: this.value
          }
        })
        .then(res => {
          console.log(res.data, "question/list");
          let resdata = res.data;
          if (resdata.code == 200) {
            let searchSession = {
              value: this.value
            };
            window.sessionStorage.setItem(
              "searchSession",
              JSON.stringify(searchSession)
            );
            this.question = resdata.data;
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

    //点赞
    ondianzan(id) {
      Toast.loading({ mask: true, message: "加载中..." });
      let param = new URLSearchParams();
      param.append("question_id", id);
      this.axios
        .post(this.API + "/api/v1/question/like", param)
        .then(res => {
          console.log(res.data, "question/like");
          let resdata = res.data;
          if (resdata.code == 200) {
            console.log(resdata.msg);
            this.answers();
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
    toAnswers(id) {
      this.$router.push({ path: "/answers" });
      this.$router.push({
        path: "/answers",
        query: {
          id: id
        }
      });
    },
    editAnswer(id) {
      this.$router.push({
        path: "/editAnswer",
        query: {
          id: id
        }
      });
    }
  }
};
</script>
<style>
#search .van-search__content {
  border-radius: 20px;
}
</style>

<style scoped>
.fsz12 {
  font-size: 12px;
}
.fsz10 {
  font-size: 10px;
}

.merchlist {
  margin-bottom: 10px;
}

.img_logo {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  margin-right: 10px;
}
.img_commit {
  width: 16px;
  height: 16px;
  margin-right: 15px;
}
.img_fenxiang {
  width: 15px;
  height: 16px;
}

.problem {
  font-size: 17px;
  font-weight: 600;
}

.store_name {
  padding: 10px 0;
}
</style>
