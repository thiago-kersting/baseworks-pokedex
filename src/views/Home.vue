<template>
  <main class="relative h-screen w-full overflow-hidden">
    <!-- dark mode bg -->
    <div v-if="isDark"
      class="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
    </div>
    <!-- ligth mode bg-->
    <div v-else
      class="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
    </div>

    <section class="relative z-10 h-screen overflow-y-auto pt-40 flex flex-col gap-20 px-16" ref="feed">
      <div class="flex flex-col items-center text-center gap-8">
        <h1 class="text-6xl font-semibold mt-2">Baseworks Pokedex Project</h1>
        <p class="font-light text-xl">Made by Thiago Kersting Puls</p>
        <button @click="toggleDark()" class="px-4 py-2 rounded-full bg-purple-700">
          <span class="text-white" v-if="isDark">Dark Mode</span>
          <span class="text-white" v-else>Light Mode</span>
        </button>
      </div>
      <section class="flex flex-col gap-10 w-[1024px] mx-auto">
        <div class="flex justify-between">
          <div class="flex gap-2 items-center flex-wrap">
            <h1 class="font-light text-lg">Pesquisar por:</h1>
            <input v-model="searchPokemon" @input="searchPokemonDebounced" class="bg-zinc-500/5 dark:bg-white/10 px-4 py-2 rounded-sm" placeholder="Nome ou Id" />
          </div>

          <div class="flex gap-2 items-center">
            <button class="font-light text-lg flex gap-2 items-center" @click="openFilters = !openFilters">
              <Icon icon="mynaui:filter" />
              Filter by types
              <Icon icon="weui:arrow-filled" :class="['transition-all', { 'rotate-90': openFilters }]" />
            </button>
          </div>

        </div>
        <section :class="['h-0 w-full overflow-hidden transition-all', { 'h-24': openFilters }]">
          <div class="flex flex-col gap-4">
            <div class="flex gap-x-1 justify-around flex-wrap">
              <Badge v-for="type in typesFilter" :typeName="type" class="cursor-pointer" :outline="!selectedTypes.includes(type)" @click="toggleTypeFilter(type)" />
            </div>
            <div class="flex gap-2 justify-end">
              <button class="px-4 py-2 rounded-full text-zinc-800 dark:text-white border border-purple-700" @click="cleanTypes()">Limpar filtros</button>
              <button class="px-4 py-2 rounded-full text-white bg-purple-700" @click="selectAllTypesHandler()">Selecionar todos</button>
            </div>
          </div>
        </section>
        <ul class="flex flex-wrap flex-col items-center md:flex-row gap-x-20 gap-y-6" ref="feed">
          <Card v-for="pokemon in filteredPokemonsList" :key="pokemon.order" :pokemon="pokemon" />
        </ul>
        <section class="flex items-center justify-center">
          <div v-if="isLoading">
            <Icon icon="svg-spinners:gooey-balls-1" class="text-6xl text-purple-800" />
          </div>
          <div v-else-if="selectedTypes.length === 0" class="flex gap-2 items-center">
            Selecione algum tipo de Pokemon para ver os resultados!
            <Icon icon="arcticons:pokemon-unite" class="text-2xl" />
          </div>
          <div v-else-if="filteredPokemonsList.length === 0" class="flex gap-2 items-center">
            Nenhum Pokémon encontrado. Tente outra busca!
            <Icon icon="noto:magnifying-glass-tilted-left" class="text-2xl" />
          </div>
        </section>
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
import { Icon } from '@iconify/vue/dist/iconify.js';
import Badge from '../components/Badge.vue';
import { useFilteredPokemons } from '../composables/useFilteredPokemons';

const isDark = useDark()
const toggleDark = useToggle(isDark)

const pokemonStore = usePokemonStore()
const { isLoading } = storeToRefs(pokemonStore)
const { getListPokemons } = pokemonStore

const feed = ref(null)

onMounted(() => {
  getListPokemons()  // Carregar a primeira página de Pokémon~
  selectAllTypesHandler()
})

const openFilters = ref(false);

const typesFilter = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy"
]

const {
  searchPokemon,
  selectedTypes,
  filteredPokemonsList,
  toggleTypeFilter,
  cleanTypes,
  selectAllTypes,
  searchPokemonDebounced
} = useFilteredPokemons()

const selectAllTypesHandler = () => {
  selectAllTypes(typesFilter)
}

// Configuração do Infinite Scroll
useInfiniteScroll(
  feed, // O elemento no qual o scroll será detectado
  () => {
    if (!isLoading.value) {
      getListPokemons()  // Carregar mais Pokémon ao atingir o final da página
    }
  },
  {
    distance: 100,  // Distância do fim do scroll (em pixels) para disparar o carregamento
  }
)
</script>

<style scoped></style>
