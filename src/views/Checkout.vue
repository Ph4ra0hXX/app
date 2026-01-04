<script setup lang="ts">
import { computed } from "vue";
import { useCustomerStore } from "@/stores";
import PrimaryButton from "@/components/common/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/common/buttons/SecondaryButton.vue";
import TextInput from "@/components/common/inputs/TextInput.vue";
import { useRouter } from "vue-router";

const customerStore = useCustomerStore();
const customer = computed(() => customerStore.customer);
const router = useRouter();

const finalizarPedido = () => {
  if (!customer.value.nome) return alert("Informe seu nome");
  if (
    customer.value.formaDeEntrega === "Quero entrega" &&
    (!customer.value.rua || !customer.value.numero)
  )
    return alert("Informe o endereço completo");
  if (!customer.value.formaDePagamento)
    return alert("Escolha a forma de pagamento");
  customerStore.finalizeCustomer();
};

const copyToClipboard = () => {
  navigator.clipboard.writeText("SUA_CHAVE_PIX_AQUI");
};
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

      <!-- ENTREGA -->
      <div class="payment-container">
        <div class="price-card">
          <input
            v-model="customer.formaDeEntrega"
            value="Vou buscar"
            type="radio"
            id="buscar"
          />
          <div class="content">
            Vou buscar
            <span>grátis</span>
          </div>
          <label for="buscar"></label>
        </div>

        <div class="price-card">
          <input
            v-model="customer.formaDeEntrega"
            value="Quero entrega"
            type="radio"
            id="entrega"
          />
          <div class="content">
            Quero entrega
            <span>taxa de entrega</span>
          </div>
          <label for="entrega"></label>
        </div>
      </div>

      <!-- DADOS -->
      <div class="detail-info">
        <!-- NOME -->
        <TextInput v-model="customer.nome" label="Seu Nome:" />
        <br />

        <!-- ENDEREÇO -->
        <div v-if="customer.formaDeEntrega === 'Quero entrega'">
          <TextInput v-model="customer.rua" label="Rua:" />
          <br />

          <TextInput v-model="customer.bairro" label="Bairro:" />
          <br />

          <TextInput v-model="customer.numero" type="number" label="Número:" />
          <br />

          <TextInput v-model="customer.referencia" label="Referência:" />
          <br />
        </div>

        <!-- PAGAMENTO -->
        <div class="info">
          <h3>Forma de Pagamento:</h3>
        </div>

        <div class="payment-container">
          <div class="price-card">
            <input
              v-model="customer.formaDePagamento"
              value="Pix"
              type="radio"
              id="pix"
            />
            <div class="content">PIX</div>
            <label for="pix"></label>
          </div>

          <div class="price-card">
            <input
              v-model="customer.formaDePagamento"
              value="Cartão"
              type="radio"
              id="cartao"
            />
            <div class="content">Cartão</div>
            <label for="cartao"></label>
          </div>

          <div class="price-card">
            <input
              v-model="customer.formaDePagamento"
              value="Dinheiro"
              type="radio"
              id="dinheiro"
            />
            <div class="content">Dinheiro</div>
            <label for="dinheiro"></label>
          </div>
        </div>

        <!-- PIX -->
        <div v-if="customer.formaDePagamento === 'Pix'">
          <SecondaryButton label="Copiar PIX" @click="copyToClipboard" />
        </div>

        <!-- TROCO -->
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

        <PrimaryButton @click="finalizarPedido" label="Finalizar Pedido" />
        <SecondaryButton
          label="Voltar"
          @click="() => router.push({ name: 'order' })"
        />
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
