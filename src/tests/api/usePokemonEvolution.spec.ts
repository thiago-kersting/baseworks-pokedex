import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePokemonEvolution } from "../../api/usePokemonEvolution";
import * as usePokemonDetailsModule from "../../api/usePokemonDetails";

// Mock do módulo usePokemonDetails
vi.mock("../../api/usePokemonDetails", () => ({
  usePokemonDetails: vi.fn(),
}));

// Mock global fetch
global.fetch = vi.fn();

describe("usePokemonEvolution", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Configurar o mock do usePokemonDetails para cada teste
    vi.mocked(usePokemonDetailsModule.usePokemonDetails).mockReturnValue({
      getEachPokemon: vi.fn(),
    });
  });

  it("deve retornar as evoluções corretas para um Pokémon com três estágios", async () => {
    // Mock das respostas da API
    const mockSpeciesResponse = {
      evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/1/" },
    };
    const mockEvolutionChainResponse = {
      chain: {
        species: { name: "bulbasaur" },
        evolves_to: [
          {
            species: { name: "ivysaur" },
            evolution_details: [{ min_level: 16 }],
            evolves_to: [
              {
                species: { name: "venusaur" },
                evolution_details: [{ min_level: 32 }],
              },
            ],
          },
        ],
      },
    };

    // Mock das chamadas fetch
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockSpeciesResponse),
      } as Response)
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockEvolutionChainResponse),
      } as Response);

    // Mock do getEachPokemon
    const mockGetEachPokemon = vi
      .fn()
      .mockResolvedValueOnce({ name: "bulbasaur", id: 1 })
      .mockResolvedValueOnce({ name: "ivysaur", id: 2 })
      .mockResolvedValueOnce({ name: "venusaur", id: 3 });
    vi.mocked(usePokemonDetailsModule.usePokemonDetails).mockReturnValue({
      getEachPokemon: mockGetEachPokemon,
    });

    const { getPokemonEvolutions } = usePokemonEvolution();
    const result = await getPokemonEvolutions("bulbasaur");

    expect(result).toEqual({
      firstEvolution: { name: "bulbasaur", id: 1 },
      secondEvolution: { name: "ivysaur", id: 2 },
      thirdEvolution: { name: "venusaur", id: 3 },
      firstEvolutionLevel: 16,
      secondEvolutionLevel: 32,
    });
  });

  it("deve lidar corretamente com Pokémon que não evoluem", async () => {
    const mockSpeciesResponse = {
      evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/1/" },
    };
    const mockEvolutionChainResponse = {
      chain: {
        species: { name: "ditto" },
        evolves_to: [],
      },
    };

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockSpeciesResponse),
      } as Response)
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockEvolutionChainResponse),
      } as Response);

    const mockGetEachPokemon = vi
      .fn()
      .mockResolvedValueOnce({ name: "ditto", id: 132 });
    vi.mocked(usePokemonDetailsModule.usePokemonDetails).mockReturnValue({
      getEachPokemon: mockGetEachPokemon,
    });

    const { getPokemonEvolutions } = usePokemonEvolution();
    const result = await getPokemonEvolutions("ditto");

    expect(result).toEqual({
      firstEvolution: { name: "ditto", id: 132 },
      secondEvolution: null,
      thirdEvolution: null,
      firstEvolutionLevel: null,
      secondEvolutionLevel: null,
    });
  });

  it("deve lidar com erros na chamada da API", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Erro na API"));

    const { getPokemonEvolutions } = usePokemonEvolution();

    await expect(getPokemonEvolutions("error-pokemon")).rejects.toThrow(
      "Erro na API"
    );
  });
});
