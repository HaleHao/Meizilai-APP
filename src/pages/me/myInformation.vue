<template>
  <div>
    <div class="bgc pd-10">
      <div class="flex-jc-between flex-align-items tx border-b">
        <div>我的头像</div>
        <div class="head_img">
          <img src="http://img2.imgtn.bdimg.com/it/u=390947329,3335162149&fm=26&gp=0.jpg">
        </div>
      </div>
      <div class="border-b dz_detail flex-jc-between">
        <span>昵称</span>
        <div class="flex-align-items">
          <input type="text" placeholder="请输入" v-model.trim="users_name">
          <van-icon name="arrow" color="#979797"/>
        </div>
      </div>
      <div class="border-b dz_detail flex-jc-between">
        <span>真实姓名</span>
        <div class="flex-align-items">
          <input type="text" placeholder="请输入" v-model.trim="real_name">
          <van-icon name="arrow" color="#979797"/>
        </div>
      </div>
      <div class="border-b dz_detail flex-jc-between">
        <span>性别</span>
        <div class="flex-align-items" @click="showsex=true">
          <span class="fc-grey pd-lr-15">{{sexval}}</span>
          <van-icon name="arrow" color="#979797"/>
        </div>
      </div>
    </div>

    <div class="myinfor bgc">
      <van-cell is-link center :value="datetext==''?'':datetext" @click="showdate=true">
        <template slot="title">
          <div class="fsz">生日</div>
        </template>
      </van-cell>
      <div class="tel flex-jc-between">
        <span>手机号</span>
        <div class="fc-grey">{{mobile}}</div>
      </div>
    </div>
    <div class="shxx">
      <van-cell is-link center to="/ReceInformation">
        <template slot="title">
          <div class="fsz">收货地址</div>
        </template>
      </van-cell>
    </div>
    <div class="pd-15">
      <div class="btn text-c" @click="submit">提交</div>
    </div>
    <van-popup v-model="showarea" position="bottom" :close-on-click-overlay="false">
      <van-area :area-list="areaList" @cancel="showarea=false" @confirm="onconfirmArea"/>
    </van-popup>

    <van-popup v-model="showsex" position="bottom" :close-on-click-overlay="false">
      <van-picker
        value-key="val"
        :columns="sexList"
        show-toolbar
        @cancel="showsex = false"
        @confirm="onConfirmSex"
      />
    </van-popup>

    <van-popup v-model="showdate" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker
        v-model="dateval"
        type="date"
        :min-date="startDate"
        :max-date="endDate"
        @cancel="showdate = false"
        @confirm="onConfirmDate"
      />
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import area from "@/utils/area.js";
export default {
  data() {
    return {
      data: "",
      users_name: "",
      real_name: "",
      mobile: "",
      showarea: false,
      areaval: "",
      areaList: area,
      showsex: false,
      sexval: "",
      sex_id: "",
      sexList: [{ id: 1, val: "男" }, { id: 2, val: "女" }],
      dateval: new Date(),
      datetext: "",
      showdate: false,
      startDate: new Date("1899/01/01 00:00"),
      endDate: new Date()
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios
        .get(this.API + "/api/v1/setting")
        .then(res => {
          console.log(res.data, "setting");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.avatar = resdata.data.avatar;
            this.users_name = resdata.data.nickname;
            this.real_name = resdata.data.username;
            this.datetext = resdata.data.birthday;
            this.mobile = resdata.data.mobile;
            let sex_id = resdata.data.sex;
            console.log(resdata.data.sex);
            if (sex_id == 1) {
              this.sexval = "男";
            } else {
              this.sexval = "女";
            }
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
    onconfirmArea(val) {
      console.log(val);
      this.areaval = val;
      this.areaval = val;
      this.showarea = false;
    },
    onConfirmSex(val) {
      console.log(val);
      this.sexval = val.val;
      this.sex_id = val.id;
      console.log(this.sex_id);
      this.showsex = false;
    },
    onConfirmDate(val) {
      console.log(val.getFullYear(), val.getMonth() + 1, val.getDate());
      this.dateval = val;
      let datet = [val.getFullYear(), val.getMonth() + 1, val.getDate()];
      console.log(datet);
      this.datetext = `${datet[0]}-${datet[1]}-${datet[2]}`;
      this.showdate = false;
    },

    submit() {
      Toast.loading({ mask: true, message: "加载中..." });
      if (this.sexval == "男") {
        this.sex_id = "1";
      } else {
        this.sex_id = "2";
      }

      let param = new URLSearchParams();
      param.append("username", this.real_name);
      param.append("nickname", this.users_name);
      param.append("sex", this.sex_id);
      param.append("birthday", this.datetext);
      this.axios
        .post(this.API + "/api/v1/setting/submit", param)
        .then(res => {
          console.log(res.data, "submit");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.avatar = resdata.data.avatar;
            this.users_name = resdata.data.nickname;
            this.real_name = resdata.data.username;
            this.datetext = resdata.data.birthday;
            this.mobile = resdata.data.mobile;
            let sex_id = resdata.data.sex;
            console.log(resdata.data.sex);

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
  }
};
</script>



<style scoped>
.pd-10 {
  padding-left: 15px;
}

.head_img {
  width: 40px;
  height: 40px;
  margin: 5px 0;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
}
.head_img > img {
  width: 40px;
  height: 40px;
}

.me {
  width: 300px;
  height: 100%;
  margin: 0 auto;
  border-radius: 5px;
  margin-bottom: 15px;
}

.btn {
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #ff5491 0%, #fe4171 100%);
  margin-top: 10px;
}
.myinfor,
.shxx {
  margin-top: 10px;
}

.dz_detail {
  padding: 10px 10px 10px 0;
}
.tel {
  padding: 10px 15px;
}
.dz_detail input {
  width: 190px;
  text-align: right;
  padding-right: 10px;
  color: grey;
}
.dz_detail input::placeholder {
  text-align: right;
}
</style>