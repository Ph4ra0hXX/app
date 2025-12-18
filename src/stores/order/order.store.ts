import { defineStore } from "pinia";
import type { Product } from "@/stores/product/product.types";

export const useOrderStore = defineStore("order", {
  state: () => ({
    items: [] as any[],
  }),

  getters: {},

  actions: {
    addProduct(product: Product) {
      const orderProduct = {
        productId: product.id,
        productName: product.name,
        options: [] as any[],
      };

      product.options.forEach((option) => {
        option.items.forEach((item) => {
          // ✅ CHECKBOX
          if (item.type === "checkbox" && (item.checked || item.obrigatory)) {
            orderProduct.options.push({
              categoryName: option.categoryName,
              itemName: item.name,
              quantity: 1,
              unitPrice: item.price,
              totalPrice: item.price,
            });
          }

          // ✅ QUANTITY
          if (item.type === "quantity" && item.quantity > 0) {
            orderProduct.options.push({
              categoryName: option.categoryName,
              itemName: item.name,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.quantity * item.price,
            });
          }
        });
      });

      this.items.push(orderProduct);

      console.log(JSON.stringify(this.items, null, 2));
    },

    clearOrder() {
      this.items = [];
    },
  },
});
