// Toast composable para uso global
import { ref } from "vue";

const toastRef = ref<any>(null);

export function useToast() {
  function showToast(
    msg: string,
    type: "success" | "error" | "info" = "success",
    duration = 2500
  ) {
    toastRef.value?.showToast(msg, type, duration);
  }
  return { toastRef, showToast };
}
