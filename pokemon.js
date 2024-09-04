const MAX_POKEMON = 151;
const wrapperLista = document.querySelector(".list-wrapper");
const inputBusca = document.querySelector("#search-input");
const filtroNumero = document.querySelector("#number");
const filtroNome = document.querySelector("#name");
const mensagemNaoEncontrado = document.querySelector("#not-found-message");

let todosPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((resposta) => resposta.json())
  .then((dados) => {
    todosPokemons = dados.results;
    exibirPokemons(todosPokemons);
  });

async function buscarDadosPokemonAntesDeRedirecionar(id) {
  try {
    const [pokemon, especiePokemon] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return true;
  } catch (erro) {
    console.error("Falha ao buscar dados do Pokémon antes do redirecionamento");
  }
}

function exibirPokemons(pokemons) {
  wrapperLista.innerHTML = "";

  pokemons.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const itemLista = document.createElement("div");
    itemLista.className = "list-item";
    itemLista.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
        </div>
        <div class="name-wrap">
            <p class="body3-fonts">#${pokemon.name}</p>
        </div>
    `;

    itemLista.addEventListener("click", async () => {
      const sucesso = await buscarDadosPokemonAntesDeRedirecionar(pokemonID);
      if (sucesso) {
        window.location.href = `./detail.html?id=${pokemonID}`;
      }
    });

    wrapperLista.appendChild(itemLista);
  });
}

inputBusca.addEventListener("keyup", tratarBusca);

function tratarBusca() {
  const termoBusca = inputBusca.value.toLowerCase();
  let pokemonsFiltrados;

  if (filtroNumero.checked) {
    pokemonsFiltrados = todosPokemons.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(termoBusca);
    });
  } else if (filtroNome.checked) {
    pokemonsFiltrados = todosPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(termoBusca)
    );
  } else {
    pokemonsFiltrados = todosPokemons;
  }

  exibirPokemons(pokemonsFiltrados);

  if (pokemonsFiltrados.length === 0) {
    mensagemNaoEncontrado.style.display = "block";
  } else {
    mensagemNaoEncontrado.style.display = "none";
  }
}

const botaoFechar = document.querySelector(".search-close-icon");
botaoFechar.addEventListener("click", limparBusca);

function limparBusca() {
  inputBusca.value = "";
  exibirPokemons(todosPokemons);
  mensagemNaoEncontrado.style.display = "none";
}







//créditos Canal Manual do Dev (youtube)
// Api: Pokeapi
// Assets: Phosphor Icons