import { defineStore } from "pinia";
import { ref } from "vue";
import { usePokemonList } from "@/api/usePokemonList.ts";
import { usePokemonDetails } from "@/api/usePokemonDetails.ts";
import {
  PokemonDetails,
  PokemonStoreState,
  PokemonStoreActions,
  PokemonListItem,
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
        const uncachedPokemons: PokemonListItem[] = newPokemonList.filter(pokemon => !pokemonCache.has(pokemon.name));
    
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
    

    const typeOffsets = ref<Record<string, number>>({});

    async function getListPokemonsByType(types: string[], pageSize = 20) {
      isLoading.value = true;
      try {
        const pokemonSet = new Set<PokemonDetails>();
        const processedNames = new Set<string>();

        await Promise.all(types.map(async (type) => {
          if (!typeOffsets.value[type]) {
            typeOffsets.value[type] = 0;
          }

          const pokemonOfType: PokemonListItem[] = await fetchByType(type, typeOffsets.value[type], pageSize);
          
          const uncachedPokemons: PokemonListItem[] = pokemonOfType.filter(pokemon => 
            !pokemonCache.has(pokemon.name) && !processedNames.has(pokemon.name)
          );

          const newPokemonDetails = await Promise.all(
            uncachedPokemons.map(pokemon => getEachPokemon(pokemon.name))
          );

          newPokemonDetails.forEach(pokemonDetails => {
            if (pokemonDetails) {
              pokemonCache.set(pokemonDetails.name, pokemonDetails);
              processedNames.add(pokemonDetails.name);
              pokemonSet.add(pokemonDetails);
            }
          });

          pokemonOfType.forEach(pokemon => {
            const cachedPokemon = pokemonCache.get(pokemon.name);
            if (cachedPokemon && !processedNames.has(pokemon.name)) {
              processedNames.add(pokemon.name);
              pokemonSet.add(cachedPokemon);
            }
          });

          typeOffsets.value[type] += pageSize;
        }));

        const newPokemonList = Array.from(pokemonSet).filter(
          pokemon => !pokemonList.value.some(p => p.name === pokemon.name)
        );

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
