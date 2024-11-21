<template>
  <view>
    <web-view :src="src"></web-view>
  </view>
</template>
<script setup lang="ts">
  import { ref } from 'vue'

  const src = ref<string>('https://young-3303.github.io/forever_young/')
</script>
