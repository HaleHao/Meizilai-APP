<template>
  <div>
    <div class="fixed" v-show="isshow">
      <div class="text-c">请通过扫码进入公众号</div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      isshow: ""
    };
  },
  created() {
    if (JSON.parse(window.localStorage.getItem("access_token"))) {
      let old_store_id = JSON.parse(window.localStorage.getItem("store_id"));
      // 新的店铺id与旧的店铺id不同 则重新登录  否则不需要重新登录
      if (old_store_id != this.$route.query.store_id) {
        let code = window.location.search.split("&")[0].slice(6);
        console.log(code);
        if (code) {
          window.localStorage.setItem("code", JSON.stringify(code));
          this.getToken(code);
        }

        // 把新的store_id  店铺id缓存起来
        let store_id = this.$route.query.store_id;
        window.localStorage.setItem("store_id", JSON.stringify(store_id));

        let old_first_user_id = JSON.parse(
          window.localStorage.getItem("first_user_id")
        );
        // 存在新的first_user_id 上级id 并且不等于旧的first_user_id
        if (
          this.$route.query.first_user_id &&
          old_first_user_id != this.$route.query.first_user_id
        ) {
          // 把新的first_user_id  上级id缓存起来
          this.first_user_id = this.$route.query.first_user_id;
          window.localStorage.setItem(
            "first_user_id",
            JSON.stringify(this.first_user_id)
          );
        } else {
          this.first_user_id = 0;
          window.localStorage.setItem(
            "first_user_id",
            JSON.stringify(this.first_user_id)
          );
        }

        this.login(store_id);
      }
      // window.location.href = this.$route.query.url;

      this.isshow = false;
    } else {
      if (this.$route.query.store_id) {
        let store_id = this.$route.query.store_id;
        if (this.$route.query.first_user_id) {
          this.first_user_id = this.$route.query.first_user_id;
        } else {
          this.first_user_id = 0;
        }
        console.log("----------" + this.first_user_id);
        window.localStorage.setItem(
          "first_user_id",
          JSON.stringify(this.first_user_id)
        );
        window.localStorage.setItem("store_id", JSON.stringify(store_id));
        this.login(store_id);
      } else {
        this.isshow = true;
      }
      let code = window.location.search.split("&")[0].slice(6);
      if (code) {
        this.getToken(code);
      }
    }
  },

  methods: {
    login(store_id) {
      Toast.loading({ mask: true, message: "加载中..." });
      if (store_id) {
        this.axios
          .get(this.API + "/api/v1/wechat/login", {
            params: {
              store_id: store_id
            }
          })
          .then(res => {
            console.log(res.data, "login");
            let resdata = res.data;
            if (resdata.code == 200) {
              // 获取code
              window.location.href = resdata.data;
              console.log(this.$route.query.code);

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
      }
    },
    getToken(code) {
      window.localStorage.setItem("code", JSON.stringify(code));
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/wechat/register", {
          params: {
            code: code,
            store_id: JSON.parse(window.localStorage.getItem("store_id")),
            first_user_id: JSON.parse(
              window.localStorage.getItem("first_user_id")
            )
          }
        })
        .then(res => {
          console.log(res.data, "register");

          let resdata = res.data;
          if (resdata.code == 200) {
            window.localStorage.setItem(
              "access_token",
              JSON.stringify(resdata.data.token)
            );
            if (resdata.data.is_mobile == 0) {
              this.$router.push({ path: "/register" });
            }

            this.isshow = false;
            Dialog.alert({
              message: "授权成功"
            }).then(() => {
              window.location.href = this.$route.query.url;
            });
            Toast.clear();
          } else {
            this.isshow = true;
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
.fixed {
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100%;
  background: #fff;
  z-index: 90;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>


