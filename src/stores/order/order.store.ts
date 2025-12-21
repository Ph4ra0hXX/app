import { defineStore } from "pinia";
import type { Product } from "@/stores/product/product.types";
import { useProductStore } from "@/stores/product/product.store";

export const useOrderStore = defineStore("order", {
  state: () => ({
    items: [] as any[],
    editingProductData: null as any,
    editingProductIndex: null as number | null,
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

      // Só adicionar se tiver itens
      if (orderProduct.options.length > 0) {
        // Se estava editando, substituir o item
        if (this.editingProductIndex !== null && this.editingProductData) {
          this.items[this.editingProductIndex] = orderProduct;
          this.editingProductIndex = null;
          this.editingProductData = null;
        } else {
          // Caso contrário, adicionar novo item
          this.items.push(orderProduct);
        }
      }

      console.log(JSON.stringify(this.items, null, 2));
    },

    clearOrder() {
      this.items = [];
    },

    editProduct(productIndex: number) {
      const productStore = useProductStore();
      const orderProduct = this.items[productIndex];

      if (!orderProduct) return;

      // Armazenar os dados originais e o índice
      this.editingProductData = JSON.parse(JSON.stringify(orderProduct));
      this.editingProductIndex = productIndex;

      const product = productStore.getProductById(orderProduct.productId);
      if (!product) return;

      // Reconstituir os itens selecionados no produto
      product.options.forEach((option) => {
        option.items.forEach((item) => {
          // Procurar item nas opções do pedido
          const orderItem = orderProduct.options.find(
            (opt: any) =>
              opt.itemName === item.name &&
              opt.categoryName === option.categoryName
          );

          if (orderItem) {
            if (item.type === "checkbox") {
              item.checked = true;
            } else if (item.type === "quantity") {
              item.quantity = orderItem.quantity;
            }
          } else {
            // Resetar itens não selecionados
            if (item.type === "checkbox") {
              item.checked = Boolean(item.obrigatory);
            } else if (item.type === "quantity") {
              item.quantity = 0;
            }
          }
        });
      });

      return orderProduct.productId;
    },

    cancelEdit() {
      this.editingProductData = null;
      this.editingProductIndex = null;
    },

    removeProduct(productIndex: number) {
      // Se estiver removendo o produto que está sendo editado
      if (this.editingProductIndex === productIndex) {
        this.editingProductIndex = null;
        this.editingProductData = null;
      }

      this.items.splice(productIndex, 1);
    },
  },
});
