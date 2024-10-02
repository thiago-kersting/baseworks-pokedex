import { useLocalStorage } from "@vueuse/core";
import { ref, computed, watch } from 'vue';
import { usePokemonDetails } from "@/api/usePokemonDetails";
import { PokemonDetails } from "@/types";

export function useComparePokemons() {
    const comparePokemons = useLocalStorage<string[]>("comparePokemons", []);
    const { getEachPokemon } = usePokemonDetails();
    const pokemonCompareList = ref<PokemonDetails[]>([]);

    // Função para atualizar a lista de detalhes dos Pokémon para comparação
    const updateCompareDetails = async () => {
        const detailsPromises = comparePokemons.value.map((name) => getEachPokemon(name));
        pokemonCompareList.value = (await Promise.all(detailsPromises)).filter(
            (pokemon): pokemon is PokemonDetails => pokemon !== null
        );
    };

    // Observa mudanças em comparePokemons e atualiza os detalhes
    watch(comparePokemons, updateCompareDetails, { immediate: true });

    const addPokemon = (pokemonName: string) => {
        if (comparePokemons.value.length < 2 && !comparePokemons.value.includes(pokemonName)) {
            comparePokemons.value.push(pokemonName);
        }
    };

    const removePokemon = (pokemonName: string) => {
        comparePokemons.value = comparePokemons.value.filter(p => p !== pokemonName);
    };

    const clearComparison = () => {
        comparePokemons.value = [];
    };

    const canAddPokemon = computed(() => comparePokemons.value.length < 2);

    const isPokemonCompare = (pokemonName: string) => {
        return comparePokemons.value.includes(pokemonName)
    }

    return {
        comparePokemons,
        pokemonCompareList,
        addPokemon,
        removePokemon,
        clearComparison,
        canAddPokemon,
        isPokemonCompare
    };
}