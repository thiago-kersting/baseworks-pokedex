<template>
    <span :class="['px-2 py-1 text-xs rounded-full text-white', getTypeColor(type.name)]">
        {{ type.name }}
    </span>
</template>

<script setup lang="ts">
import { PokemonType } from "../types"

defineProps<{
    type: PokemonType['type']
}>()

const typeColors = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-200',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-700',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-700',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
};

const getTypeColor = (type: string): string => {
    return typeColors[type.toLowerCase() as keyof typeof typeColors] || 'bg-gray-400';
};
</script>