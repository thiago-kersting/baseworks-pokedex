import { useLocalStorage } from "@vueuse/core";
import { ref, watch } from "vue";
import { usePokemonDetails } from "@/api/usePokemonDetails";
import { PokemonDetails } from "@/types";

export function useFavoritePokemon() {
  const favoritePokemons = useLocalStorage<string[]>("favoritePokemons", []);

  const { getEachPokemon } = usePokemonDetails();
  const pokemonFavoriteList = ref<PokemonDetails[]>([]);

  // Função para atualizar a lista de detalhes dos Pokémon favoritos
  const updateFavoriteDetails = async () => {
    const detailsPromises = favoritePokemons.value.map((name) =>
      getEachPokemon(name)
    );
    pokemonFavoriteList.value = (await Promise.all(detailsPromises)).filter(
      (pokemon): pokemon is PokemonDetails => pokemon !== null
    );
  };

  // Observa mudanças em favoritePokemons e atualiza os detalhes
  watch(favoritePokemons, updateFavoriteDetails, { immediate: true });

  function toggleFavorite(pokemonName: string) {
    if (isFavorite(pokemonName)) {
      favoritePokemons.value = favoritePokemons.value.filter(
        (p) => p !== pokemonName
      );
    } else {
      favoritePokemons.value.push(pokemonName);
    }
  }

  function isFavorite(pokemonName: string) {
    return favoritePokemons.value.includes(pokemonName);
  }

  return {
    favoritePokemons,
    pokemonFavoriteList,
    toggleFavorite,
    isFavorite,
  };
}
