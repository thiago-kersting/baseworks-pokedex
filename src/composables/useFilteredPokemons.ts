import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { usePokemonStore } from '../stores/pokemonStore'
import { usePokemonDetails } from './usePokemonDetails'
import { PokemonDetails } from '../types'

export function useFilteredPokemons() {
  const pokemonStore = usePokemonStore()
  const { pokemonList } = storeToRefs(pokemonStore)

  const searchPokemon = ref<string>("")
  const searchResult = ref<PokemonDetails | null>(null)
  const selectedTypes = ref<string[]>([])

  const { getEachPokemon } = usePokemonDetails()

  const searchPokemonDebounced = useDebounceFn(async () => {
    searchResult.value = null

    // Não buscar nada se não houver tipos selecionados
    if (selectedTypes.value.length === 0 || !searchPokemon.value.trim()) {
      return
    }

    const searchTerm = searchPokemon.value.trim().toLowerCase()

    // Primeiro, tentar encontrar localmente
    const localResult = pokemonList.value.find(pokemon => 
      pokemon.name.toLowerCase().startsWith(searchTerm)
    )

    if (localResult && localResult.types.some(type => selectedTypes.value.includes(type.type.name))) {
      searchResult.value = localResult
      return
    }

    // Caso não encontrado, buscar externamente
    const result = await getEachPokemon(searchTerm)
    if (result && result.types.some(type => selectedTypes.value.includes(type.type.name))) {
      searchResult.value = result
    }
  }, 300)

  const filteredPokemonsList = computed(() => {
    if (selectedTypes.value.length === 0) {
      return []
    }

    let filtered = pokemonList.value.filter(pokemon => 
      pokemon.types.some(type => selectedTypes.value.includes(type.type.name))
    )

    if (searchPokemon.value.trim()) {
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().startsWith(searchPokemon.value.toLowerCase())
      )

      if (filtered.length === 0 && searchResult.value) {
        return [searchResult.value]
      }
    }

    return filtered
  })

  const toggleTypeFilter = (type: string) => {
    if (selectedTypes.value.includes(type)) {
      selectedTypes.value = selectedTypes.value.filter(typeSelected => typeSelected !== type)
    } else {
      selectedTypes.value.push(type)
    }

    if (searchPokemon.value.trim()) {
      searchPokemonDebounced()
    }
  }

  const cleanTypes = () => {
    selectedTypes.value = []
  }

  const selectAllTypes = (typesFilter: string[]) => {
    selectedTypes.value = [...typesFilter]
  }

  return {
    searchPokemon,
    selectedTypes,
    filteredPokemonsList,
    toggleTypeFilter,
    cleanTypes,
    selectAllTypes,
    searchPokemonDebounced
  }
}
