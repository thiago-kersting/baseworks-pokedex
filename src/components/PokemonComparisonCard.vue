<template>
  <div
    v-if="pokemon1 || pokemon2"
    class="pokemon-comparison-card fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-800 shadow-lg rounded-xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer z-50"
    :class="{ 'w-80 md:w-96 h-auto p-4': isExpanded, 'w-40 h-8 md:h-14': !isExpanded }"
    @click="toggleExpand"
    ref="cardRef"
  >
    <div class="relative h-full">
      <div class="pokemon-pair flex justify-around items-center h-full">
        <div class="flex items-center justify-center text-center flex-col">
          <template v-if="pokemon1">
            <button @click.stop="() => { if(isExpanded) removePokemon(pokemon1.name), toggleExpand() }">
              <img :src="pokemon1.sprites.front_default" :alt="pokemon1.name" 
                     class="pokemon-image mx-auto transition-all duration-500 ease-in-out"
                     :class="{ 'w-20 h-20': isExpanded, 'w-5 h-5 md:w-10 md:h-10': !isExpanded }">
            </button>
            <h4 class="pokemon-name font-bold dark:text-zinc-100 transition-all duration-500 ease-in-out"
                :class="{ 'text-sm mt-2 block': isExpanded, 'hidden': !isExpanded }">
              {{ pokemon1.name }}
            </h4>
          </template>
          <template v-else>
            <div class="pokemon-placeholder text-xl font-bold dark:text-zinc-100">
              ?
            </div>
          </template>
        </div>
        <h1>vs</h1>
        <div class="flex items-center justify-center text-center flex-col">
          <template v-if="pokemon2">
            <button @click.stop="() => { if(isExpanded) removePokemon(pokemon2.name), toggleExpand() }">
                <img :src="pokemon2.sprites.front_default" :alt="pokemon2.name" 
                     class="pokemon-image mx-auto transition-all duration-500 ease-in-out"
                     :class="{ 'w-20 h-20': isExpanded, 'w-5 h-5 md:w-10 md:h-10': !isExpanded }">
            </button>
            <h4 class="pokemon-name font-bold dark:text-zinc-100 transition-all duration-500 ease-in-out"
                :class="{ 'text-sm mt-2 block': isExpanded, 'hidden': !isExpanded }">
              {{ pokemon2.name }}
            </h4>
          </template>
          <template v-else>
            <div class="pokemon-placeholder text-xl font-bold dark:text-zinc-100">
              ?
            </div>
          </template>
        </div>
      </div>
      <div v-if="isExpanded" 
           class="stats-comparison mt-4 transition-all duration-500 ease-in-out"
           :class="{ 'opacity-100 max-h-96': isExpanded, 'opacity-0 max-h-0': !isExpanded }">
           <button @click="clearComparison()" class="font-light text-sm text-center my-4 dark:text-zinc-500 text-zinc-500 w-full">{{ t('compareCard.text') }}</button>
        <div class="flex flex-col items-center">
          <div v-for="stat in pokemon1.stats" :key="stat.stat.name" class="stat-row flex items-center mb-2 w-full max-w-xs">
            <div class="stat-name w-20 text-right mr-2 text-xs dark:text-zinc-300 text-nowrap">{{ t(`pokemon.status.${stat.stat.name}`) }}</div>
            <div class="stat-bars flex flex-grow gap-1">
              <div class="stat-bar h-4 bg-zinc-200 dark:bg-zinc-600 rounded-full flex items-center justify-center text-xs text-zinc-700 dark:text-zinc-300 transition-all duration-500 ease-in-out"
                   :class="{ 'bg-green-500 dark:bg-green-600 text-white': stat.base_stat > getPokemonStat(pokemon2, stat.stat.name) }"
                   :style="{ width: `${(stat.base_stat / 200) * 100}%` }"
              >
                {{ stat.base_stat }}
              </div>
              <div class="stat-bar h-4 bg-zinc-200 dark:bg-zinc-600 rounded-full flex items-center justify-center text-xs text-zinc-700 dark:text-zinc-300 transition-all duration-500 ease-in-out"
                   :class="{ 'bg-green-500 dark:bg-green-600 text-white': getPokemonStat(pokemon2, stat.stat.name) > stat.base_stat }"
                   :style="{ width: `${(getPokemonStat(pokemon2, stat.stat.name) / 200) * 100}%` }"
              >
                {{ getPokemonStat(pokemon2, stat.stat.name) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  pokemon1: { type: Object, default: null },
  pokemon2: { type: Object, default: null }
});

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

import { useComparePokemons } from '@/composables/useComparePokemons';

const { removePokemon, clearComparison } = useComparePokemons();

const isExpanded = ref(false);
const cardRef = ref<HTMLElement | null>(null);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const getPokemonStat = (pokemon: any, statName: string) => {
  const stat = pokemon.stats.find(s => s.stat.name === statName);
  return stat ? stat.base_stat : 0;
};

const handleClickOutside = (event: Event) => {
  if (cardRef.value && !cardRef.value.contains(event.target)) {
    isExpanded.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
