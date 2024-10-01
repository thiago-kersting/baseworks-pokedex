<template>
    <main class="relative min-h-screen w-full overflow-hidden">
        <!-- Fundo escuro -->
        <div v-if="isDark"
            class="absolute top-0 z-[-2] h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        </div>
        <!-- Fundo claro -->
        <div v-else
            class="absolute top-0 z-[-2] h-full w-full bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        </div>

        <section class="relative z-10 min-h-screen py-4 px-4 flex items-center justify-center">
            <div v-if="pokemonDetails" class="w-full max-w-7xl bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6">
                <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <!-- Coluna da esquerda -->
                    <div class="flex-shrink-0 w-1/3">
                        <img :src="pokemonDetails.sprites.front_default" :alt="pokemonDetails.name"
                            class="w-full h-auto object-contain mb-4">
                        <h1 class="text-3xl font-bold capitalize mb-2 text-center">{{ pokemonDetails.name }}</h1>
                        <div class="flex gap-2 mb-4 justify-center">
                            <Badge v-for="type in pokemonDetails.types" :key="type.type.name"
                                :typeName="type.type.name" />
                        </div>
                    </div>

                    <!-- Coluna da direita -->
                    <div class="flex-grow mt-10">
                        <h2 class="text-2xl font-semibold mb-4">Estatísticas</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div v-for="stat in pokemonDetails.stats" :key="stat.stat.name"
                                class="bg-white/5 rounded-lg p-3">
                                <p class="text-sm font-medium capitalize mb-1">{{ stat.stat.name }}</p>
                                <div class="flex items-center gap-2">
                                    <span class="text-lg font-bold w-8">{{ animatedStats[stat.stat.name] }}</span>
                                    <Progress :model-value="animatedStats[stat.stat.name]" :max="120"
                                        class="flex-grow" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 flex flex-wrap justify-around gap-8">
                    <div class="flex flex-col items-center justify-center">
                        <h3 class="text-xl font-semibold mb-2">Variations</h3>
                        <div class="flex items-center justify-center gap-4">
                            <div class="flex flex-col justify-center items-center"
                                v-if="pokemonDetails.sprites.front_shiny">
                                <img :src="pokemonDetails.sprites.front_shiny" :alt="`${pokemonDetails.name} shiny`"
                                    class="w-24 h-24 object-contain">
                                <p class="text-sm mt-1">Shiny</p>
                            </div>
                            <div class="flex flex-col justify-center items-center"
                                v-if="pokemonDetails.sprites.front_gif">
                                <img :src="pokemonDetails.sprites.front_gif" :alt="`${pokemonDetails.name} shiny`"
                                    class="w-24 h-24 object-contain">
                                <p class="text-sm mt-1">Animated</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="evolutions">
                        <h3 class="text-xl font-semibold mb-2">Evolutions</h3>
                        <div class="flex items-center">
                            <div v-if="evolutions.firstEvolution" class="text-center">
                                <router-link :to="`/details/${evolutions.firstEvolution.id}`">
                                    <img :src="evolutions.firstEvolution.sprites.front_default"
                                        :alt="evolutions.firstEvolution.name"
                                        class="w-24 h-24 object-contain cursor-pointer hover:opacity-80 transition-opacity">
                                    <p class="text-sm mt-1 capitalize">{{ evolutions.firstEvolution.name }}</p>
                                </router-link>
                            </div>
                            <div v-if="evolutions.secondEvolution" class="flex items-center">
                                <div class="mx-2 text-center">
                                    <p class="text-xs" v-if="evolutions.firstEvolutionLevel">Nível {{
                                        evolutions.firstEvolutionLevel }}</p>
                                    <span class="text-2xl">→</span>
                                </div>
                                <router-link :to="`/details/${evolutions.secondEvolution.id}`" class="text-center">
                                    <img :src="evolutions.secondEvolution.sprites.front_default"
                                        :alt="evolutions.secondEvolution.name"
                                        class="w-24 h-24 object-contain cursor-pointer hover:opacity-80 transition-opacity">
                                    <p class="text-sm mt-1 capitalize">{{ evolutions.secondEvolution.name }}</p>
                                </router-link>
                            </div>
                            <div v-if="evolutions.thirdEvolution" class="flex items-center">
                                <div class="mx-2 text-center">
                                    <p class="text-xs" v-if="evolutions.secondEvolutionLevel">Nível {{
                                        evolutions.secondEvolutionLevel }}</p>
                                    <span class="text-2xl">→</span>
                                </div>
                                <router-link :to="`/details/${evolutions.thirdEvolution.id}`" class="text-center">
                                    <img :src="evolutions.thirdEvolution.sprites.front_default"
                                        :alt="evolutions.thirdEvolution.name"
                                        class="w-24 h-24 object-contain cursor-pointer hover:opacity-80 transition-opacity">
                                    <p class="text-sm mt-1 capitalize">{{ evolutions.thirdEvolution.name }}</p>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <button @click="$router.push('/')"
                    class="mt-6 px-4 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-600 transition-colors">
                    Voltar para a lista
                </button>
            </div>
        </section>
    </main>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePokemonDetails } from '../composables/usePokemonDetails';
import { PokemonDetails, PokemonSpeciesEvolution } from '../types';
import Progress from '../components/ui/progress/Progress.vue';
import Badge from '../components/Badge.vue';
import { useDark } from '@vueuse/core';
import { usePokemonEvolution } from '../composables/usePokemonEvolution';

const isDark = useDark();
const { getEachPokemon } = usePokemonDetails();
const { getPokemonEvolutions } = usePokemonEvolution()

const route = useRoute();

const pokemonId = computed(() => route.params.id as string);
const pokemonDetails = ref<PokemonDetails | null>(null);
const evolutions = ref<PokemonSpeciesEvolution | null>(null);
const animatedStats = reactive<Record<string, number>>({});

const fetchPokemonInfos = async () => {
    pokemonDetails.value = await getEachPokemon(route.params.id);

    evolutions.value = await getPokemonEvolutions(pokemonDetails.value?.name)

    if (pokemonDetails.value) {
        pokemonDetails.value.stats.forEach(stat => {
            animatedStats[stat.stat.name] = 0;
            animateValue(stat.stat.name, stat.base_stat);
        });
    }
}

onMounted(async () => {
    await fetchPokemonInfos()
});

watch(route, () => fetchPokemonInfos());

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