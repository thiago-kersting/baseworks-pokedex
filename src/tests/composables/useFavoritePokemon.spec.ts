import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFavoritePokemon } from "@/composables/useFavoritePokemon";
/* import * as usePokemonDetailsModule from "@/api/usePokemonDetails"; */


// Mock do módulo usePokemonDetails
vi.mock("@/api/usePokemonDetails", () => ({
  usePokemonDetails: vi.fn(),
}));

describe("useFavoritePokemon", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Configurar o mock do usePokemonDetails para cada teste
    /* vi.mocked(usePokemonDetailsModule.usePokemonDetails).mockReturnValue({
      getEachPokemon: vi.fn((name) => {
        return Promise.resolve({
          name: name,
          id: 1,
          order: 1,
          sprites: {
            front_default: 'url_to_default_sprite',
            front_gif: 'url_to_gif_sprite',
            front_shiny: 'url_to_shiny_sprite'
          },
          types: [{ slot: 1, type: { name: "grass", url: "url" } }], // Exato 1 elemento
          stats: [{ base_stat: 50, effort: 0, stat: { name: "hp" } }] // Exemplo de estatísticas
        });
      }),
    }); */
  });
});

it("should initialize with empty favoritePokemons", () => {
  const { favoritePokemons } = useFavoritePokemon();
  expect(favoritePokemons.value).toEqual([]);
});

it("should add a Pokémon to favorites when toggleFavorite is called", () => {
  const { favoritePokemons, toggleFavorite } = useFavoritePokemon();
  toggleFavorite("pikachu");
  expect(favoritePokemons.value).toContain("pikachu");
  toggleFavorite("pikachu"); // Remove do mock após o teste
});

it("should remove a Pokémon from favorites when toggleFavorite is called twice", () => {
  const { favoritePokemons, toggleFavorite } = useFavoritePokemon();
  toggleFavorite("pikachu");
  toggleFavorite("pikachu");
  expect(favoritePokemons.value).not.toContain("pikachu");
});

it("should correctly indicate if a Pokémon is favorite", () => {
  const { isFavorite, toggleFavorite } = useFavoritePokemon();
  expect(isFavorite("pikachu")).toBe(false);
  toggleFavorite("pikachu");
  expect(isFavorite("pikachu")).toBe(true);
  toggleFavorite("pikachu"); // Remove pikachu do localStorage
});

it("should update the pokemonFavoriteList when favoritePokemons changes", async () => {
  const { pokemonFavoriteList, toggleFavorite, favoritePokemons } = useFavoritePokemon();

  // Limpa os favoritos antes do teste
  favoritePokemons.value = [];

  // Atualiza favoritePokemons para simular a adição de um Pokémon
  toggleFavorite("bulbasaur");

  // Aguarda o ciclo de promise resolver e a atualização do watch
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(pokemonFavoriteList.value).toHaveLength(1);
  expect(pokemonFavoriteList.value[0].name).toBe("bulbasaur");

  // Limpa os favoritos após o teste
  favoritePokemons.value = [];
});
