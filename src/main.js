// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import './style/reset.css'
import './style/common.css'
import router from './router'

Vue.use(require('vue-wechat-title'))

import axios from "axios"
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import request from "./anxios/request.js"

import 'swiper/dist/css/swiper.min.css'

import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant);

import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  // key: '7dd71e09ac3a903d60949151b6d53744',//公司的
  key: 'd2fb704760d2d6ff18b57df3147cb8cb',
  plugin: ['AMap.Autocomplete', 'AMap.OverView', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});


// 引入echarts
import echarts from 'echarts';
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

import qs from 'qs'
Vue.prototype.$qs = qs

// Vue.prototype.API = 'https://meizilai.zx-xcx.com'
Vue.prototype.API = 'https://admin.gzchenyu.cn';
// Vue.prototype.API = 'http://192.168.0.140'


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App />'
})