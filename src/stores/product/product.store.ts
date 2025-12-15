import { defineStore } from "pinia";
import type { Product } from "@/types/product";

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
              {
                name: "Cheddar",
                price: 4.0,
                type: "checkbox",
                checked: false,
              },
              {
                name: "Mussarela",
                price: 3.0,
                type: "checkbox",
                checked: false,
              },
              {
                name: "Coalho",
                price: 2.0,
                type: "checkbox",
                checked: false,
              },
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
    getProductById: (state) => {
      return (id: number): Product | undefined =>
        state.products.find((p) => p.id === id);
    },
  },

  actions: {
    getAllProducts() {
      return this.products;
    },
  },
});
