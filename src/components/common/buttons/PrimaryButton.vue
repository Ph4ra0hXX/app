<template>
  <button class="btn-primary">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<style scoped>
.btn-primary {
  margin-top: 15px;
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  border-radius: 25px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.15s ease;

  background: #fdd426;
  color: #000;
  border: none;
}
</style>
