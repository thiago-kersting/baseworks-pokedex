import { PokemonListItem } from '@/types';
import { ref } from 'vue';

interface pokemonByTypeApi {
    pokemon: PokemonListItem
}

export function usePokemonByType() {
    const isLoading = ref(false);


    const fetchByType = async (type: string, offset = 0, limit = 20) => {
        isLoading.value = true;
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
            const { pokemon } = await response.json();

            // Limitar o número de Pokémon retornados por página
            const paginatedPokemon = pokemon.slice(offset, offset + limit);

            // Transformar o array de pokemon para o formato desejado
            const simplifiedPokemonList = paginatedPokemon.map((item: pokemonByTypeApi) => ({
                name: item.pokemon.name,
                url: item.pokemon.url
            }));

            return simplifiedPokemonList;
        } catch (err) {
            console.error(err)
        } 
        finally {
            isLoading.value = false;
        }
    }


    return {
        fetchByType,
        isLoading
    }
}