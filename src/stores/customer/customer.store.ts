import { defineStore } from "pinia";

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
