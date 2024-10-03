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

    <section class="relative z-10 h-screen overflow-y-auto pt-40 flex flex-col gap-20 md:px-16 px-4" ref="feed">
      <div class="flex flex-col items-center text-center gap-8">
        <button @click="toggleLocale()" class="relative inline-block overflow-hidden rounded-full p-[1px]">
          <span class="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a9a9a9_0%,#0c0c0c_50%,#a9a9a9_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_50%,#171717_100%)]"></span>
          <div class="inline-flex h-full w-full cursor-pointer justify-center rounded-full bg-white px-3 py-1 text-xs font-medium leading-5 text-slate-600 backdrop-blur-xl dark:bg-black dark:text-slate-200">
            {{ t('changeLocation') }}
          </div>
        </button>
        <h1 class="text-6xl font-semibold mt-2">{{ t('title') }}</h1>
        <p class="font-light text-xl">{{ t('madeBy', { name: 'Thiago Kersting Puls' } ) }}</p>
        <button @click="toggleDark()" class="bg-purple-700 rounded-full px-4 py-2 shadow-lg text-white dark:!text-white hover:bg-purple-800 transition-colors duration-300">
          <span class="text-white" v-if="isDark">{{ t('switchColor.dark') }}</span>
          <span class="text-white" v-else>{{ t('switchColor.light') }}</span>
        </button>
      </div>
      

      <section class="flex flex-col items-center justify-center gap-10 max-w-[1024px] mx-auto">
        <div class="flex items-end gap-2 md:max-w-[616px] w-full lg:max-w-full justify-between">
          <div v-if="!showFavorites" class="flex items-center gap-2 flex-wrap">
            <h1 class="font-light text-lg">{{ t('inputSearch.label') }}</h1>
            <input v-model="searchPokemon" @input="searchPokemonDebounced"
              class="bg-zinc-500/5 dark:bg-white/10 px-4 py-2 rounded-sm" :placeholder="t('inputSearch.placeholder')" />
          </div>
          <div v-else>
            <h1 class="font-light text-lg">{{ t('favPokemons.title') }}</h1>
          </div>

          <div class="flex items-center gap-10">
            <button class="font-light text-lg flex gap-2 items-center h-10 rounded-full" v-if="!showFavorites"
              @click="openFilters = !openFilters">
              <Icon icon="mynaui:filter" />
              <p class="hidden md:block">{{ t('filter.title') }}</p>
              <Icon icon="weui:arrow-filled"
                :class="['transition-all hidden md:block', { 'rotate-90': openFilters }]" />
            </button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button class="h-10" @click="() => {showFavorites = !showFavorites, openFilters = false}">
                    <Icon v-if="!showFavorites" icon="material-symbols-light:star-outline" class="text-2xl" />
                    <Icon v-else="showFavorites" icon="material-symbols-light:star" class="text-2xl" />
                  </button>
                </TooltipTrigger>
                <TooltipContent class="dark:bg-zinc-800 bg-zinc-200 dark:!text-white !text-zinc-900">
                  <p v-if="!showFavorites">{{ t('favPokemons.tooltipEnter') }}</p>
                  <p v-else>{{ t('favPokemons.tooltipLeave') }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

        </div>
        <section :class="['h-0 w-full overflow-hidden transition-all', { 'md:h-32 h-44': openFilters }]">
          <div class="flex flex-col gap-4">
            <div class="flex gap-1 min-[1084px]:justify-around justify-start flex-wrap">
              <Badge v-for="type in typesFilter" :typeName="type" class="cursor-pointer"
                :outline="!selectedTypes.includes(type)" @click="toggleTypeFilter(type)" />
            </div>
            <div class="flex gap-2 justify-end">
              <button class="px-4 py-2 rounded-full text-zinc-800 dark:text-white border border-purple-700 hover:dark:bg-white/5 hover:bg-zinc-500/5"
                @click="cleanTypes()">{{ t('filter.buttons.clear') }}</button>
              <button class="px-4 py-2 text-white dark:!text-white bg-purple-700 rounded-full shadow-lg hover:bg-purple-800 transition-colors duration-300" @click="selectAllTypesHandler()">{{ t('filter.buttons.selectAll') }}</button>
            </div>
          </div>
        </section>
        <ul
          class="flex flex-wrap flex-col items-center md:items-start justify-center md:justify-start md:flex-row lg:gap-x-20 md:gap-x-10 gap-y-6"
          ref="feed">
          <Card v-motion-slide-visible-once-bottom v-for="pokemon in pokemonList" :key="pokemon.id" :pokemon="pokemon" />
        </ul>
        <section class="flex items-center justify-center">
          <div class="h-72">
            <div v-if="isLoading">
              <Icon icon="svg-spinners:gooey-balls-1" class="text-6xl text-purple-800" />
            </div>
            <div v-else-if="selectedTypes.length === 0" class="flex gap-2 items-center">
              {{ t('errors.noTypesSelected') }}
              <Icon icon="arcticons:pokemon-unite" class="text-2xl" />
            </div>
            <div v-else-if="filteredPokemonsList.length === 0" class="flex flex-col gap-5 items-center">
              <div class="flex items-center gap-2">
                {{ t('errors.noPokemonFound') }}
                <Icon icon="noto:magnifying-glass-tilted-left" class="text-2xl" />
              </div>
            </div>
            <div v-else-if="pokemonFavoriteList.length === 0" class="flex flex-col gap-5 items-center">
              <div class="flex items-center gap-2">
                {{ t('errors.noFavoritePokemon') }}
                <Icon icon="noto:magnifying-glass-tilted-left" class="text-2xl" />
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>

    <!-- Botão flutuante para voltar ao topo -->
    <ButtonScrollTop @click="scrollToTop" v-motion-slide-bottom />

    <PokemonComparisonCard
          :pokemon1="pokemonCompareList[0]"
          :pokemon2="pokemonCompareList[1]"
    />
  </main>

</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { usePokemonStore } from '@/stores/pokemonStore';
import { storeToRefs } from 'pinia';
import { useDark, useInfiniteScroll, useToggle } from '@vueuse/core';
import Card from '@/components/Card.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import Badge from '@/components/BadgeType.vue';
import { useFilteredPokemons } from '@/composables/useFilteredPokemons';
import { useFavoritePokemon } from '@/composables/useFavoritePokemon';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

import enUS from "@/locales/en.json"
import { useI18n } from 'vue-i18n';
type MessageSchema = typeof enUS

const { t, locale } = useI18n<{ message: MessageSchema }, 'en' | 'pt-BR'>({
  useScope: 'global'
});

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'pt-BR' : 'en'
}


import { useComparePokemons } from '@/composables/useComparePokemons';
import PokemonComparisonCard from '@/components/PokemonComparisonCard.vue';
import ButtonScrollTop from '@/components/ButtonScrollTop.vue';

const { pokemonCompareList } = useComparePokemons();

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { pokemonFavoriteList } = useFavoritePokemon();

const showFavorites = ref(false)

const pokemonList = computed(() => {
  return showFavorites.value ? pokemonFavoriteList.value : filteredPokemonsList.value
})


const pokemonStore = usePokemonStore()
const { isLoading } = storeToRefs(pokemonStore)
const { getListPokemons, getListPokemonsByType } = pokemonStore

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

useInfiniteScroll(
  feed,
  () => {
    if (!isLoading.value && selectedTypes.value.length > 0 && selectedTypes.value.length < 18 && !showFavorites.value && !searchPokemon.value) {
      getListPokemonsByType(selectedTypes.value);  // Carregar mais Pokémons por tipo
    } else if (!isLoading.value && selectedTypes.value.length === 18 && !showFavorites.value && !searchPokemon.value) {
      getListPokemons();  // Carregar mais Pokémons para todos os tipos
    }
  },
  { distance: 250 }
);

const scrollToTop = () => {
  if (feed.value) {
    (feed.value as HTMLElement).scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

</script>

<style scoped></style>