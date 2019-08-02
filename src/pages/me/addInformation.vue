<template>
  <div>
    <div class="pd-15 bgc border-b flex-align-items">
      <span>收货人</span>
      <input type="text" v-model.trim="nameval" class="pd-lr-15">
    </div>
    <div class="pd-15 bgc border-b flex-align-items">
      <span>手机号</span>
      <input type="text" maxlength="11" v-model.trim="phoneval" class="pd-lr-15">
    </div>
    <div class="pd-15 flex-jc-between bgc border-b" @click="showarea=true">
      <span>所在地区</span>
      <div class="fc-grey flex-align-items">
        <span>{{areaval==''?'':areaval[0].name+areaval[1].name+areaval[2].name}}</span>
        <van-icon name="arrow"/>
      </div>
    </div>
    <div class="pd-15 bgc mar-b-10">
      <div>街道、小区门牌等详情地址</div>
      <div style="line-height:30px">
        <input type="text" v-model.trim="detailval">
      </div>
    </div>
    <div class="pd-15 bgc flex-jc-between flex-align-items">
      <span>设为默认地址</span>
      <van-switch v-model="checked" active-color="#ff5491" size="20px"/>
    </div>

    <div class="pd-t-50">
      <div class="btn text-c" @click="submit">保存</div>
    </div>

    <van-popup v-model="showarea" position="bottom" :close-on-click-overlay="false">
      <van-area :area-list="areaList" @cancel="showarea=false" @confirm="onconfirm"/>
    </van-popup>
  </div>
</template>

<script>
import area from "@/utils/area.js";
import { Toast } from "vant";
export default {
  data() {
    return {
      checked: false,
      showarea: false,
      areaval: "",
      areaList: area,
      nameval: "",
      phoneval: "",
      detailval: ""
    };
  },
  created() {
    if (this.$route.query.id) {
      this.getdata();
    }
  },
  methods: {
    onconfirm(val) {
      console.log(val);
      this.areaval = val;
      this.showarea = false;
    },
    getdata() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/address/edit", {
          params: {
            address_id: this.$route.query.id
          }
        })
        .then(res => {
          console.log(res.data, "add");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
            this.nameval = resdata.data.consignee;
            this.phoneval = resdata.data.mobile;
            this.detailval = resdata.data.address;
            this.checked = resdata.data.is_default == 1 ? true : false;
            this.areaval = [
              { name: resdata.data.province },
              { name: resdata.data.city },
              { name: resdata.data.district }
            ];
          } else {
            Toast.clear();
            Toast(resdata.message);
          }
        });
    },
    isDefault() {
      let param = new URLSearchParams();
      param.append("address_id", this.$route.query.id);
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .post(this.API + "/api/v1/address/default", param)
        .then(res => {
          console.log(res.data, "default");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
          } else {
            Toast.clear();
            Toast(resdata.message);
          }
        })
        .catch(error => {
          Toast.clear();
          Toast("网络出错");
        });
    },
    submit() {
      if (this.nameval == "" || this.phoneval == "" || this.detailval == "") {
        Toast("请先填写完整");
        return;
      }

      let param = new URLSearchParams();
      param.append("address_id", this.$route.query.id || "");
      param.append("consignee", this.nameval);
      param.append("mobile", this.phoneval);
      param.append("is_default", this.checked ? "1" : "0");
      param.append("province", this.areaval[0].name);
      param.append("city", this.areaval[1].name);
      param.append("district", this.areaval[2].name);
      param.append("address", this.detailval);
      if (this.$route.query.id) {
        this.isDefault();
        Toast.loading({ mask: true, message: "加载中..." });
        this.axios
          .post(this.API + "/api/v1/address/update", param)
          .then(res => {
            console.log(res.data, "update");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              this.$router.go(-1);
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
        Toast.loading({ mask: true, message: "加载中..." });
        this.axios
          .post(this.API + "/api/v1/address/create", param)
          .then(res => {
            console.log(res.data, "create");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              this.$router.go(-1);
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

<style scoped>
.pd-t-50 {
  padding: 0 15px;
  padding-top: 50px;
}
.btn {
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #ff5491, #fe4171);
}
</style>
