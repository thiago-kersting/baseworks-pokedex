<template>
    <span
        :class="['px-2 py-1 text-xs rounded-full text-white h-max capitalize', `bg-${typeColor} border border-${typeColor} select-none`, { [`!bg-transparent text-zinc-800 dark:text-white`]: outline }]">
        {{ typeName }}
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    typeName: string;
    outline?: boolean;
}>()

const typeColors = {
    normal: 'gray-600',
    fire: 'red-500',
    water: 'blue-800',
    electric: 'yellow-600',
    grass: 'green-500',
    ice: 'blue-500',
    fighting: 'red-700',
    poison: 'purple-500',
    ground: 'yellow-600',
    flying: 'indigo-600',
    psychic: 'pink-800',
    bug: 'lime-500',
    rock: 'yellow-700',
    ghost: 'purple-700',
    dragon: 'indigo-700',
    dark: 'gray-700',
    steel: 'gray-500',
    fairy: 'pink-500',
};

const typeColor = computed(() => {
    return typeColors[props.typeName.toLowerCase() as keyof typeof typeColors] || 'bg-gray-400';
});
</script>