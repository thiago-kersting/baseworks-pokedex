import { PokemonDetails } from "../types";

export function usePokemonDetails() {
    async function getEachPokemon(pokemonName: string): Promise<PokemonDetails | null> {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const allData = await response.json();
            return {
                name: allData.name,
                order: allData.order.toString().padStart(3, '0'),
                sprites: {
                    front_default: allData.sprites.front_default
                },
                types: allData.types,
                id: allData.id,
                stats: allData.stats
            };
        } catch (error) {
            console.error(`Erro ao buscar detalhes do Pokémon ${pokemonName}:`, error);
            return null;
        }
    }

    return {
        getEachPokemon
    };
}