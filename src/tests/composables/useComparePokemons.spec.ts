import { describe, it, expect, beforeEach } from 'vitest';
import { useComparePokemons } from '@/composables/useComparePokemons';
import { setActivePinia, createPinia } from 'pinia';

describe('useComparePokemons', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('deve adicionar Pokémon à lista de comparação', () => {
        const { addPokemon, comparePokemons } = useComparePokemons();
        addPokemon('Pikachu');
        expect(comparePokemons.value).toContain('Pikachu');
    });

    it('não deve adicionar o mesmo Pokémon duas vezes', () => {
        const { addPokemon, comparePokemons } = useComparePokemons();
        addPokemon('Pikachu');
        addPokemon('Pikachu');
        expect(comparePokemons.value).toEqual(['Pikachu']);
    });

    it('deve remover Pokémon da lista de comparação', () => {
        const { addPokemon, removePokemon, comparePokemons } = useComparePokemons();
        addPokemon('Pikachu');
        removePokemon('Pikachu');
        expect(comparePokemons.value).not.toContain('Pikachu');
    });

    it('deve limpar a lista de comparação', () => {
        const { addPokemon, clearComparison, comparePokemons } = useComparePokemons();
        addPokemon('Pikachu');
        clearComparison();
        expect(comparePokemons.value).toEqual([]);
    });

    it('deve permitir adicionar até 2 Pokémon', () => {
        const { addPokemon, removePokemon, canAddPokemon } = useComparePokemons();
        addPokemon('Pikachu');
        expect(canAddPokemon.value).toBe(true);
        addPokemon('Charmander');
        expect(canAddPokemon.value).toBe(false);
        removePokemon('Pikachu')
        removePokemon('Charmander')
    });

    it('deve indicar se um Pokémon está na lista de comparação', () => {
        const { addPokemon, isPokemonCompare } = useComparePokemons();
        addPokemon('Pikachu');
        expect(isPokemonCompare('Pikachu')).toBe(true);
        expect(isPokemonCompare('Charmander')).toBe(false);
    });
});
