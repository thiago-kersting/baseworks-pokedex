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
        for (const pokemon of newPokemonList) {
          if (!pokemonCache.has(pokemon.name)) {
            const pokemonDetails = await getEachPokemon(pokemon.name);
            if (pokemonDetails) {
              pokemonCache.set(pokemon.name, pokemonDetails);
              pokemonList.value.push(pokemonDetails);
            }
          } else {
            if (!pokemonList.value.some(poke => poke.name === pokemon.name)) {
              pokemonList.value.push(pokemonCache.get(pokemon.name)!);
            }
          }
        }
        pokemonList.value.sort((a, b) => a.order - b.order);
      } finally {
        isLoading.value = false;
      }
    }

    async function getListPokemonsByType(types: string[]) {
      currentPage.value = 1;
      isLoading.value = true;
      try {
        const pokemonSet = new Set<PokemonDetails>();
        
        await Promise.all(types.map(async (type) => {
          const pokemonOfType = await fetchByType(type);
          for (const pokemon of pokemonOfType) {
            if (!pokemonCache.has(pokemon.name)) {
              const pokemonDetails = await getEachPokemon(pokemon.name);
              if (pokemonDetails) {
                pokemonCache.set(pokemon.name, pokemonDetails);
                pokemonSet.add(pokemonDetails);
              }
            } else {
              if (!pokemonList.value.some(poke => poke.name === pokemon.name)) {
                pokemonList.value.push(pokemonCache.get(pokemon.name)!);
              }
            }
          }
        }));

        pokemonList.value = Array.from(pokemonSet).sort((a, b) => a.order - b.order);
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
