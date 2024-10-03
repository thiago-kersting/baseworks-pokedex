import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFavoritePokemon } from "@/composables/useFavoritePokemon";
import * as usePokemonDetailsModule from "@/api/usePokemonDetails";

// Mock do módulo usePokemonDetails
vi.mock("@/api/usePokemonDetails", () => ({
  usePokemonDetails: vi.fn(),
}));

describe("useFavoritePokemon", () => {
  /* let favoritePokemonsMock: { value: string[] }; */

  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock do getEachPokemon
    vi.mocked(usePokemonDetailsModule.usePokemonDetails).mockReturnValue({
      getEachPokemon: vi.fn().mockResolvedValue({}), // Adicionando um retorno padrão
    });
  });

  it("deve inicializar com uma lista vazia de Pokémon favoritos", () => {
    const { favoritePokemons } = useFavoritePokemon();
    expect(favoritePokemons.value).toEqual([]);
  });

  it("deve adicionar um Pokémon à lista de favoritos", () => {
    const { favoritePokemons, toggleFavorite } = useFavoritePokemon();
    toggleFavorite("pikachu");
    expect(favoritePokemons.value).toContain("pikachu");
  });

  it("deve remover um Pokémon da lista de favoritos", () => {
    const { favoritePokemons, toggleFavorite } = useFavoritePokemon();
    favoritePokemons.value = ["pikachu"];
    toggleFavorite("pikachu");
    expect(favoritePokemons.value).not.toContain("pikachu");
  });

  it("deve verificar se um Pokémon é favorito", () => {
    const { favoritePokemons, isFavorite } = useFavoritePokemon();
    favoritePokemons.value = ["pikachu"];
    expect(isFavorite("pikachu")).toBe(true);
    expect(isFavorite("bulbasaur")).toBe(false);
  });

  it("deve ignorar Pokémon que não podem ser encontrados", async () => {
    const mockGetEachPokemon = vi.fn().mockResolvedValueOnce(null);
    vi.mocked(usePokemonDetailsModule.usePokemonDetails).mockReturnValue({
      getEachPokemon: mockGetEachPokemon,
    });

    const { favoritePokemons, pokemonFavoriteList, } = useFavoritePokemon();
    favoritePokemons.value = ["pikachu"];

    expect(mockGetEachPokemon).toHaveBeenCalledWith("pikachu");
    expect(pokemonFavoriteList.value).toEqual([]);
  });
});
