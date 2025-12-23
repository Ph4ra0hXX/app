<script setup lang="ts">
defineOptions({
  name: "logoUrl",
});

defineProps<{
  url: string;
  alt?: string;
}>();
</script>

<template>
  <div class="container">
    <img :src="url" :alt="alt ?? 'Logo'" class="logo" />
  </div>
</template>

<style scoped>
.container {
  margin-top: 80px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  max-width: 250px;
  max-height: 250px;
  width: auto;
  height: auto;
  object-fit: contain;
}
</style>
