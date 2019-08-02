<template>
  <div>
    <div class="bgc pd-15">
      <div class="mar-b-10 flexbox" v-for="(item,index) in data" @click="toactDetail(item.id)">
        <img class="img_slt" :src="item.cover_url">
        <div class="flex-column-space-between right">
          <div class="newline pro_title fsz12">{{item.title}}</div>
          <div class="flex-jc-between">
            <span class="fc-grey fsz12">{{item.time}}</span>
            <img class="img_fx" src="../../assets/photo/fenxiang.png">
          </div>
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
      data: []
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    toactDetail(id) {
      this.$router.push({
        path: "/actDetail",
        query: {
          id: id,
          store_id: JSON.parse(window.localStorage.getItem("store_id")),
          first_user_id: JSON.parse(
            window.localStorage.getItem("first_user_id")
          )
        }
      });
    },

    getdata() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/event/list")
        .then(res => {
          console.log(res.data, "event");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.data = resdata.data;
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
    }
  }
};
</script>

<style scoped>
.fsz12 {
  font-size: 12px;
}
.fsz10 {
  font-size: 10px;
}
.img_slt {
  width: 120px;
  height: 80px;
  border-radius: 10px;
}
.right {
  padding: 10px 0 10px 10px;
}
.pro_title {
  width: 160px;
}
.img_fx {
  width: 14px;
  height: 15px;
}
</style>
