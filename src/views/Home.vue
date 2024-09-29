<template>
  <main class="relative h-screen w-full overflow-hidden">
    <div class="fixed inset-0 bg-black">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
      </div>
      <div
        class="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]">
      </div>
    </div>

    <!--  <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div> -->


    <section class="relative z-10 h-screen overflow-y-auto pt-40 flex flex-col gap-20" ref="feed">
      <div class="flex flex-col items-center gap-8">
        <h1 class="text-6xl font-semibold mt-2 text-zinc-100">Pokedex Project Baseworks</h1>
        <p class="font-light text-xl text-zinc-100">Made by Thiago Kersting Puls</p>
      </div>

      <div class="h-full p-4 mx-auto max-w-[1024px]">
        <ul class="flex flex-wrap justify-around gap-y-6" ref="feed">
          <div class="group hover:-translate-y-1 duration-700 cursor-pointer transition-all flex flex-col py-2 px-6 rounded-2xl w-72 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 hover:border-purple-400 shadow-lg" v-for="pokemon in pokemonList" :key="pokemon.order">
            <div class="flex justify-between items-center mb-2">
              <p class="text-white">#{{ pokemon.order }}</p>
              <button @click="isFavorite.push(pokemon.order)">
                <Icon icon="material-symbols-light:star-outline" class="text-white text-2xl" />
              </button>
            </div>
            <div class="flex justify-center">
              <img :src="pokemon.sprites.front_default" alt="pokemon" class="w-24 h-24 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3">
            </div>
            <div class="flex flex-col items-center justify-center gap-2 mt-2">
              <p class="text-white font-semibold">{{ pokemon.name }}</p>
              <div class="flex gap-2 items-end justify-end">
                <span v-for="types in pokemon.types" :key="types.type.url" class="px-2 py-1 text-xs rounded-full bg-white/20 text-white">
                  {{ types.type.name }}
                </span>
              </div>
            </div>
          </div>
        </ul>
        <div v-if="isLoading">Carregando...</div>
      </div>
    </section>


  </main>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePokemonStore } from '../stores/pokemonStore';
import { storeToRefs } from 'pinia';
import { useInfiniteScroll } from '@vueuse/core';
import { Icon } from "@iconify/vue"


const pokemonStore = usePokemonStore()
const { pokemonList, isLoading } = storeToRefs(pokemonStore)
const { getListPokemons } = pokemonStore

const feed = ref(null)

const isFavorite = ref([])

onMounted(() => {
  getListPokemons()  // Carregar a primeira página de Pokémon
})

// Configuração do Infinite Scroll
useInfiniteScroll(
  feed, // O elemento no qual o scroll será detectado
  () => {
    if (!isLoading.value) {
      getListPokemons()  // Carregar mais Pokémon ao atingir o final da página
    }
  },
  {
    distance: 50,  // Distância do fim do scroll (em pixels) para disparar o carregamento
  }
)
</script>

<style scoped></style>
