import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePokemonDetails } from "../../api/usePokemonDetails";

// Mock global fetch
global.fetch = vi.fn();

describe("usePokemonDetails", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("deve retornar null quando pokemonNameOrId não for fornecido", async () => {
    const { getEachPokemon } = usePokemonDetails();
    const result = await getEachPokemon("");
    expect(result).toBeNull();
  });

  it("deve retornar detalhes do Pokémon quando a requisição for bem-sucedida", async () => {
    const mockPokemonData = {
      id: 25,
      name: "pikachu",
      order: 35,
      sprites: {
        other: {
          "official-artwork": {
            front_default: "url-to-front-default",
            front_shiny: "url-to-front-shiny",
          },
          showdown: {
            front_default: "url-to-front-gif",
          },
        },
      },
      types: [{ type: { name: "electric" } }],
      stats: [{ base_stat: 55, stat: { name: "hp" } }],
    };

    // Mock da resposta do fetch
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemonData),
    } as Response);

    const { getEachPokemon } = usePokemonDetails();
    const result = await getEachPokemon("pikachu");

    expect(result).toEqual({
      id: 25,
      name: "pikachu",
      types: [{ type: { name: "electric" } }],
      stats: [{ base_stat: 55, stat: { name: "hp" } }],
      order: "035",
      sprites: {
        front_default: "url-to-front-default",
        front_gif: "url-to-front-gif",
        front_shiny: "url-to-front-shiny",
      },
    });
  });

  it("deve retornar null quando ocorrer um erro na requisição", async () => {
    // Mock de um erro no fetch
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Erro na API"));

    const { getEachPokemon } = usePokemonDetails();
    const result = await getEachPokemon("invalid-pokemon");

    expect(result).toBeNull();
  });

  it("deve formatar corretamente o order quando for menor que 100", async () => {
    const mockPokemonData = {
      id: 25,
      name: "pikachu",
      order: 35,
      sprites: { other: {} },
      types: [],
      stats: [],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemonData),
    } as Response);

    const { getEachPokemon } = usePokemonDetails();
    const result = await getEachPokemon("pikachu");

    expect(result?.order).toBe("035");
  });

  it("deve formatar corretamente o order quando for maior ou igual a 1000", async () => {
    const mockPokemonData = {
      id: 1000,
      name: "bigpokemon",
      order: 1000,
      sprites: { other: {} },
      types: [],
      stats: [],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemonData),
    } as Response);

    const { getEachPokemon } = usePokemonDetails();
    const result = await getEachPokemon("bigpokemon");

    expect(result?.order).toBe("1000");
  });

  it("deve lidar corretamente com sprites ausentes", async () => {
    const mockPokemonData = {
      id: 9999,
      name: "missingsprites",
      order: 9999,
      sprites: { other: {} },
      types: [],
      stats: [],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemonData),
    } as Response);

    const { getEachPokemon } = usePokemonDetails();
    const result = await getEachPokemon("missingsprites");

    expect(result?.sprites).toEqual({
      front_default: undefined,
      front_gif: undefined,
      front_shiny: undefined,
    });
  });

  it("deve retornar null quando pokemonNameOrId for null", async () => {
    const { getEachPokemon } = usePokemonDetails();
    const result = await getEachPokemon(null as unknown as string);
    expect(result).toBeNull();
  });

  
  it("deve retornar null quando pokemonNameOrId for undefined", async () => {
    const { getEachPokemon } = usePokemonDetails();
    const result = await getEachPokemon(undefined as unknown as string);
    expect(result).toBeNull();
  });
  
});
