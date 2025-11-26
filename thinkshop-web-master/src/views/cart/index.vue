<template>
  <div class="cart">
    <a-flex class="t-box" justify="space-between" align="end">
      <div class="m-title">
        {{$t('commodity.cart')}}
        <span>{{$t('commodity.total')}}{{cartData.total}}{{$t('commodity.goodNum')}}</span>
      </div>
      <div class="fun-text cursor-p" @click="manage=!manage">{{manage?$t('commodity.finish'):$t('commodity.manage')}}</div>
    </a-flex>
    <div class="card-product" v-if="cartData.total">
      <a-flex class="header">
        <p>{{$t('commodity.myGoods')}}</p>
        <p>{{$t('commodity.price')}}</p>
        <p>{{$t('commodity.num')}}</p>
      </a-flex>
      <ul class="pro-list">
        <li v-for="(it, i) in cartData.rows" :key="i" class="pro-item">
          <a-flex>
            <div class="item">
              <a-flex :gap="12" align="start">
                <a-checkbox v-model:checked="it.checked" @change="refreshALl"/>
                <div class="img-cell">
                  <img :src="it.image"/>
                  <div class="uneffect" v-if="it.isLapse===1 || it.isShow===0">
                    <div>{{$t(`commodity.${it.isLapse===1?'isLapse':'isShow'}`)}}</div>
                  </div>
                </div>
                <a-flex class="info" :vertical="true" justify="space-between">
                  <p>{{it.productName}}</p>
                  <p><span>{{$t('commodity.sku')}}：</span>{{it.sku}}</p>
                  <p>
                    <span v-if="manage" class="cursor-p" @click="handleDel(it)">
                      <i class="iconfont icon-guanbi"/>{{$t('commodity.remove')}}
                    </span>
                  </p>
                </a-flex>
              </a-flex>
            </div>
            <div class="item"><font>{{currency}}</font>{{formatPrice(it.price)}}</div>
            <div class="item">
              <p>
                <span @click="changeNum(it, -1)">－</span>
                <span>{{it.num}}</span>
                <span @click="changeNum(it, 1)">＋</span>
              </p>
            </div>
          </a-flex>
        </li>
      </ul>
      <a-flex class="b-box" justify="space-between" align="center">
        <div class="select">
          <a-checkbox @change="selectAll" v-model:checked="checkedAll"/>
          <span>{{$t('commodity.selectAll')}}</span>
        </div>
        <div class="fun-btn">
          <p v-if="!manage">{{$t('commodity.totalNum')}}：<span><font>{{currency}}</font>{{formatPrice(totalPrice)}}</span></p>
          <a-button class="s-btn" @click="handleCart">{{manage?$t('commodity.del'):$t('commodity.toBuy')}}</a-button>
        </div>
      </a-flex>
    </div>
    <div class="empty" v-if="!cartData.total && !loading">
      <img :src="emptyIcon" alt=""/>
      <p>{{$t('commodity.noCarts')}}</p>
      <router-link to="/index">
        <a-button class="s-btn">{{$t('commodity.continueBuy')}}</a-button>
      </router-link>
    </div>
    <!-- 删除购物车弹框 -->
    <a-modal
      v-model:open="open"
      :footer="null"
      class="c-modal"
      width="350px"
      @cancel="cancel"
    >
      <div class="modal-con">
        <p>{{$t('common.tip')}}</p>
        <p>{{$t('commodity.delOk')}}</p>
        <a-button class="s-btn" @click="confirm">{{$t('common.confirm')}}</a-button>
        <a-button class="s-btn" @click="cancel">{{$t('common.cancel')}}</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import emptyIcon from '@/assets/images/empty_good.png'
import {queryCart, updateCart, delCart} from '@/api/cart'
import useCommodityStore from '@/store/modules/commodity'
import useSettingStore from '@/store/modules/setting'
import {formatPrice} from "@/utils/index.js";

const useStore = useCommodityStore()
const {proxy} = getCurrentInstance()
const router = useRouter()
const currency = ref(useSettingStore().global.currencySymbol || '')

// 管理购物车
const manage = ref(false)
const loading = ref(false)
const cartData = ref({
  total: 0,
  rows: []
})
// 全选
const checkedAll = ref(false)
const open = ref(false)
// 缓存要删除的商品
const delItem = ref({})

// 总价格
const totalPrice = computed(() => {
  let r = 0
  cartData.value.rows.forEach(it => {
    if(it.checked) {
      r+=it.num*it.price
    }
  })
  return r
})

function refreshALl() {
  checkedAll.value = !cartData.value.rows.some(it => !it.checked)
}
function selectAll(e) {
  cartData.value.rows.forEach(it => {
    it.checked = e.target.checked
  })
}
// 购物车数据
function initData() {
  loading.value = true
  queryCart().then(r => {
    const {rows, total} = r
    cartData.value = {rows, total}
    loading.value = false
    useStore.getCart(total)
  })
}
// 结算或批量删除
function handleCart() {
  const selectedList = cartData.value.rows.filter(it => !!it.checked)
  if(!selectedList.length) {
    proxy.$message.warn(proxy.$t(`commodity.${manage.value?'del':'buy'}Msg`))
    return
  }
  // 删除
  if(manage.value) {
    handleDel()
  } else {
    const unEffect = selectedList.some(it => it.isLapse===1||it.isShow===0)
    if(unEffect) return proxy.$message.warn(proxy.$t(`commodity.buyTip`))
    router.push({
      path: '/shopping',
      query: {
        cartIds: selectedList.map(it=>it.cartId).join(',')
      }
    })
  }
}
// 删除购物车
function handleDel(item={}) {
  delItem.value = item
  open.value = true
}
// 关闭删除确认框
function cancel() {
  open.value = false
  delItem.value = {}
}
// 确认删除
function confirm() {
  const cartIds = []
  if(delItem.value.cartId) {
    cartIds.push(delItem.value.cartId)
  } else {
    cartData.value.rows.forEach(it => {
      if(it.checked) cartIds.push(it.cartId)
    })
  }
  delCart({cartIds: cartIds.join(',')}).then(r => {
    proxy.$message.success(proxy.$t('commodity.delSuc'))
    cancel()
    initData()
  })
}
// 改变购物车商品数量
function changeNum(it, v) {
  const {num, cartId} = it
  if(num===1&&v==-1) return
  updateCart({cartId, num: num+v}).then(r => {
    if(v==1) it.num++
    if(v==-1) it.num--
  })
}

initData()
</script>

<style scoped lang="scss">
.cart {
  width: 800px;
  margin: 30px auto 100px;

  .t-box {
    font-size: 14px;
    .m-title {
      font-size: 20px;
      span {
        font-size: 14px;
        color: #8C8C8C;
        margin-left: 8px;
      }
    }
  }
  .card-product {
    margin-top: 26px;
    .header {
      border-bottom: 1px #E5E5E5 solid;
      padding-bottom: 12px;
      p {
        font-weight: 600;
        font-size: 16px;
        flex: 1;
        &:nth-of-type(1) {
          flex: 2.5;
        }
        &:nth-of-type(3) {
          text-align: right;
        }
      }
    }
    .pro-list {
      margin-bottom: 24px;
      .pro-item {
        padding: 24px 0;
        position: relative;
        &::after {
          content: '';
          height: 1px;
          width: calc(100% - 28px);
          background: #E5E5E5;
          position: absolute;
          bottom: 0;
          left: 28px;
        }
        .item {
          flex: 1;
          &:nth-of-type(1) {
            flex: 2.5;
            .img-cell {
              height: 110px;
              width: 98px;
              position: relative;
              img {
                height: 100%;
                width: 100%;
              }
              .uneffect {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background: rgba(255, 255, 255, .5);
                display: flex;
                align-items: center;
                justify-content: center;
                div {
                  width: 56px;
                  height: 56px;
                  background: rgba(0,0,0,0.5);
                  border-radius: 50%;
                  font-weight: 600;
                  font-size: 12px;
                  color: #FFFFFF;
                  text-align: center;
                  line-height: 56px;
                }
              }
            }
            .info {
              flex: 1;
              height: 110px;
              p {
                flex: 1;
                &:nth-of-type(1) {
                  font-weight: 600;
                  font-size: 14px;
                }
                &:nth-of-type(2) {
                  span {
                    color: #666666;
                  }
                  font-size: 12px;
                }
                &:nth-of-type(3) {
                  align-content: flex-end;
                  font-size: 12px;
                  color: #8C8C8C;
                  .iconfont {
                    vertical-align: text-top;
                  }
                }
              }
            }
          }
          &:nth-of-type(2) {
            font-size: 14px;
            font-weight: 600;
          }
          &:nth-of-type(3) {
            text-align: right;
            p {
              display: inline-block;
              border-radius: 2px;
              border: 1px #262626 solid;
              padding: 8px;
              span {
                font-size: 12px;
                &:first-child, &:last-child {
                  font-size: 16px;
                  display: inline-block;
                  height: 16px;
                  width: 16px;
                  text-align: center;
                  line-height: 16px;
                  border-radius: 50%;
                  background: #F5F5F5;
                  color: #A9A9B2;
                  &:hover {
                    cursor: pointer;
                  }
                }
                &:last-child {
                  background: #262626;
                  color: #FFFFFF;
                }
                &:nth-child(2) {
                  padding: 0 5px;
                  color: #8C8C8C;
                }
              }
            }
          }
        }
      }
    }
    .b-box {
      height: 76px;
      padding: 0 16px;
      background: #FAFAFA;
      border-radius: 2px 2px 2px 2px;
      .select {
        font-size: 14px;
        color: #8C8C8C;
        span {
          margin-left: 12px;
        }
      }
      .fun-btn {
        p {
          display: inline-block;
          margin-right: 24px;
          font-size: 14px;
          span {
            font-weight: 600;
          }
        }
        .s-btn {
          width: 152px;
        }
      }
    }
  }

  .empty {
    margin-top: 120px;
    text-align: center;
    img {
      width: 100px;
      height: 100px;
    }
    p {
      font-size: 14px;
      color: #8C8C8C;
      margin: 4px 0 12px;
    }
    .s-btn {
      display: inline-block;
      width: auto;
      height: 32px;
      padding: 0 10px;
    }
  }
}
.modal-con {
  text-align: center;
  p {
    font-size: 14px;
    margin-bottom: 32px;
    &:nth-of-type(1) {
      font-size: 20px;
      margin-top: 20px;
    }
  }
  .s-btn {
    &:nth-of-type(2) {
      border: 1px #262626 solid;
      background: #FFFFFF;
      color: #262626;
      margin-top: 16px;
    }
  }
}
</style>
