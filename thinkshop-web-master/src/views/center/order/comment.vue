<script setup>
import {getOrderDetails} from '@/api/order'
import {productComment} from '@/api/product'
import { useI18n} from 'vue-i18n'
import { formatDateTime, formatPrice } from "@/utils/index.js"
import {CameraOutlined} from '@ant-design/icons-vue';
import useUserStore from '@/store/modules/user'

const useUser = useUserStore()
const {proxy} = getCurrentInstance()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const orderDetail = ref({details: []})
// 上传图片列表
const requestHeaders = {
  Authorization: 'Bearer ' + useUser.token
}
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload"); // 上传的图片服务器地址
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const commentNum = computed(() => {
  return orderDetail.value.details.filter(it => it.score>0)?.length || 0
})

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async file => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
// 提交评论
function submitComment() {
  const { id, details } = orderDetail.value
  const path = route.query.form==='center'?'':`-detail?id=${id}`
  const commentSet = details.map(it => {
    return {
      skuId: it.skuId,
      productId: it.productId,
      comment: it.comment,
      score: it.score,
      imageUrls: it.fileList.map(file => file.response.data.url)
    }
  })
  productComment({orderId: id, commentSet}).then(r => {
    proxy.$message.success(t('order.commentSuc'))
    router.push(`/order${path}`)
  })
}
function init() {
  getOrderDetails(route.query.id).then(r => {
    const rData = r.data
    rData.details.forEach(it => {it.fileList = []})
    orderDetail.value = rData
  })
}

init()
</script>

<template>
  <div class="p-comment">
    <div class="comment-num">
      {{$t('order.writeComment')}}<span>{{commentNum}}/{{ orderDetail.details.length }}</span>
    </div>
    <div class="listing" v-for="item in orderDetail.details">
      <div class="listing-top">
        <div class="listing-left">
          <div class="listing-tit">{{t('order.commodityList')}}</div>
          <div class="listing-num">{{t('order.quantity')}}</div>
        </div>
        <div class="listing-total">{{t('order.subtotal')}}</div>
      </div>
      <div class="list-product">
        <div class="product-item">
          <div class="product-left">
            <div class="product-img">
              <img :src="item.image" class="pic-img default-img">
              <div class="product-info">
                <div class="product-tit-sku">
                  <div class="product-tit">{{item.productName}}</div>
                  <div class="product-sku">
                    <span class="sku-tit">{{t('order.sku')}}：</span>
                    <span class="sku-value">{{item.sku}}</span>
                  </div>
                </div>
                <div class="product-amount">{{formatPrice(item.originalPrice)}}</div>
              </div>
            </div>
            <div class="product-num">{{item.num}}</div>
          </div>
          <div class="product-total">{{formatPrice(item.price)}}</div>
        </div>
      </div>
      <div class="comment-cell">
        <a-flex :gap="16" align="center" class="mb32">
          <p class="label required">{{ $t('order.comment') }}</p>
          <a-rate
            v-model:value="item.score"
            :allowHalf="true"
          />
        </a-flex>
        <a-flex :gap="16" class="mb32">
          <p class="label">{{ $t('order.commentCon') }}</p>
          <a-textarea
            style="flex: 1;"
            :rows="8"
            v-model:value="item.comment"
            :maxlength="500"
          />
        </a-flex>
        <a-flex :gap="16">
          <p class="label">{{ $t('order.uploadImg') }}</p>
          <div style="flex: 1;">
            <a-upload
                :headers="requestHeaders"
                v-model:file-list="item.fileList"
                :action='uploadImgUrl'
                accept="image/*"
                multiple
                :maxCount="9"
                list-type="picture-card"
                @preview="handlePreview"
            >
              <div v-if="item.fileList.length < 9">
                <CameraOutlined style="font-size: 32px"/>
                <div style="margin-top: 8px">{{t('afterSale.uploadPhotos')}}</div>
              </div>
            </a-upload>
            <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage"/>
            </a-modal>
            <div class="number-uploads">{{t('afterSale.inAll')}}<b>{{item.fileList.length}}</b>{{t('afterSale.severalPiecesOf')}}<b>{{9 - item.fileList.length}}</b>{{t('afterSale.piece')}}</div>
          </div>
        </a-flex>
      </div>
    </div>
    <div class="btn">
      <a-button
        class="s-btn"
        style="width: 156px;"
        @click="submitComment"
        :disabled="commentNum!==orderDetail.details.length"
      >{{ $t('order.submit') }}</a-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.p-comment {
  width: 800px;
  margin: 30px auto 100px;
  .mb32 {
    margin-bottom: 32px;
  }
  .comment-num {
    font-size: 20px;
    margin-bottom: 32px;
    span {
      font-size: 14px;
      color: #8C8C8C;
      margin-left: 8px;
    }
  }
  .listing {
    margin-bottom: 64px;
    &:last-child {
      margin-bottom: 32px;
    }
    .listing-top {
      display: flex;
      font-weight: 600;
      font-size: 16px;
      color: #262626;
      border-bottom: 1px solid #E5E5E5;
      padding-bottom: 10px;
      margin-bottom: 15px;
      justify-content: space-between;
      .listing-left {
        flex: 2;
        display: flex;
        .listing-num {
          width: 150px;
        }
      }
      .listing-total {
        flex: 1;
        text-align: right;
      }
      .listing-tit {
        width: 500px;
      }
    }
    .list-product {
      .product-item {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #E5E5E5;
        .product-left {
          flex: 2;
          display: flex;
          .product-img {
            display: flex;
            width: 500px;
            img {
              width: 98px;
              height: 110px;
              margin-right: 12px;
            }
          }
          .product-num {
            width: 150px;
          }
          .product-amount {
            flex: 1;
            display: flex;
            flex-flow: column-reverse;
          }
          .product-info {
            color: #262626;
            font-size: 14px;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            .product-tit {
              font-weight: 600;
              margin-bottom: 15px;
            }
            .product-sku {
              font-weight: 400;
              display: flex;
              align-items: center;
              .sku-tit {
                font-size: 12px;
                color: #666666;
              }
              .sku-value {
                color: #262626;
              }
            }
            .product-amount {
              color: #666666;
            }
          }
        }
        .product-total {
          flex: 1;
          text-align: right;
        }
      }
    }
    .comment-cell {
      .label {
        width: 80px;
        font-size: 14px;
        color: #262626;
        &.required::before {
          content: '*';
          color: #FD2A53;
        }
      }
      .number-uploads {
        b {
          margin: 0 2px;
        }
      }
    }
  }
  .btn {
    text-align: right;
  }
}
</style>