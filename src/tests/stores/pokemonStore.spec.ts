import { setActivePinia, createPinia } from 'pinia';
import { usePokemonStore } from '@/stores/pokemonStore';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PokemonDetails } from '@/types';

describe('pokemonStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('deve buscar a lista de pokémons', async () => {
        const store = usePokemonStore();
        // Mock da função fetchPokemonList
        const mockPokemonList: PokemonDetails[] = [
            {
                name: "Flareon",
                order: 136,
                sprites: {
                    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png",
                    front_gif: "https://play.pokemonshowdown.com/sprites/xyani/flareon.gif",
                    front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/136.png"
                },
                types: [
                    {
                        slot: 1,
                        type: {
                            name: "fire",
                            url: "https://pokeapi.co/api/v2/type/10/"
                        }
                    }
                ],
                id: "136",
                stats: [
                    {
                        base_stat: 130,
                        effort: 2,
                        stat: {
                            name: "attack",
                            url: "https://pokeapi.co/api/v2/stat/2/"
                        }
                    },
                ]
            }
        ];
        vi.spyOn(store, 'getListPokemons').mockImplementation(async () => {
            store.pokemonList = mockPokemonList; // Atualiza a lista diretamente
        });

        await store.getListPokemons();

        expect(store.pokemonList).toHaveLength(1);
        expect(store.pokemonList[0].name).toBe('Flareon');
    });

    it('deve buscar pokémons por tipo', async () => {
        const store = usePokemonStore();
        // Mock da função fetchByType
        const mockPokemonList: PokemonDetails[] = [
            {
                name: "Flareon",
                order: 136,
                sprites: {
                    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png",
                    front_gif: "https://play.pokemonshowdown.com/sprites/xyani/flareon.gif",
                    front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/136.png"
                },
                types: [
                    {
                        slot: 1,
                        type: {
                            name: "fire",
                            url: "https://pokeapi.co/api/v2/type/10/"
                        }
                    }
                ],
                id: "136",
                stats: [
                    {
                        base_stat: 130,
                        effort: 2,
                        stat: {
                            name: "attack",
                            url: "https://pokeapi.co/api/v2/stat/2/"
                        }
                    },
                ]
            }
        ];
        vi.spyOn(store, 'getListPokemonsByType').mockImplementation(async () => {
            store.pokemonList = [...store.pokemonList, ...mockPokemonList]; // Atualiza a lista diretamente
        });

        await store.getListPokemonsByType(['grass']);

        expect(store.pokemonList).toHaveLength(1);
        expect(store.pokemonList[0].name).toBe('Flareon');
    });

    it('deve lidar com o estado de loading', async () => {
        const store = usePokemonStore();
        expect(store.isLoading).toBe(false);

        const promise = store.getListPokemons();
        expect(store.isLoading).toBe(true);

        await promise;
        expect(store.isLoading).toBe(false);
    });

    it('deve buscar pokémons e atualizar a lista corretamente', async () => {
        const store = usePokemonStore();
        await store.getListPokemons();
        expect(store.pokemonList).toHaveLength(20); 
    });

    it('deve buscar pokémons por tipo e atualizar a lista corretamente', async () => {
        const store = usePokemonStore();
        await store.getListPokemonsByType(['fire']);
        expect(store.pokemonList).toHaveLength(20); // Verifique se a lista foi atualizada
    });

    it('deve lidar com o estado de loading corretamente', async () => {
        const store = usePokemonStore();
        expect(store.isLoading).toBe(false);

        const promise = store.getListPokemons();
        expect(store.isLoading).toBe(true);

        await promise;
        expect(store.isLoading).toBe(false);
    });

    // Adicione mais testes conforme necessário para cobrir outros casos
});
