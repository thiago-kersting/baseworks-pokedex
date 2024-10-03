import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useFilteredPokemons } from "@/composables/useFilteredPokemons";
import { usePokemonDetails } from "@/api/usePokemonDetails";
import { ref, nextTick } from 'vue';
import { PokemonDetails } from "@/types";

// Mock dos módulos
vi.mock("@/stores/pokemonStore", () => ({
  usePokemonStore: vi.fn(() => ({
    pokemonList: ref<PokemonDetails[]>([
      { 
        name: "bulbasaur", 
        order: 1,
        sprites: { front_default: "", front_gif: "", front_shiny: "" },
        types: [{ slot: 1, type: { name: "grass", url: "teste" } }],
        id: "1",
        stats: [{ base_stat: 0, effort: 0, stat: { name: "", url: "" } }]
      },
      { 
        name: "charmander", 
        order: 4,
        sprites: { front_default: "", front_gif: "", front_shiny: "" },
        types: [{ slot: 1, type: { name: "fire", url: "teste" } }],
        id: "4",
        stats: [{ base_stat: 0, effort: 0, stat: { name: "", url: "" } }]
      },
    ])
  }))
}));

vi.mock("@/api/usePokemonDetails", () => ({
  usePokemonDetails: vi.fn(),
}));

describe("useFilteredPokemons", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();

    // Mock do usePokemonDetails
    vi.mocked(usePokemonDetails).mockReturnValue({
      getEachPokemon: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deve inicializar com valores padrão", () => {
    const {
      searchPokemon,
      selectedTypes,
      filteredPokemonsList,
    } = useFilteredPokemons();

    expect(searchPokemon.value).toBe("");
    expect(selectedTypes.value).toEqual([]);
    expect(filteredPokemonsList.value).toEqual([]);
  });


  it("deve remover um tipo do filtro", () => {
    const { toggleTypeFilter, selectedTypes } = useFilteredPokemons();

    toggleTypeFilter("grass");
    expect(selectedTypes.value).toEqual(['grass']);
    toggleTypeFilter("grass");
    expect(selectedTypes.value).toEqual([]);
  });

  it("deve limpar todos os tipos selecionados", () => {
    const { toggleTypeFilter, cleanTypes, selectedTypes } = useFilteredPokemons();

    toggleTypeFilter("grass");
    toggleTypeFilter("fire");
    cleanTypes();
    expect(selectedTypes.value).toEqual([]);
  });

  it("deve selecionar todos os tipos", () => {
    const { selectAllTypes, selectedTypes } = useFilteredPokemons();

    const allTypes = ["grass", "fire", "water"];
    selectAllTypes(allTypes);
    expect(selectedTypes.value).toEqual(allTypes);
  });


  it("não deve buscar pokémon se nenhum tipo estiver selecionado", async () => {
    const { searchPokemon, filteredPokemonsList, selectedTypes } = useFilteredPokemons();
    const mockGetEachPokemon = vi.fn();
    vi.mocked(usePokemonDetails).mockReturnValue({
      getEachPokemon: mockGetEachPokemon,
    });

    searchPokemon.value = "pikachu";
    
    // Aguardar o debounce e a atualização do estado
    await vi.runAllTimersAsync();
    await nextTick();

    expect(mockGetEachPokemon).not.toHaveBeenCalled();
    expect(filteredPokemonsList.value).toEqual([]);
    expect(selectedTypes.value).toEqual([]);
  });

  it("deve retornar uma lista vazia se nenhum tipo estiver selecionado", () => {
    const { filteredPokemonsList } = useFilteredPokemons();
    expect(filteredPokemonsList.value).toEqual([]);
  });
});