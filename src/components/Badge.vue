<template>
    <span
        :class="['px-2 py-1 text-xs rounded-full text-white h-max capitalize', `bg-${typeColor} border border-${typeColor} select-none`, { [`!bg-transparent text-zinc-800 dark:text-white`]: outline }]">
        {{ typeName }}
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { typeColors } from "../utils/typeColors";
const props = defineProps<{
    typeName: string;
    outline?: boolean;
}>()



const typeColor = computed(() => {
    return typeColors[props.typeName.toLowerCase() as keyof typeof typeColors] || 'bg-gray-400';
});
</script>