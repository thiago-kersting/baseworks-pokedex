import { describe, it, expect, vi } from 'vitest';
import { usePokemonByType } from '@/api/usePokemonByType';

describe('usePokemonByType', () => {
    it('deve buscar pokémons por tipo', async () => {
        const { fetchByType, isLoading } = usePokemonByType();
        const mockResponse = {
            pokemon: [
                { pokemon: { name: 'charmander', url: 'url1' } },
                { pokemon: { name: 'bulbasaur', url: 'url2' } },
            ],
        };

        // Mock da função fetch usando Vitest
        global.fetch = vi.fn().mockResolvedValueOnce({
            json: vi.fn().mockResolvedValueOnce(mockResponse),
        });

        const result = await fetchByType('fire', 0, 2);

        expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type/fire');
        expect(result).toEqual([
            { name: 'charmander', url: 'url1' },
            { name: 'bulbasaur', url: 'url2' },
        ]);
        expect(isLoading.value).toBe(false);
    });

    it('deve lidar com erros na busca', async () => {
        const { fetchByType, isLoading } = usePokemonByType();
        // Atualizando para usar vi.fn() em vez de jest.Mock
        global.fetch = vi.fn().mockRejectedValueOnce(new Error('Erro na busca'));

        await fetchByType('fire');

        expect(isLoading.value).toBe(false);
    });
});

