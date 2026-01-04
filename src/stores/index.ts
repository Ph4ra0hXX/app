import { defineStore } from "pinia";

export interface BaseItem {
  name: string;
  price: number;
  type: "checkbox" | "quantity";
  obrigatory?: boolean;
}

export interface CheckboxItem extends BaseItem {
  type: "checkbox";
  checked: boolean;
}

export interface QuantityItem extends BaseItem {
  type: "quantity";
  quantity: number;
  max: number;
}

export type OptionItem = CheckboxItem | QuantityItem;

export interface ProductOption {
  categoryName: string;
  items: OptionItem[];
  obrigatory?: boolean;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  options: ProductOption[];
}

export interface OrderItem {
  productId: number;
  productName: string;
  categoryName: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: {
      formaDeEntrega: "Vou buscar",
      formaDePagamento: "",
      nome: "",
      rua: "",
      bairro: "",
      numero: "",
      referencia: "",
      troco: null as number | null,
    },
  }),

  actions: {
    finalizeCustomer() {
      console.log("Pedido finalizado:", this.customer);
    },
  },
});

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [
      {
        id: 1,
        name: "ESFIRRAS",
        image: "foods/food1.webp",
        description: "Saborosas esfirras doces e salgadas",
        options: [
          {
            categoryName: "Pão",
            items: [
              {
                name: "Pão Árabe",
                price: 3.0,
                type: "checkbox",
                checked: false,
                obrigatory: false,
              },
              {
                name: "Pão Bola",
                price: 2.0,
                type: "checkbox",
                checked: false,
              },
              {
                name: "Pão Brioche",
                price: 3.0,
                type: "checkbox",
                checked: false,
              },
            ],
          },
          {
            categoryName: "Queijo",
            items: [
              { name: "Cheddar", price: 4.0, type: "checkbox", checked: false },
              {
                name: "Mussarela",
                price: 3.0,
                type: "checkbox",
                checked: false,
              },
              { name: "Coalho", price: 2.0, type: "checkbox", checked: false },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "teste",
        image: "foods/food1.webp",
        description: "Saborosas e salgadas",
        options: [
          {
            categoryName: "Dough",
            items: [
              {
                name: "Pão Árabe",
                price: 3.0,
                type: "quantity",
                quantity: 0,
                max: 10,
              },
              {
                name: "Pão Bola",
                price: 2.0,
                type: "quantity",
                quantity: 0,
                max: 10,
              },
              {
                name: "Pão Brioche",
                price: 3.0,
                type: "quantity",
                quantity: 0,
                max: 10,
              },
            ],
          },
          {
            categoryName: "Cheese",
            items: [
              {
                name: "Cheddar",
                price: 4.0,
                type: "quantity",
                quantity: 0,
                max: 10,
              },
              {
                name: "Mussarela",
                price: 3.0,
                type: "quantity",
                quantity: 0,
                max: 10,
              },
              {
                name: "Coalho",
                price: 2.0,
                type: "quantity",
                quantity: 0,
                max: 10,
              },
            ],
          },
        ],
      },
    ],
  }),

  getters: {
    getProductById: (state) => (id: number) =>
      state.products.find((p) => p.id === id) as Product | undefined,
  },

  actions: {
    getAllProducts() {
      return this.products;
    },

    resetProductOptions(productId: number) {
      const product = this.products.find((p) => p.id === productId);
      if (!product) return;

      product.options.forEach((option) => {
        option.items.forEach((item) => {
          if (item.type === "checkbox") item.checked = Boolean(item.obrigatory);
          else if (item.type === "quantity") item.quantity = 0;
        });
      });
    },
  },
});

export const useOrderStore = defineStore("order", {
  state: () => ({
    items: [] as any[],
    editingProductIndex: null as number | null,
  }),

  actions: {
    addProduct(product: Product) {
      const orderProduct = {
        productId: product.id,
        productName: product.name,
        options: [] as any[],
      };

      product.options.forEach((option) => {
        option.items.forEach((item) => {
          if (item.type === "checkbox" && (item.checked || item.obrigatory)) {
            orderProduct.options.push({
              categoryName: option.categoryName,
              itemName: item.name,
              quantity: 1,
              unitPrice: item.price,
              totalPrice: item.price,
            });
          } else if (item.type === "quantity" && item.quantity > 0) {
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

      if (orderProduct.options.length > 0) {
        if (this.editingProductIndex !== null) {
          this.items[this.editingProductIndex] = orderProduct;
          this.editingProductIndex = null;
        } else {
          this.items.push(orderProduct);
        }
        console.log(JSON.stringify(this.items, null, 2));
      }
    },

    clearOrder() {
      this.items = [];
    },

    editProduct(productIndex: number) {
      const orderProduct = this.items[productIndex];
      if (!orderProduct) return;

      this.editingProductIndex = productIndex;
      const product = useProductStore().getProductById(orderProduct.productId);
      if (!product) return;

      product.options.forEach((option) => {
        option.items.forEach((item) => {
          const orderItem = orderProduct.options.find(
            (opt: any) =>
              opt.itemName === item.name &&
              opt.categoryName === option.categoryName
          );

          if (orderItem) {
            if (item.type === "checkbox") item.checked = true;
            else if (item.type === "quantity")
              item.quantity = orderItem.quantity;
          } else {
            if (item.type === "checkbox")
              item.checked = Boolean(item.obrigatory);
            else if (item.type === "quantity") item.quantity = 0;
          }
        });
      });

      return orderProduct.productId;
    },

    cancelEdit() {
      this.editingProductIndex = null;
    },

    removeProduct(productIndex: number) {
      if (this.editingProductIndex === productIndex)
        this.editingProductIndex = null;
      this.items.splice(productIndex, 1);
    },
  },
});
