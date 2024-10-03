# Pokédex

## Descrição do Projeto
Este projeto é uma Pokédex interativa desenvolvida com Vite, Vue 3, TypeScript e Pinia. O objetivo é fornecer uma interface amigável para visualizar informações sobre Pokémons.

## Funcionalidades
- **Listagem de Pokémons**: Visualize uma lista de Pokémons com informações básicas.
- **Detalhes do Pokémons**: Clique em um Pokémon para ver detalhes adicionais, variações, estatísticas e evoluções (podem ser clicadas para navegação entre pokémons).
- **Pesquisa**: Pesquise Pokémons por nome ou id.
- **Filtro por Tipo**: Filtre Pokémons por tipo para facilitar a busca.
- **Comparar Pokémons**: Selecione dois Pokémons usando o ícone de balança nos cards, irá aparecer um botão flutuante abaixo, ao apertar sera possivel comparar suas estatísticas lado a lado, facilitando a análise de suas habilidades e atributos.
- **Favoritar Pokémons**: Adicione Pokémons aos seus favoritos clicando na estrela em seu card. Os Pokémons favoritos ficarão disponíveis na seção de filtros, mesmo após você fechar a página, permitindo acesso rápido e fácil a eles sempre que precisar!

## Tecnologias Utilizadas
- **Vite**
- **Vue 3**
- **TypeScript**
- **Pinia**
- **Tailwind**
- **Vitest**

## Decisões Técnicas
### Pinia Store - Gerenciamento de estado
- Optei utilzar o Pinia para gerenciamento de estado por ser o recomendado na documentação do VueJS, e também por certa familiaridade com essa tecnologia.
- Dentro da minha store criei um cache para os pokémons já carregados, para que ao trocar os filtros, não houvessem chamadas a api desnecessárias e nem duplicatas.
- Também, garanti que a páginação fosse feita tanto na busca de pokémons por tipo, quanto na busca de pokémons gerais, utilizando as composables.

### Composables - Lógica de negócio
- **Utilizei as composables para criar as regras de negócio citadas abaixo:**
- useComparePokemons - Lógica de negócio para comparar pokémons, e deixar salvo no local storage.
- useFavoritePokemons - Lógica de negócio para favoritar pokémons, e deixar salvo no local storage.
- useFilteredPokemons - Lógica de negócio para filtrar os pokémons por tipos, nome e id, garantindo sempre sua ordenação, a preferência da procura por dados localmente, e se necessário a procura de dados chamando as funções da seção API.

### Pasta API - Conexões a API PokeApi v2
- **Utilizei essa pasta para colocar de forma organizada as requisições a API e seus tratamentos de erros, criando assim os arquivos**
- usePokemonByType.ts
- usePokemonDetails.ts
- usePokemonEvolution.ts
- usePokemonList.ts

### Decisões gerais
- Uso da biblioteca vue-i18n para garantir os idiomas: pt-BR e En.
- Uso da biblioteca @vueuse para algumas funcionalidades como o InfiniteScroll e useLocalStorage.
- Uso da biblioteca @vueuse/motion para animações.
- Utilizei as composables criadas para buscar informações somente quando necessário, assim, utilizando o InfiniteScroll, para carregar os dados ao chegar no final da página e garantir uma boa usabilidade para o usuário.
- Uso do TailwindCSS por familiaridade e agilidade no processo de desenvolvimento.


## Instalação

1. Clone o repositório:
   ```bash
   git clone git@github.com:thiago-kersting/baseworks-pokedex.git
   cd baseworks-pokedex
   ```

2. Instale as dependências:
    ```bash
   npm install
   ```
   
3. Abra o projeto como desenvolvedor:
   ```bash
   npm run dev
   ```
  * Verifique a porta que abriu o projeto, sendo normalmente a porta http://localhost:5173/

4. Rode os testes:
   ```bash
   npm run test
   ```
* Uma janela ira abrir do Vitest UI mostrando os testes

💜Link do projeto: https://baseworks-pokedex.vercel.app/
  
