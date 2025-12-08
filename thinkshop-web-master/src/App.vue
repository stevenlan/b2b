<template>
  <router-view/>
  <age-verity v-if="!useUser.token"/>
</template>

<script setup>
import AgeVerity from "@/layout/components/ageVerity.vue";
import useUserStore from "@/store/modules/user.js";
const useUser = useUserStore()
</script>

<style scoped>

</style>
