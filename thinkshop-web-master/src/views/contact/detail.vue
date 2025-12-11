<template>
  <div class="w-width main-con">
    <section galleryitems="1" data-section="section" block-items-num="3" data-screen="screen-large" class="section-contact-wrap-block section-block-yh-contact1" id="sectionIdy2wdybu">
      <div class="layout title-bar">
        <h2 class="title" heading-type="1"><strong content-text="1">Contact Us</strong></h2>
      </div>
      <div class="layout contact-content" style="text-align: center;">
        <h3 class="title" heading-type="1"><strong content-text="1">COILART INC</strong></h3>
        <div class="contact-items aos-init aos-animate" style="display: flex;" data-unable="yh-contact1" data-aos="fadeInUp" data-aos-duration="1000">
          <div class="block-item contact-item" style="width: 33%;">
            <div class="contact-item-content">
              <div class="item-img" itemscope="1" itemtype="http://schema.org/ImageObject">
                <img src="https://ecdn6.globalso.com/upload/p/1272/image_other/2024-03/6603d6f9e6e2972073.png" alt="address1x5e" itemprop="image">
              </div>
              <div class="item-title">Address</div>
              <div class="item-desc">1536 W 228th Street, Unit A, Torrance, CA 90501</div>
            </div>
          </div>
          <div class="block-item contact-item" style="width: 34%;">
            <div class="contact-item-content">
              <div class="item-img" itemscope="1" itemtype="http://schema.org/ImageObject">
                <img src="https://ecdn6.globalso.com/upload/p/1272/image_other/2024-03/6603d7010f17875938.png" alt="email-fillt7o" itemprop="image">
              </div>
              <div class="item-title">E-mail</div>
              <a href="mailto:wholesale@lostangelvape" class="item-desc">
                <div>Business:<div>&nbsp;wholesale@lostangelvape.com(Wholesale)</div></div>
              </a>
              <a href="mailto:marketing@lostangelvape.com" class="item-desc">
                <div>
                  <div>spain@lostangelvape.com (Spain)</div>
                  <div>russia@lostangelvape.com（Russia）</div>
                </div>
              </a>
            </div>
          </div>
          <div class="block-item contact-item" style="width: 33%;">
            <div class="contact-item-content">
              <div class="item-img" itemscope="1" itemtype="http://schema.org/ImageObject">
                <img src="https://ecdn6.globalso.com/upload/p/1272/image_other/2024-03/6603d709dbc0325366.png" alt="WhatsAppptu" itemprop="image">
              </div>
              <div class="item-title">WhatsApp</div>
              <div class="item-desc">Chat Online</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {formatDateTime} from "@/utils/index.js";
import {newsDetail} from '@/api/home'
import useCommodityStore from '@/store/modules/commodity'
import useSettingStore from '@/store/modules/setting'

import 'swiper/css'

const router = useRouter()
const useStore = useCommodityStore()
const {proxy} = getCurrentInstance()
const currency = ref(useSettingStore().global.currencySymbol || '')

// const detail = ref([])

// 商品详情
// function getDetail() {
//   const {params={}} = router.currentRoute?.value
//   newsDetail(params.newsId).then(res => {
//     detail.value = res.data
//   })
// }

// getDetail()
</script>

<style scoped lang="scss">
.main-con {
  margin: 0 auto;
  min-width: 1100px;
  .section-block-yh-contact1 {
    padding: 4rem 0;
  }
  .section-block-yh-contact1 .title-bar .title {
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.5;
    color: #002140;
  }
  .section-block-yh-contact1 .contact-content {
    padding: 10% 0;
    background-image: url(https://ecdn6.globalso.com/upload/p/2/image_other/2023-12/6572e052e908168675.png);
    background-position: center 60px;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
  }
  .section-block-yh-contact1 .contact-content .title {
    font-size: 2.2rem;
    text-align: center;
    letter-spacing: 2px;
    line-height: 1.5;
  }
  .section-block-yh-contact1 .contact-content .contact-items {
    display: flex;
    flex-wrap: wrap;
  }
  .section-block-yh-contact1 .contact-items .contact-item {
    padding: 0.8rem;
  }
  .section-block-yh-contact1 .contact-item .contact-item-content {
    border-radius: 10px;
    box-shadow: 3px 5px 8px #c1c1c1;
    text-align: center;
    height: 100%;
  }
  .section-block-yh-contact1 .contact-item .contact-item-content .item-img {
    padding-top: 30px;
    padding-bottom: 8px;
    transition: transform 1s;
  }
  .section-block-yh-contact1 .contact-item .contact-item-content .item-img:hover {
    transform: rotateY(360deg);
  }
  .section-block-yh-contact1 .contact-item .contact-item-content .item-title {
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 1.5;
    color: #ff0101;
  }
  .section-block-yh-contact1 .contact-item .contact-item-content .item-desc {
    font-size: 1.1rem;
    line-height: 1.5;
    padding: 25px 10px;
    display: block;
  }
  #sectionIdy2wdybu > .layout.contact-content {
    padding-top: 45.297px;
    padding-bottom: 45.297px;
  }
  #sectionIdy2wdybu > .layout.contact-content > .contact-items > .block-item.contact-item > .contact-item-content > .item-desc {  
    padding-top: 10px;
    padding-bottom: 10px;
    color: rgb(0, 0, 0);
  }
  #sectionIdy2wdybu > .layout.contact-content > .contact-items > .block-item.contact-item > .contact-item-content > .item-title {
    color: rgb(216, 191, 216);
  }
  #sectionIdy2wdybu {
    background-color: rgb(255, 255, 255);
  }
  #sectionIdy2wdybu > .layout.contact-content > .contact-items > .block-item.contact-item > .contact-item-content > .item-desc > div {
    color: rgb(0, 0, 0);
  }
  #sectionIdy2wdybu > .layout.contact-content > .title {
    color: rgb(0, 0, 0);
  }
  #sectionIdy2wdybu > .layout.contact-content > .contact-items > .block-item.contact-item > .contact-item-content > .item-desc > .item-desc {
    height: auto;
    padding-top: 0px;
    padding-bottom: 0px;
    padding-right: 0px;
    padding-left: 0px;
  }
}
</style>
