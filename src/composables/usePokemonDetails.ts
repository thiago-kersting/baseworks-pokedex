import { PokemonDetails } from "../types";

export function usePokemonDetails() {
  async function getEachPokemon(
    pokemonNameOrId: string | number
  ): Promise<PokemonDetails | null> {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`
      );
      const allData = await response.json();
      return {
        name: allData.name,
        order: allData.order.toString().padStart(3, "0"),
        sprites: {
          front_default:
            allData.sprites.other?.["official-artwork"].front_default,
          front_gif: allData.sprites.other.showdown.front_default,
          front_shiny: allData.sprites.other?.["official-artwork"].front_shiny,
        },
        types: allData.types,
        id: allData.id,
        stats: allData.stats,
      };
    } catch (error) {
      console.error(
        `Erro ao buscar detalhes do Pokémon ${pokemonNameOrId}:`,
        error
      );
      return null;
    }
  }

  return {
    getEachPokemon,
  };
}
