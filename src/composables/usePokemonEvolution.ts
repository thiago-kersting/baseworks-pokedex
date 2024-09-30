import { usePokemonDetails } from './usePokemonDetails';
import { PokemonSpeciesEvolution } from "../types";

export function usePokemonEvolution() {
    const { getEachPokemon } = usePokemonDetails();

    async function getPokemonSpecies(name: string | undefined) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
        const data = await response.json()
        return data
    }

    async function getPokemonEvolutions(name: string | undefined): Promise<PokemonSpeciesEvolution> {
        const data = await getPokemonSpecies(name);
        const evolutionResponse = await fetch(data.evolution_chain.url)
        const evolutionData = await evolutionResponse.json()
        
        const PokemonSpeciesEvolution: PokemonSpeciesEvolution = {
            firstEvolution: await getEachPokemon(evolutionData.chain.species.name),
            secondEvolution: evolutionData.chain.evolves_to[0]
                ? await getEachPokemon(evolutionData.chain.evolves_to[0].species.name)
                : null,
            thirdEvolution: evolutionData.chain.evolves_to[0]?.evolves_to[0]
                ? await getEachPokemon(evolutionData.chain.evolves_to[0].evolves_to[0].species.name)
                : null,
            firstEvolutionLevel: evolutionData.chain.evolves_to[0]?.evolution_details[0]?.min_level || null,
            secondEvolutionLevel: evolutionData.chain.evolves_to[0]?.evolves_to[0]?.evolution_details[0]?.min_level || null,
        }

        return PokemonSpeciesEvolution
    }

    return { getPokemonEvolutions }
}