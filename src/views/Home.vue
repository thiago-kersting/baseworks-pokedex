<template>
  <main class="relative h-screen w-full overflow-hidden">
   <!-- dark mode bg -->
   <div v-if="isDark" class="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
    <!-- ligth mode bg-->
    <div v-else class="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

    <section class="relative z-10 h-screen overflow-y-auto pt-40 flex flex-col gap-20 px-16" ref="feed">
      <div class="flex flex-col items-center text-center gap-8">
        <h1 class="text-6xl font-semibold mt-2">Baseworks Pokedex Project</h1>
        <p class="font-light text-xl">Made by Thiago Kersting Puls</p>
        <button @click="toggleDark()" class="px-4 py-2 text-zinc-800 dark:text-white dark:text-zinc-950 bg-zinc-100 dark:bg-purple-700">
          <span v-if="isDark">Dark Mode</span>
          <span v-else>Light Mode</span>
        </button>
      </div>
      <section class="flex flex-col gap-10 max-w-[1024px] mx-auto">
        <div class="flex justify-between">
          <div class="flex gap-2 items-center flex-wrap">
            <h1 class="font-light text-lg">Search by:</h1>
            <input class="bg-zinc-500/5 dark:bg-white/10 px-4 py-2" placeholder="Name or Id" />
            <button @click="toggleDark()" class="px-4 py-2 text-white bg-purple-700">
              Submit
            </button>
          </div>

          <div class="flex gap-2 items-center">
            <h1 class="font-light text-lg">Filter by:</h1>
          </div>
        </div>
          <ul class="flex flex-wrap flex-col items-center md:flex-row justify-between gap-y-6" ref="feed">
            <Card v-for="pokemon in pokemonList" :key="pokemon.order" :pokemon="pokemon" />
          </ul>
          <div v-if="isLoading">Carregando...</div>
      </section>
    </section>


  </main>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePokemonStore } from '../stores/pokemonStore';
import { storeToRefs } from 'pinia';
import { useDark, useInfiniteScroll, useToggle } from '@vueuse/core';
import Card from '../components/Card.vue';

const isDark = useDark()
const toggleDark = useToggle(isDark)

const pokemonStore = usePokemonStore()
const { pokemonList, isLoading } = storeToRefs(pokemonStore)
const { getListPokemons } = pokemonStore

const feed = ref(null)

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
    distance: 200,  // Distância do fim do scroll (em pixels) para disparar o carregamento
  }
)
</script>

<style scoped></style>
