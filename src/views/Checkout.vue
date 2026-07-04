<script setup lang="ts">
import { computed } from "vue";
import { useCustomerStore } from "@/stores";
import AppButton from "@/components/AppButton.vue";
import TextInput from "@/components/TextInput.vue";
import { useRouter } from "vue-router";

const customerStore = useCustomerStore();
const customer = computed(() => customerStore.customer);
const router = useRouter();

const deliveryOptions = [
  {
    id: "buscar",
    value: "Vou buscar",
    label: "Vou buscar",
    description: "grátis",
  },
  {
    id: "entrega",
    value: "Quero entrega",
    label: "Quero entrega",
    description: "taxa de entrega",
  },
];

const paymentOptions = [
  { id: "pix", value: "Pix", label: "PIX" },
  { id: "cartao", value: "Cartão", label: "Cartão" },
  { id: "dinheiro", value: "Dinheiro", label: "Dinheiro" },
];

const needsAddress = computed(
  () => customer.value.formaDeEntrega === "Quero entrega"
);

const validateCustomer = () => {
  if (!customer.value.nome) return "Informe seu nome";
  if (
    needsAddress.value &&
    (!customer.value.rua || !customer.value.numero)
  )
    return "Informe o endereço completo";
  if (!customer.value.formaDePagamento)
    return "Escolha a forma de pagamento";
  return "";
};

const finalizeOrder = () => {
  const error = validateCustomer();
  if (error) return alert(error);
  customerStore.finalizeCustomer();
};

const copyToClipboard = () => {
  navigator.clipboard.writeText("SUA_CHAVE_PIX_AQUI");
};

const goBack = () => router.push({ name: "order" });
</script>

<template>
  <div class="container">
    <div class="checkout-card">
      <div class="title">
        <p>
          <span>Como deseja receber</span> <br />
          seu pedido?
        </p>
      </div>

      <div class="payment-container">
        <div
          v-for="option in deliveryOptions"
          :key="option.id"
          class="price-card"
        >
          <input
            v-model="customer.formaDeEntrega"
            :value="option.value"
            type="radio"
            :id="option.id"
          />
          <div class="content">
            {{ option.label }}
            <span>{{ option.description }}</span>
          </div>
          <label :for="option.id"></label>
        </div>
      </div>

      <div class="detail-info">
        <TextInput v-model="customer.nome" label="Seu Nome:" />
        <br />

        <div v-if="needsAddress">
          <TextInput v-model="customer.rua" label="Rua:" />
          <br />

          <TextInput v-model="customer.bairro" label="Bairro:" />
          <br />

          <TextInput v-model="customer.numero" type="number" label="Número:" />
          <br />

          <TextInput v-model="customer.referencia" label="Referência:" />
          <br />
        </div>

        <div class="info">
          <h3>Forma de Pagamento:</h3>
        </div>

        <div class="payment-container">
          <div
            v-for="option in paymentOptions"
            :key="option.id"
            class="price-card"
          >
            <input
              v-model="customer.formaDePagamento"
              :value="option.value"
              type="radio"
              :id="option.id"
            />
            <div class="content">{{ option.label }}</div>
            <label :for="option.id"></label>
          </div>
        </div>

        <div v-if="customer.formaDePagamento === 'Pix'">
          <AppButton
            label="Copiar PIX"
            variant="secondary"
            @click="copyToClipboard"
          />
        </div>

        <div v-if="customer.formaDePagamento === 'Dinheiro'">
          <TextInput
            v-model="customer.troco"
            type="number"
            label="Troco?"
            placeholder="Troco para quanto?"
          />
        </div>

        <p id="textDescritivo">
          Caso tenha escolhido entrega, o valor<br />
          de R$ 4,00 será somado ao total.
        </p>

        <AppButton @click="finalizeOrder" label="Finalizar Pedido" />
        <AppButton label="Voltar" variant="secondary" @click="goBack" />
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkout-card {
  width: 100%;
  max-width: 520px;
  border-radius: 20px;
  padding: 24px;
  overflow-x: hidden;
  border: 1px solid #2a2a2a;
}

.title p {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: #ffffff;
  margin-bottom: 24px;
}
.title span {
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
}

.payment-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.price-card {
  position: relative;
  background: #242424;
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  transition: background 0.2s ease, border 0.2s ease;
  border: 2px solid transparent;
  min-width: 0;
}

.price-card:hover {
  background: #2a2a2a;
}
.price-card input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.price-card .content {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.price-card .content span {
  font-size: 12px;
  font-weight: 400;
  color: #9ca3af;
  margin-top: 4px;
}

.price-card input:checked ~ label {
  border-color: #ffd600;
}
.price-card input:checked ~ .content {
  color: #ffd600;
}

.price-card label {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  border: 2px solid transparent;
}

.detail-info {
  width: 100%;
}

.price-card label {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  border: 2px solid transparent;
}

#textDescritivo {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin: 20px 0;
  line-height: 1.4;
}

@media (max-width: 480px) {
  .checkout-card {
    padding: 20px;
  }
  .title p {
    font-size: 22px;
  }
}
</style>
