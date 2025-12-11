import { createWebHashHistory, createRouter } from 'vue-router'

/* Layout 公共布局组件 */
import Layout from "@/layout"

export const routes = [
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: {title: '首页'}
      },
      {
        path: '/login',
        component: () => import('@/views/login/index'),
        name: 'Login',
        meta: {title: '登录', hiddenClassify: false}
      },
      {
        path: '/agreement',
        component: () => import('@/views/login/agreement'),
        name: 'Agreement',
        meta: {title: '用户协议', hiddenClassify: true}
      },
      {
        path: '/cart',
        component: () => import('@/views/cart/index'),
        name: 'Cart',
        meta: {title: '购物车'}
      },
      {
        path: '/product-list',
        component: () => import('@/views/commodity/index'),
        name: 'Commodity',
        meta: {title: '商品列表'}
      },
      {
        path: '/product-detail/:productId(\\d+)',
        component: () => import('@/views/commodity/detail'),
        name: 'ProductDetail',
        meta: {title: '商品详情'}
      },
      {
        path: '/product-Verify',
        component: () => import('@/views/verityProducts/index'),
        name: 'ProductVerify',
        meta: {title: 'Verify Product'}
      },
      {
        path: '/news-detail/:newsId(\\d+)',
        component: () => import('@/views/news/detail'),
        name: 'NewsDetail',
        meta: {title: '新闻详情'}
      },
      {
        path: '/aboutUs',
        component: () => import('@/views/about/detail'),
        name: 'AboutUs',
        meta: {title: '关于我们'}
      },
      {
        path: '/contactUs',
        component: () => import('@/views/contact/detail'),
        name: 'ContactUs',
        meta: {title: '联系我们'}
      },
      {
        path: '/shopping',
        component: () => import('@/views/shopping/index'),
        name: 'Shopping',
        meta: {title: '下单'}
      },
      {
        path: '/applyAfterSales',
        component: () => import('@/views/center/afterSale/applyAfterSales'),
        name: 'applyAfterSales',
        meta: {title: '申请售后', hiddenClassify: true}
      },
      {
        path: '/integralRule',
        component: () => import('@/views/center/integral/rule'),
        name: 'IntegralRule',
        meta: {title: '积分规则', hiddenClassify: true}
      },
      {
        path: '/center',
        component: () => import('@/views/center/index'),
        name: 'Center',
        meta: {title: '个人中心', hiddenClassify: true},
        redirect: '/account',
        children: [
          {
            path: '/account',
            component: () => import('@/views/center/account/index'),
            name: 'Account',
            meta: {title: '账号管理'}
          },
          {
            path: '/notice',
            component: () => import('@/views/center/notice/index'),
            name: 'Notice',
            meta: {title: '消息通知'}
          },
          {
            path: '/integral',
            component: () => import('@/views/center/integral/index'),
            name: 'Integral',
            meta: {title: '我的积分'}
          },
          {
            path: '/address',
            component: () => import('@/views/center/address/index'),
            name: 'Address',
            meta: {title: '地址管理'}
          },
          {
            path: '/coupon',
            component: () => import('@/views/center/coupon/index'),
            name: 'Coupon',
            meta: {title: '优惠券'}
          },
          {
            path: '/order',
            component: () => import('@/views/center/order/index'),
            name: 'Order',
            meta: {title: '我的订单'}
          },
          {
            path: '/afterSale',
            component: () => import('@/views/center/afterSale/index'),
            name: 'AfterSale',
            meta: {title: '售后记录'}
          }]
      },
      {
        path: '/order-detail',
        component: () => import('@/views/center/order/detail'),
        name: 'Detail',
        meta: {title: '订单详情', hiddenClassify: true}
      },
      {
        path: '/order-comment',
        component: () => import('@/views/center/order/comment'),
        name: 'Comment',
        meta: {title: '订单评价', hiddenClassify: true}
      },
      {
        path: '/afterSale-detail',
        component: () => import('@/views/center/afterSale/detail'),
        name: 'afterSaleDetail',
        meta: {title: '售后详情', hiddenClassify: true}
      },
      {
        path: '/search',
        component: () => import('@/views/commodity/index'),
        name: 'Search',
        meta: {title: '搜索', hiddenClassify: true}
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

export default router;
