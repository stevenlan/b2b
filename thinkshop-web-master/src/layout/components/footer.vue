<template>
  <div class="c-footer">
    <h2 class="section-title">LOST ANGEL</h2>
    <div class="main-con w-width">
      <a-flex justify="space-between">
        <div class="footer-col brand-info bold">
          <p>Lost Angel is a disposable fashionablevape brand carefully created by COILART,a world-renowned vape brand team. TheCOILART team adheres to the productconcept of “fashionable appearance andultimate taste first”</p>
        </div>
        <div class="footer-col links bold">
          <h4>CUSTOMER SUPPORT</h4>
          <ul>
            <li v-for="item in customerSupportLinks" :key="item.title"><a :href="item.url">{{ item.title }}</a></li>
          </ul>
        </div>
        <div class="footer-col contact-info">
          <h4>CONTACT INFO</h4>
          <p><strong>Address:</strong><br>156 W 228th Street, Unit A, Torrance, CA 90501</p>
          <p><strong>Email:</strong><br>Wholesale@lostangelvape.com(Wholesale)<br>spain@lostangelvape.com(Spanish)<br>russia@lostangelvape.com(Russia)</p>
          <a-button class="chat-btn">Chat online</a-button>
        </div>
      </a-flex>
      <share-brands/>
    </div>
    <p class="copyright">Copyright 2025 All Rights Reserved</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import shareBrands from '@/components/shareBrands/index.vue'
const customerSupportLinks = ref([{
    title:'About Us',
    url:'/#/aboutUs'
  },
  {
    title:'Contact Us',
    url:'/#/contactUs'
  },
  {
    title:'Download',
    url:''
  }]);
</script>

<style lang="scss" scoped>
.c-footer {
  padding: 0px 0 30px;
  margin-top: 80px;
  .section-title{
    width: 66%;
    margin: 0 auto 25px;
    font-weight: 800;
    font-size: 30px;
  }

  .main-con {
    margin: 0 auto;
    width: 76%;
    padding: 30px 0;
    border-top: 1px solid;
    border-bottom: 1px solid;
    margin-bottom: 35px;
  }

  .footer-col {
    width: 30%;
    &.brand-info p {
      line-height: 1.8;
    }
    h4 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 24px;
      color: #000;
    }
    &.links ul {
      list-style: none;
      padding: 0;
      li {
        margin-bottom: 16px;
        a {
          color: #000;
          text-decoration: none;
          &:hover { text-decoration: underline; }
        }
      }
    }
    &.contact-info p {
      line-height: 1.8;
      color: #000;
      margin-bottom: 16px;
    }
    .chat-btn {
      background-color: #0d1a33;
      color: white;
      border-radius: 8px;
      height: 40px;
      padding: 0 24px;
    }
  }

  .ant-divider {
    margin: 40px 0;
  }

  .copyright {
    text-align: center;
    color: #999;
  }
}
.bold{
  font-weight: bold;
}
</style>
