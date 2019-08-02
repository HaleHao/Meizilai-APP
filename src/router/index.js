import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/pages/index'
import Me from '@/pages/me/me'
import Materialcircle from '@/pages/materialcircle/materiaList'
import Shop from '@/pages/shop/shopList'
import Classify from '@/pages/classify/classifyList'

//首页子模块
import ProductDetail from '@/pages/home/productDetail'
import WordMouth from '@/pages/home/wordMouth'
import ConfirmationOrder from '@/pages/home/confirmationOrder'
import CompanyIntroduction from '@/pages/home/companyIntroduction'
import SelsctAddress from '@/pages/home/selsctAddress'
import Shopstyle from '@/pages/home/shopstyle'
import Shopmore from '@/pages/home/shopmore'
import OperationalGuide from '@/pages/home/operationalGuide'
import Teamstyle from '@/pages/home/teamstyle'
import NewActivities from '@/pages/home/newActivities'
import ActDetail from '@/pages/home/actDetail'
import NewArrivals from '@/pages/home/newArrivals'
import MerchantDetail from '@/pages/home/merchantDetail'
import MerchantEntry from '@/pages/home/merchantEntry'
import Search from '@/pages/home/search'


// 选择地址
import AddressList from '@/pages/addressFile/addressList'
import AddAddress from '@/pages/addressFile/addAddress'

// 素材圈
import Answers from '@/pages/materialcircle/answers'
import AnswersSearch from '@/pages/materialcircle/answersSearch'
import ImageText from '@/pages/materialcircle/imageText'
import ReportDetail from '@/pages/materialcircle/reportDetail'
import MaterialDetail from '@/pages/materialcircle/materialDetail'
import EditAnswer from '@/pages/materialcircle/editAnswer'

//订单
import MyOrder from '@/pages/order/myOrder'
import OrderDetail from '@/pages/order/orderDetail'
import Comment from '@/pages/order/comment'
import PostMessage from '@/pages/order/postMessage'
import Pays from '@/pages/order/pays'
import Successpay from '@/pages/order/successpay'

//店铺后台
import StoreLogin from '@/pages/store/storeLogin'
import Backstage from '@/pages/store/backstage'
import CommodityOrder from '@/pages/store/commodityOrder'
import ServiceOrder from '@/pages/store/serviceOrder'
import Examine from '@/pages/store/examine'
import TodayIncome from '@/pages/store/todayIncome'
import Cumulative from '@/pages/store/cumulative'

// 签到
import SignIn from '@/pages/signin/signIn'
import SignIntwo from '@/pages/signin/signIntwo'
import SignInthree from '@/pages/signin/signInThree'
import SignInrank from '@/pages/signin/signInrank'


//个人中心 
import MenberCard from '@/pages/me/menberCard'
import MyInformation from '@/pages/me/myInformation'
import Service from '@/pages/me/service'
import ServiceDetail from '@/pages/me/serviceDetail'
import Profit from '@/pages/me/profit'
import Authorization from '@/pages/me/authorization'
import ResultNo from '@/pages/me/resultNo'
import Result from '@/pages/me/result'
import Poster from '@/pages/me/poster'
import MyApply from '@/pages/me/myApply'
import Comments from '@/pages/me/comments'
import ApplyOrder from '@/pages/me/applyOrder'
import ApplicationUpgrade from '@/pages/me/applicationUpgrade'
import Team from '@/pages/me/team'
import AddInformation from '@/pages/me/addInformation'
import ReceInformation from '@/pages/me/receInformation'
import Cash from '@/pages/me/cash'
import BindingCard from '@/pages/me/bindingCard'
import Cart from '@/pages/me/cart'



//登录
import Login from '@/pages/login/login'
import Register from '@/pages/login/register'
import WechatAuth from '@/pages/login/wechatAuth'
import Advertisement from '@/pages/login/advertisement'


//店铺
import ShopDetail from '@/pages/shop/shopDetail'
import BeautyDetail from '@/pages/shop/beautyDetail'
import BeautyComment from '@/pages/shop/beautyComment'
import ConfirOrder from '@/pages/shop/confirOrder'
import Successful from '@/pages/shop/successful'
import SearShop from '@/pages/shop/searShop'


import Map from '@/pages/map'

import NotFound from '@/pages/notFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Index, meta: { title: '首页' } },
    { path: '/shop', component: Shop, meta: { title: '全国连锁' } },
    { path: '/materialcircle', component: Materialcircle, meta: { title: '素材圈' } },
    { path: '/me', component: Me, meta: { title: '我的' } },
    { path: '/classify', component: Classify, meta: { title: '分类' } },

    // 素材圈
    { path: '/answersSearch', component: AnswersSearch, meta: { title: '百问百答搜索' } },
    { path: '/answers', component: Answers, meta: { title: '百问百答详情' } },
    { path: '/imageText', component: ImageText, meta: { title: '图文详情' } },
    { path: '/reportDetail', component: ReportDetail, meta: { title: '宣传报道详情' } },
    { path: '/materialDetail', component: MaterialDetail, meta: { title: '素材发圈详情' } },
    { path: '/editAnswer', component: EditAnswer, meta: { title: '发表评论' } },

    //订单
    { path: '/myOrder', component: MyOrder, meta: { title: '我的订单' } },
    { path: '/orderDetail', component: OrderDetail, meta: { title: '订单详情' } },
    { path: '/comment', component: Comment, meta: { title: '评论' } },
    { path: '/postMessage', component: PostMessage, meta: { title: '物流信息' } },
    { path: '/pays', component: Pays, meta: { title: '扫码开机' } },
    { path: '/successpay', component: Successpay, meta: { title: '付款成功' } },


    //店铺后台
    { path: '/storeLogin', component: StoreLogin, meta: { title: '登录' } },
    { path: '/backstage', component: Backstage, meta: { title: '店铺后台' } },
    { path: '/commodityOrder', component: CommodityOrder, meta: { title: '商品订单' } },
    { path: '/serviceOrder', component: ServiceOrder, meta: { title: '服务订单' } },
    { path: '/examine', component: Examine, meta: { title: '待审批' } },
    { path: '/todayIncome', component: TodayIncome, meta: { title: '收益' } },
    { path: '/cumulative', component: Cumulative, meta: { title: '累计收益' } },

    // 签到
    { path: '/signIn', component: SignIn, meta: { title: '签到' } },
    { path: '/signIntwo', component: SignIntwo, meta: { title: '签到' } },
    { path: '/signInthree', component: SignInthree, meta: { title: '签到' } },
    { path: '/signInrank', component: SignInrank, meta: { title: '签到' } },


    //首页子模块
    { path: '/productDetail', component: ProductDetail, meta: { title: '产品详情' } },
    { path: '/confirmationOrder', component: ConfirmationOrder, meta: { title: '确认订单' } },
    { path: '/selsctAddress', component: SelsctAddress, meta: { title: '选择地址' } },
    { path: '/companyIntroduction', component: CompanyIntroduction, meta: { title: '公司介绍' } },
    { path: '/shopstyle', component: Shopstyle, meta: { title: '店铺风采' } },
    { path: '/shopmore', component: Shopmore, meta: { title: '店铺风采' } },
    { path: '/operationalGuide', component: OperationalGuide, meta: { title: '操作指引' } },
    { path: '/teamstyle', component: Teamstyle, meta: { title: '团队风采' } },
    { path: '/newActivities', component: NewActivities, meta: { title: '最新活动' } },
    { path: '/actDetail', component: ActDetail, meta: { title: '活动详情' } },
    { path: '/newArrivals', component: NewArrivals, meta: { title: '新品推荐' } },
    { path: '/merchantEntry', component: MerchantEntry, meta: { title: '商家入驻' } },
    { path: '/merchantDetail', component: MerchantDetail, meta: { title: '商家入驻详情' } },
    { path: '/wordMouth', component: WordMouth, meta: { title: '口碑' } },
    { path: '/search', component: Search, meta: { title: '搜索' } },


    // 选择地址

    { path: '/addressList', component: AddressList, meta: { title: '选择地址' } },
    { path: '/addAddress', component: AddAddress, meta: { title: '选择地址' } },


    //个人中心
    { path: '/menberCard', component: MenberCard, meta: { title: '会员卡' } },
    { path: '/service', component: Service, meta: { title: '我的服务' } },
    { path: '/serviceDetail', component: ServiceDetail, meta: { title: '服务详情' } },
    { path: '/profit', component: Profit, meta: { title: '我的收益' } },
    { path: '/applyOrder', component: ApplyOrder, meta: { title: '申请订单' } },
    { path: '/comments', component: Comments, meta: { title: '立即评论' } },
    { path: '/authorization', component: Authorization, meta: { title: '我的授权' } },
    { path: '/resultNo', component: ResultNo, meta: { title: '查询结果' } },
    { path: '/result', component: Result, meta: { title: '查询结果' } },
    { path: '/poster', component: Poster, meta: { title: '我的海报' } },
    { path: '/team', component: Team, meta: { title: '我的团队' } },
    { path: '/myApply', component: MyApply, meta: { title: '注册' } },
    { path: '/applicationUpgrade', component: ApplicationUpgrade, meta: { title: '我要申请' } },
    { path: '/receInformation', component: ReceInformation, meta: { title: '收货信息' } },
    { path: '/addInformation/:id', component: AddInformation, meta: { title: '编辑收货信息' } },
    { path: '/addInformation', component: AddInformation, meta: { title: '添加收货信息' } },
    { path: '/cash', component: Cash, meta: { title: '提现' } },
    { path: '/bindingCard', component: BindingCard, meta: { title: '绑定银行卡' } },
    { path: '/cart', component: Cart, meta: { title: '购物车' } },
    { path: '/myInformation', component: MyInformation, meta: { title: '设置' } },



    //登录
    { path: '/login', component: Login, meta: { title: '登录' } },
    { path: '/register', component: Register, meta: { title: '注册' } },
    { path: '/wechatAuth', component: WechatAuth, meta: { title: '授权' } },
    { path: '/advertisement', component: Advertisement, meta: { title: '广告' } },

    //店铺
    { path: '/shopDetail', component: ShopDetail, meta: { title: '店铺详情' } },
    { path: '/beautyDetail', component: BeautyDetail, meta: { title: '美容师详情' } },
    { path: '/beautyComment', component: BeautyComment, meta: { title: '美容师评价' } },
    { path: '/confirOrder', component: ConfirOrder, meta: { title: '确认订单' } },
    { path: '/successful', component: Successful, meta: { title: '申请成功' } },
    { path: '/searShop', component: SearShop, meta: { title: '搜索店铺' } },


    //地图
    { path: '/map/:center/:shop', component: Map, meta: { title: '地图' } },

    { path: '*', component: NotFound, meta: { title: '404-not found' } },

  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }

})