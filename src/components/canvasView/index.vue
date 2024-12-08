<template >
  <view>
    <web-view @load="webviewLoaded" :src="props.src"></web-view>
  </view>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  // const src = ref<string>('https://young-3303.github.io/forever_young/')
  const props = withDefaults(defineProps<{
    src: string
  }>(), {
    src: ''
  })
  const emits = defineEmits(['webviewLoaded'])
  function webviewLoaded() {
    emits('webviewLoaded')
  }
</script>
