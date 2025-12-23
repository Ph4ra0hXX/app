<script setup lang="ts">
import { computed } from "vue";
import { useOrderStore } from "@/stores/order/order.store";
import { useCustomerStore } from "@/stores/customer/customer.store";

const orderStore = useOrderStore();
const customerStore = useCustomerStore();

const customer = computed(() => customerStore.customer);
function finalizarPedido() {
  if (!customer.value.nome) {
    alert("Informe seu nome");
    return;
  }

  if (
    customer.value.formaDeEntrega === "Quero entrega" &&
    (!customer.value.rua || !customer.value.numero)
  ) {
    alert("Informe o endereço completo");
    return;
  }

  if (!customer.value.formaDePagamento) {
    alert("Escolha a forma de pagamento");
    return;
  }

  customerStore.finalizeCustomer();
}

function copyToClipboard() {
  navigator.clipboard.writeText("SUA_CHAVE_PIX_AQUI");
  alert("PIX copiado!");
}
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
        <div class="info">
          <h3>Seu Nome:</h3>
        </div>
        <div class="input-field">
          <input v-model="customer.nome" type="text" />
        </div>
        <br />

        <!-- ENDEREÇO -->
        <div v-if="customer.formaDeEntrega === 'Quero entrega'">
          <div class="info"><h3>Rua:</h3></div>
          <div class="input-field">
            <input v-model="customer.rua" type="text" />
          </div>
          <br />

          <div class="info"><h3>Bairro:</h3></div>
          <div class="input-field">
            <input v-model="customer.bairro" type="text" />
          </div>
          <br />

          <div class="info"><h3>Número:</h3></div>
          <div class="input-field">
            <input v-model="customer.numero" type="number" />
          </div>
          <br />

          <div class="info"><h3>Referência:</h3></div>
          <div class="input-field">
            <input v-model="customer.referencia" type="text" />
          </div>
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
        <div v-if="customer.formaDePagamento === 'Pix'" class="input-field">
          <button id="butCopiarPix" @click="copyToClipboard">Copiar PIX</button>
        </div>

        <!-- TROCO -->
        <div v-if="customer.formaDePagamento === 'Dinheiro'">
          <div class="info"><h3>Troco?</h3></div>
          <div class="input-field">
            <input
              v-model="customer.troco"
              type="number"
              placeholder="Troco para quanto?"
            />
          </div>
        </div>

        <p id="textDescritivo">
          Caso tenha escolhido entrega, o valor<br />
          de R$ 4,00 será somado ao total.
        </p>

        <button @click="finalizarPedido" class="btn">Finalizar Pedido</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===============================
   RESET / BASE
================================ */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

/* ===============================
   CONTAINER PRINCIPAL
================================ */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ===============================
   CARD CHECKOUT
================================ */
.checkout-card {
  width: 100%;
  max-width: 520px;
  border-radius: 20px;
  padding: 24px;
  overflow-x: hidden;
  border: 1px solid #2a2a2a;
}

/* ===============================
   TÍTULO
================================ */
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

/* ===============================
   GRID DE OPÇÕES (RADIOS)
================================ */
.payment-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

/* ===============================
   CARD RADIO
================================ */
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

/* ===============================
   CONTEÚDO DO CARD
================================ */
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

/* ===============================
   RADIO SELECIONADO
================================ */
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

/* ===============================
   DADOS / INFORMAÇÕES
================================ */
.detail-info {
  width: 100%;
}

/* ===============================
   TÍTULOS DOS CAMPOS
================================ */
.info h3 {
  font-size: 14px;
  font-weight: 600;
  color: #d1d5db;
  margin: 0 0 6px;
}

/* ===============================
   INPUT FIELD (ANTI-QUEBRA)
================================ */
.input-field {
  width: 100%;
  max-width: 100%;
  display: flex;
}

/* ===============================
   INPUTS
================================ */
.input-field input {
  width: 100%;
  min-width: 0;
  padding: 12px 14px;
  background: #0f0f0f;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.input-field input::placeholder {
  color: #6b7280;
}

.input-field input:focus {
  border-color: #ffd600;
}

/* ===============================
   BOTÃO PIX
================================ */
#butCopiarPix {
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  background: #2563eb;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.2s ease;
}

#butCopiarPix:hover {
  background: #1d4ed8;
}

/* ===============================
   TEXTO DESCRITIVO
================================ */
#textDescritivo {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin: 20px 0;
  line-height: 1.4;
}

/* ===============================
   BOTÃO FINALIZAR
================================ */
.btn {
  width: 100%;
  padding: 14px;
  background: #ffd600;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

/* ===============================
   RESPONSIVO (MOBILE)
================================ */
@media (max-width: 480px) {
  .checkout-card {
    padding: 20px;
  }

  .title p {
    font-size: 22px;
  }
}
</style>
