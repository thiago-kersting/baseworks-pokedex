<template>
    <RouterLink :to="`/details/${pokemon.id}`">
        <div
            class="group hover:-translate-y-1 duration-700 cursor-pointer transition-all flex flex-col py-4 px-6 rounded-2xl w-72 dark:bg-white/5 bg-zinc-500/5 hover:bg-zinc-500/10 hover:dark:bg-white/10 backdrop-blur-md border border-white/20 hover:border-purple-400 shadow-lg">
            <div class="flex justify-between items-center mb-2">
                <p class="font-light">#{{ pokemon.order }}</p>
                <div class="flex items-center gap-2">
                    <button @click.stop.prevent="isPokemonCompare(pokemon.name) ? removePokemon(pokemon.name) : addPokemon(pokemon.name)">
                        <Icon v-if="isPokemonCompare(pokemon.name)" icon="icon-park-solid:imbalance" class="text-2xl" />
                        <Icon v-else :icon="pokemonCompareList.length < 2 ?'icon-park-outline:imbalance' : ''" class="text-2xl" />
                    </button>

                    <button @click.stop.prevent="toggleFavorite(pokemon.name)">
                        <Icon v-show="!isFavorite(pokemon.name)" icon="material-symbols-light:star-outline"
                            class="text-2xl" />
                        <Icon v-show="isFavorite(pokemon.name)" icon="material-symbols-light:star" class="text-2xl" />
                    </button>

                </div>
            </div>
            <div class="flex justify-center">
                <img :src="pokemon.sprites.front_default" alt="pokemon"
                    class="w-24 h-24 transition-transform duration-300 ease-in-out group-hover:scale-125 group-hover:rotate-3">
            </div>
            <div class="flex flex-col items-center justify-center gap-2 mt-2">
                <p class=" font-semibold capitalize">{{ pokemon.name }}</p>
                <div class="flex gap-2 items-end justify-end">
                    <Badge v-for="pokemonType in pokemon.types" :key="pokemonType.type.name"
                        :typeName="pokemonType.type.name" />
                </div>
            </div>
        </div>
    </RouterLink>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { PokemonDetails } from "@/types";
import Badge from "./BadgeType.vue";
import { useFavoritePokemon } from "@/composables/useFavoritePokemon";
import { useComparePokemons } from "@/composables/useComparePokemons";

const { pokemonCompareList, addPokemon, isPokemonCompare, removePokemon } = useComparePokemons();
const { isFavorite, toggleFavorite } = useFavoritePokemon()

const props = defineProps<{
    pokemon: PokemonDetails
}>()

</script>