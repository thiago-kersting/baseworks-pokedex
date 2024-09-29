import { Ref } from "vue";

export interface PokemonListItem {
    name: string;
    url: string;
}

export interface PokemonListResponse {
    results: PokemonListItem[];
}

export interface PokemonSprites {
    front_default: string;
}

export interface PokemonDetails {
    name: string;
    order: number;
    sprites: PokemonSprites;
    types: [{ slot: number, type: { name: string, url: string } }];
}

export interface PokemonStoreState {
    pokemonList: Ref<PokemonDetails[]>;
    currentPage: Ref<number>;
    isLoading: Ref<boolean>;
}

export interface PokemonStoreActions {
    getListPokemons: () => Promise<void>;
}