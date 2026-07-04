<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    variant?: "primary" | "secondary";
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    disabled: false,
  }
);
</script>

<template>
  <button class="app-button" :class="variant" :disabled="disabled">
    {{ label }}
  </button>
</template>

<style scoped>
.app-button {
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
}

.primary {
  background: #fdd426;
  color: #000;
  border: none;
}

.secondary {
  background: none;
  color: #ffffff;
  border: 1px solid #fdd426;
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
