// Toast composable para uso global com vue-toast-notification
import { useToast as useVueToast } from "vue-toast-notification";

export function useToast() {
  const $toast = useVueToast();

  function showToast(
    msg: string,
    type: "success" | "error" | "info" = "success",
    duration = 2500
  ) {
    $toast.open({
      message: msg,
      type: type,
      duration: duration,
      position: "top",
    });
  }

  return { showToast };
}
