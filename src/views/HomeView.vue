<template>
  <div v-for="product in products" :key="product.id" class="container">
    <div class="grid" @click="goToProduct(product.id)">
      <article class="card">
        <img class="card__image vert-move" :src="product.image" />

        <div class="card__data">
          <div class="card__info">
            <img id="dividers" src="/divi.webp" alt="" />
            <h2>{{ product.name }}</h2>
            <p style="color: rgba(0, 0, 0, 0.596)">
              {{ product.description }}
            </p>
          </div>
          <h3 class="card__price"></h3>

          <button class="card__add">»</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProductStore } from "@/stores/product/product.store";
const productStore = useProductStore();

const products = productStore.getAllProducts();
const router = useRouter();

function goToProduct(id: number) {
  router.push({ name: "product", params: { id: String(id) } });
}
</script>

<style scoped>
#dividers {
  height: 18px;
  margin-bottom: 12px;
}

h2,
h3,
p {
  margin: 0;
}

.container {
  max-width: 375px;
  margin: 0 auto;
}
.grid {
  display: grid;
  grid-template: 1fr / repeat(0, 1fr);
}
.card {
  width: 180px;
  margin: 55px auto;
}
.card__image {
  position: absolute;
  width: 346px;
  left: 0px;
  right: 0;
  margin: 0 auto;
  /* top: -18%; */
  z-index: 2;
  transition: all 0.3s ease-out;
  -webkit-filter: drop-shadow(5px 5px 5px #222);
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
  margin-top: -88px;
}
.card__data {
  border-top-right-radius: 50%;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  background-color: #fdd426;
  padding-top: calc(100% * 1.18);
  transition: all 0.3s ease-out 0.1s;
  display: flex;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 6px 0 #c6a000, 0 0px 20px rgba(0, 0, 0, 0.25);
}
.card__info {
  text-align: center;
  padding: 0 10px;
  margin-bottom: 10px;
}
.card__info h2 {
  font-size: 16px;
  font-family: Barlow-Black;
  font-weight: 800;
  color: #141414;
}
.card__info p {
  margin-top: 5px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
}
.card__action {
  display: grid;
  grid-template: 30px / 1fr 35px;
}
.card__price {
  padding: 0 20px 0 30px;
  font-size: 14px;
  display: flex;
  align-items: center;
  font-weight: 800;

  font-family: Barlow-Black;
}
.card__add {
  width: 140px;
  height: 30px;
  background-color: #141414;
  border: none;
  color: #fff;
  border-top-left-radius: 15px;
  border-bottom-right-radius: 10px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease-in;
  margin-bottom: 10px;
}

@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

img.vert-move {
  -webkit-animation: mover 1s infinite alternate;
  animation: mover 1s infinite alternate;
}
img.vert-move {
  -webkit-animation: mover 1s infinite alternate;
  animation: mover 1s infinite alternate;
}
@-webkit-keyframes mover {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}
@keyframes mover {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}
</style>
