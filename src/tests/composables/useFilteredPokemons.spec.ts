import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useFilteredPokemons } from "@/composables/useFilteredPokemons";
import { usePokemonStore } from "@/stores/pokemonStore";
import { usePokemonDetails } from "@/api/usePokemonDetails";
import { ref, nextTick } from 'vue';

// Mock dos módulos
vi.mock("@/stores/pokemonStore", () => ({
  usePokemonStore: vi.fn(() => ({
    pokemonList: ref([
      { name: "bulbasaur", types: [{ type: { name: "grass" } }] },
      { name: "charmander", types: [{ type: { name: "fire" } }] },
      { name: "squirtle", types: [{ type: { name: "water" } }] },
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

    // Atualize o mock do store para usar ref
    vi.mocked(usePokemonStore).mockReturnValue({
      pokemonList: ref([
        { name: "bulbasaur", types: [{ type: { name: "grass" } }] },
        { name: "charmander", types: [{ type: { name: "fire" } }] },
        { name: "squirtle", types: [{ type: { name: "water" } }] },
      ])
    });

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

  it("deve filtrar pokémons por tipo", () => {
    const { toggleTypeFilter, filteredPokemonsList } = useFilteredPokemons();

    toggleTypeFilter("grass");
    expect(filteredPokemonsList.value).toEqual([
      { name: "bulbasaur", types: [{ type: { name: "grass" } }] },
    ]);
  });

  it("deve remover um tipo do filtro", () => {
    const { toggleTypeFilter, selectedTypes } = useFilteredPokemons();

    toggleTypeFilter("grass");
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

  it("deve filtrar pokémons por nome", async () => {
    const { searchPokemon, filteredPokemonsList, toggleTypeFilter } = useFilteredPokemons();

    toggleTypeFilter("grass");
    toggleTypeFilter("fire");
    searchPokemon.value = "char";
    
    await vi.runAllTimersAsync();
    await nextTick();

    expect(filteredPokemonsList.value).toEqual([
      { name: "charmander", types: [{ type: { name: "fire" } }] },
    ]);
  });

    /* TO DO TESTE DE PEGAR NA API QUANDO NÃO HOUVER LOCALMENTE */

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
