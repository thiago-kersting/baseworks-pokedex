<template>
    <div class="bg-stone-200 h-full p-4">
      <div class="flex gap-2">
        <label class="text-2xl">Pesquisar Pokemon:</label>
        <input type="text">
      </div>
      <h1>Lista de Pokémon</h1>
      <ul ref="feed" class="flex flex-wrap gap-2">
        <div class="flex w-max bg-stone-500 py-2 px-6 rounded-2xl" v-for="pokemon in pokemonList" :key="pokemon.order">
          <div class="flex flex-col">
            <p>#{{ pokemon.order }}</p>
            <p>{{ pokemon.name }}</p>
            <div class="flex gap-1 mt-1">
              <p v-for="types in pokemon.types" :key="types.type.url">
                {{ types.type.name }}
              </p>
            </div>
          </div>
          <div>
            <img :src="pokemon.sprites.front_default" alt="pokemon" class="w-full">
          </div>
        </div>
      </ul>
      <div v-if="isLoading">Carregando...</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { usePokemonStore } from '../stores/pokemonStore';
  import { storeToRefs } from 'pinia';
  import { useInfiniteScroll } from '@vueuse/core';

  
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
      distance: 50,  // Distância do fim do scroll (em pixels) para disparar o carregamento
    }
  )
  </script>
  
  <style scoped>
  ul {
    max-height: 90vh;
    overflow-y: auto;
  }
  </style>
  