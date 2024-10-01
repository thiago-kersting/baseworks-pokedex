import { defineStore } from "pinia";
import { ref } from "vue";
import { usePokemonList } from "../api/usePokemonList.ts";
import { usePokemonDetails } from "../api/usePokemonDetails.ts";
import {
  PokemonDetails,
  PokemonStoreState,
  PokemonStoreActions,
} from "../types";

export const usePokemonStore = defineStore(
  "pokemon",
  (): PokemonStoreState & PokemonStoreActions => {
    const {
      currentPage,
      isLoading,
      getListPokemons: fetchPokemonList,
    } = usePokemonList();
    const { getEachPokemon } = usePokemonDetails();
    const pokemonList = ref<PokemonDetails[]>([]);

    async function getListPokemons() {
      const newPokemonList = await fetchPokemonList();
      for (const pokemon of newPokemonList) {
        const pokemonDetails = await getEachPokemon(pokemon.name);
        if (pokemonDetails) {
          pokemonList.value.push(pokemonDetails);
        }
      }
      pokemonList.value.sort((a, b) => a.order - b.order);
    }

    return {
      pokemonList,
      currentPage,
      isLoading,
      getListPokemons,
    };
  }
);
