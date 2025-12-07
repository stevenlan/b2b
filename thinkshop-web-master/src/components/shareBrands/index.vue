<template>
  <div class="social-icons">
    <a v-for="icon in socialIcons" :key="icon.name" :href="icon.link" :style="{backgroundColor:icon.color}" style="text-decoration:none" target="_blank">
      <span class="iconfont" :class="[icon.class]"/>
    </a>
  </div>
</template>

<script setup>

const socialIcons = ref([
  { name: 'X',class:'icon-tweer', link: `test?url=${window.location.href}` ,color:'#000'},
  { name: 'Facebook',class:'icon-facebook', link: `test?url=${window.location.href}` ,color:'#264bb5'},
  { name: 'Twitter',class:'icon-TwitterLogo-16px', link: `test?url=${window.location.href}` ,color:'#12b2d6'}, // Assuming the third icon is Twitter
  { name: 'Instagram',class:'icon-instagram', link: `test?url=${window.location.href}` ,color:'#d4398f'},
]);
</script>

<style scoped lang='scss'>
@font-face {
  font-family: "iconfont";
  src: url('iconfont.ttf?t=1765097761079') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 21px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-instagram:before {
  content: "\e87f";
}

.icon-facebook:before {
  content: "\e6e5";
}

.icon-TwitterLogo-16px:before {
  content: "\e99d";
}

.icon-tweer:before {
  content: "\e651";
}
.social-icons {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 20px;
  a {
    font-size: 24px;
    color: #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
