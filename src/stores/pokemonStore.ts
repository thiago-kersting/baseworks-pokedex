import { defineStore } from "pinia";
import { ref } from "vue";
import { usePokemonList } from "@/api/usePokemonList.ts";
import { usePokemonDetails } from "@/api/usePokemonDetails.ts";
import {
  PokemonDetails,
  PokemonStoreState,
  PokemonStoreActions,
} from "@/types";
import { usePokemonByType } from "@/api/usePokemonByType";

export const usePokemonStore = defineStore(
  "pokemon",
  (): PokemonStoreState & PokemonStoreActions => {
    const {
      currentPage,
      getListPokemons: fetchPokemonList,
    } = usePokemonList();
    const {
      fetchByType,
    } = usePokemonByType()
    const { getEachPokemon } = usePokemonDetails();
    const pokemonList = ref<PokemonDetails[]>([]);
    const pokemonCache = new Map<string, PokemonDetails>();
    const isLoading = ref(false);

    async function getListPokemons() {
      isLoading.value = true;
      try {
        const newPokemonList = await fetchPokemonList();
        const uncachedPokemons = newPokemonList.filter(pokemon => !pokemonCache.has(pokemon.name));
    
        const newPokemonDetails = await Promise.all(
          uncachedPokemons.map(pokemon => getEachPokemon(pokemon.name))
        );
    
        newPokemonDetails.forEach(pokemonDetails => {
          if (pokemonDetails) {
            pokemonCache.set(pokemonDetails.name, pokemonDetails);
          }
        });
    
        // Atualize a lista sem duplicatas
        const loadedPokemons = newPokemonList
          .map(pokemon => pokemonCache.get(pokemon.name)!)
          .filter(pokemon => !pokemonList.value.some(p => p.name === pokemon.name));
    
        // Adicione os novos pokémons à lista sem duplicá-los
        pokemonList.value = [...pokemonList.value, ...loadedPokemons];
        pokemonList.value.sort((a, b) => a.order - b.order);
      } finally {
        isLoading.value = false;
      }
    }
    

    async function getListPokemonsByType(types: string[]) {
      isLoading.value = true;
      try {
        const pokemonSet = new Set<PokemonDetails>();
    
        await Promise.all(types.map(async (type) => {
          const pokemonOfType = await fetchByType(type);
          
          const uncachedPokemons = pokemonOfType.filter(pokemon => !pokemonCache.has(pokemon.name));
    
          const newPokemonDetails = await Promise.all(
            uncachedPokemons.map(pokemon => getEachPokemon(pokemon.name))
          );
    
          newPokemonDetails.forEach(pokemonDetails => {
            if (pokemonDetails) {
              pokemonCache.set(pokemonDetails.name, pokemonDetails);
            }
          });
    
          pokemonOfType.forEach(pokemon => {
            const cachedPokemon = pokemonCache.get(pokemon.name);
            if (cachedPokemon) {
              pokemonSet.add(cachedPokemon);
            }
          });
        }));
    
        // Atualize a lista sem duplicatas
        const newPokemonList = Array.from(pokemonSet).filter(
          pokemon => !pokemonList.value.some(p => p.name === pokemon.name)
        );
    
        // Adicione os novos pokémons à lista sem duplicá-los
        pokemonList.value = [...pokemonList.value, ...newPokemonList];
        pokemonList.value.sort((a, b) => a.order - b.order);
      } finally {
        isLoading.value = false;
      }
    }    

    return {
      pokemonList,
      currentPage,
      isLoading,
      getListPokemons,
      getListPokemonsByType,
    };
  }
);
