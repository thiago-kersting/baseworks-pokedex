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
  front_gif: string;
  front_shiny: string;
}

export interface PokemonDetails {
  name: string;
  order: number;
  sprites: PokemonSprites;
  types: [{ slot: number; type: { name: string; url: string } }];
  id: string;
  stats: [
    { base_stat: number; effort: number; stat: { name: string; url: string } }
  ];
}

export interface PokemonStoreState {
  pokemonList: Ref<PokemonDetails[]>;
  currentPage: Ref<number>;
  isLoading: Ref<boolean>;
}

export interface PokemonStoreActions {
  getListPokemons: () => Promise<void>;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonSpeciesEvolution {
  firstEvolution: PokemonDetails | null;
  secondEvolution: PokemonDetails | null;
  thirdEvolution: PokemonDetails | null;
  firstEvolutionLevel: number | null;
  secondEvolutionLevel: number | null;
}
