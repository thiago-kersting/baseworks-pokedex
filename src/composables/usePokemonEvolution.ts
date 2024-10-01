import { usePokemonDetails } from "../api/usePokemonDetails";
import { PokemonSpeciesEvolution } from "../types";

export function usePokemonEvolution() {
  const { getEachPokemon } = usePokemonDetails();

  async function getPokemonSpecies(name: string | undefined) {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${name}`
    );
    return await response.json();
  }

  async function getPokemonEvolutions(
    name: string | undefined
  ): Promise<PokemonSpeciesEvolution> {
    const data = await getPokemonSpecies(name);
    const evolutionResponse = await fetch(data.evolution_chain.url);
    const { chain } = await evolutionResponse.json();

    const firstEvolution = chain.evolves_to[0] || null;
    const secondEvolution = firstEvolution?.evolves_to[0] || null;

    return {
      firstEvolution: await getEachPokemon(chain.species.name),
      secondEvolution:
        firstEvolution && (await getEachPokemon(firstEvolution.species.name)),
      thirdEvolution:
        secondEvolution && (await getEachPokemon(secondEvolution.species.name)),
      firstEvolutionLevel:
        firstEvolution?.evolution_details[0]?.min_level || null,
      secondEvolutionLevel:
        secondEvolution?.evolution_details[0]?.min_level || null,
    };
  }

  return { getPokemonEvolutions };
}
