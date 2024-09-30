<template>
    <h1 class="text-2xl font-bold">{{ pokemonDetails?.name }} Details</h1>
    <div v-for="stats in pokemonDetails?.stats" :key="stats.stat.name">
        <p>{{ stats.stat.name }}</p>
        <div class="flex gap-2 items-center">
            <h1>{{ animatedStats[stats.stat.name] }}</h1>
            <Progress :model-value="animatedStats[stats.stat.name]" class="w-96" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { usePokemonDetails } from '../composables/usePokemonDetails';
import { PokemonDetails } from '../types';
import Progress from '../components/ui/progress/Progress.vue';

const { getEachPokemon } = usePokemonDetails()

const pokemonId = useRoute().params.id as string;
const pokemonDetails = ref<PokemonDetails | null>(null);
const animatedStats = reactive<Record<string, number>>({});

onMounted(async () => {
    pokemonDetails.value = await getEachPokemon(pokemonId);
    console.log(pokemonDetails.value);
    
    if (pokemonDetails.value) {
        pokemonDetails.value.stats.forEach(stat => {
            animatedStats[stat.stat.name] = 0;
            animateValue(stat.stat.name, stat.base_stat);
        });
    }
})

function animateValue(statName: string, targetValue: number, duration: number = 1000) {
    let startTime: number | null = null;
    
    function step(timestamp: number) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        animatedStats[statName] = Math.floor(progress * targetValue);
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}
</script>