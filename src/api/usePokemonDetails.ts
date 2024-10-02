import { PokemonDetails } from "../types";

export function usePokemonDetails() {
  async function getEachPokemon(
    pokemonNameOrId: string | number
  ): Promise<PokemonDetails | null> {
    if (!pokemonNameOrId) {
      return null;
    }

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { name, order, sprites, types, id, stats } = await response.json();
      const other = sprites?.other;
      return {
        id,
        name,
        types,
        stats,
        order:
          order.toString().length >= 4
            ? order.toString()
            : order.toString().padStart(3, "0"),
        sprites: {
          front_default: other?.["official-artwork"]?.front_default,
          front_gif: other?.showdown?.front_default,
          front_shiny: other?.["official-artwork"]?.front_shiny,
        },
      };
    } catch (error) {
      console.error(
        `Erro ao buscar detalhes do Pokémon ${pokemonNameOrId}:`,
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }

  return {
    getEachPokemon,
  };
}
