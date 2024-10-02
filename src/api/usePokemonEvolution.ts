import { usePokemonDetails } from "./usePokemonDetails";
import { PokemonSpeciesEvolution } from "../types";

export function usePokemonEvolution() {
  const { getEachPokemon } = usePokemonDetails();

  async function getPokemonSpecies(name: string | undefined) {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${name}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar espécie do Pokémon ${name}:`, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async function getPokemonEvolutions(
    name: string | undefined
  ): Promise<PokemonSpeciesEvolution | null> {
    try {
      const data = await getPokemonSpecies(name);
      const evolutionResponse = await fetch(data.evolution_chain.url);
      if (!evolutionResponse.ok) {
        throw new Error(`HTTP error! status: ${evolutionResponse.status}`);
      }
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
    } catch (error) {
      console.error(`Erro ao buscar evoluções do Pokémon ${name}:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  return { getPokemonEvolutions };
}
