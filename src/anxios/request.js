//request.js
import axios from "axios";

// http request 拦截器
axios.interceptors.request.use(
    config => {
        let access_token = JSON.parse(window.localStorage.getItem("access_token"))
        if (access_token) {

            // config.params = {
            //     'Access-Token': JSON.parse(window.localStorage.getItem("access_token"))
            // }
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers = { 'Access-Token': access_token }

        }

        // else {
        //     let code = JSON.parse(window.localStorage.getItem("code"));
        //     if (code) {
        //         window.location.href = "https://meizilai.zx-xcx.com/app/#/?code=" + code;
        //         window.localStorage.removeItem("store_id");
        //     } else {
        //         let store_id = JSON.parse(window.localStorage.getItem("store_id"));
        //         window.location.href = "https://meizilai.zx-xcx.com/app/#/?store_id=" + store_id;
        //     }
        // }
        return config;
    },
    err => {
        return Promise.reject(err);
    });


// http response 响应拦截器
//
// axios.interceptors.response.use( //  access_token:code:40005是微信授权过期时间
//     response => {
//         if (response.data.code === 40005) {
//             // window.localStorage.clear()  //清空所有的本地存储数据
//             window.localStorage.removeItem('access_token')  //清空删除对应key以及key中的内容
//             router.replace({
//                 path: '/index' // 到首页重新获取access_token
//             })
//
//         } else if (response.data.access_token) { // 判断access_token是否存在，如果存在说明需要更新
//             window.localStorage.setItem("access_token", JSON.stringify(response.data.access_token));// 覆盖原来的access_token
//         }
//
//         return response
//     },
//     err => {
//         return Promise.reject(error)
//
//     })


export default axios