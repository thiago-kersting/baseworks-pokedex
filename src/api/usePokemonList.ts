import { ref } from "vue";
import { PokemonListItem, PokemonListResponse } from "../types";

export function usePokemonList() {
  const currentPage = ref(1);
  const isLoading = ref(false);
  const pageSize = 20;

  async function getListPokemons(): Promise<PokemonListItem[]> {
    if (isLoading.value) return [];

    isLoading.value = true;
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${
          (currentPage.value - 1) * pageSize
        }&limit=${pageSize}`
      );
      const data: PokemonListResponse = await response.json();
      currentPage.value++;
      return data.results;
    } catch (error) {
      console.error("Erro ao buscar os Pokémon:", error);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  return {
    currentPage,
    isLoading,
    getListPokemons,
  };
}
