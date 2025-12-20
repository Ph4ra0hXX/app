<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const message = ref("");
const type = ref<"success" | "error" | "info">("success");

function showToast(
  msg: string,
  toastType: "success" | "error" | "info" = "success",
  duration = 2500
) {
  message.value = msg;
  type.value = toastType;
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, duration);
}

// Expose for global use
defineExpose({ showToast });
</script>

<style scoped>
.toast {
  position: fixed;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 200px;
  max-width: 400px;
  padding: 16px 24px;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  opacity: 0.95;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.toast.success {
  background: #4caf50;
}
.toast.error {
  background: #e74c3c;
}
.toast.info {
  background: #3498db;
}

/* Animação de entrada/saída */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-30px) scale(0.95);
}
.toast-fade-enter-to {
  opacity: 0.95;
  transform: translateX(-50%) translateY(0) scale(1);
}
.toast-fade-leave-from {
  opacity: 0.95;
  transform: translateX(-50%) translateY(0) scale(1);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-30px) scale(0.95);
}
</style>
