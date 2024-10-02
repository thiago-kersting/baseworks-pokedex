import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePokemonList } from "../../api/usePokemonList";

// Mock global fetch
global.fetch = vi.fn();

describe("usePokemonList", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("deve retornar uma lista vazia quando isLoading for true", async () => {
    const { getListPokemons, isLoading } = usePokemonList();
    isLoading.value = true;
    const result = await getListPokemons();
    expect(result).toEqual([]);
  });

  it("deve retornar uma lista de Pokémon quando a requisição for bem-sucedida", async () => {
    const mockPokemonList = {
      results: [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
      ],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(mockPokemonList),
    } as Response);

    const { getListPokemons } = usePokemonList();
    const result = await getListPokemons();

    expect(result).toEqual(mockPokemonList.results);
    expect(fetch).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20"
    );
  });

  it("deve incrementar a página atual após uma requisição bem-sucedida", async () => {
    const mockPokemonList = {
      results: [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      ],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(mockPokemonList),
    } as Response);

    const { getListPokemons, currentPage } = usePokemonList();
    await getListPokemons();

    expect(currentPage.value).toBe(2);
  });

  it("deve retornar uma lista vazia e logar o erro quando ocorrer um erro na requisição", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Erro na API"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { getListPokemons } = usePokemonList();
    const result = await getListPokemons();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Erro ao buscar os Pokémon:",
      expect.any(Error)
    );
  });

  it("deve definir isLoading como false após a requisição, mesmo em caso de erro", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Erro na API"));

    const { getListPokemons, isLoading } = usePokemonList();
    await getListPokemons();

    expect(isLoading.value).toBe(false);
  });

  it("deve usar o offset correto para a segunda página", async () => {
    const mockPokemonList = {
      results: [
        { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
      ],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(mockPokemonList),
    } as Response);

    const { getListPokemons, currentPage } = usePokemonList();
    currentPage.value = 2; // Simula que já estamos na segunda página
    await getListPokemons();

    expect(fetch).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20"
    );
  });
});
