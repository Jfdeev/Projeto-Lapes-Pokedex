let pokemonAtualId = null;

document.addEventListener("DOMContentLoaded", () => {
  const MAX_POKEMONS = 151;
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./index.html");
  }

  pokemonAtualId = id;
  carregarPokemon(id);
});

async function carregarPokemon(id) {
  try {
    const [pokemon, especiePokemon] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);

    const habilidadesWrapper = document.querySelector(
      ".pokemon-detail-wrap .pokemon-detail.move"
    );
    habilidadesWrapper.innerHTML = "";

    if (pokemonAtualId === id) {
      exibirDetalhesPokemon(pokemon);
      const textoFlavor = obterTextoFlavorEmIngles(especiePokemon);
      document.querySelector(".body3-fonts.pokemon-description").textContent =
        textoFlavor;

      const [setaEsquerda, setaDireita] = ["#leftArrow", "#rightArrow"].map((sel) =>
        document.querySelector(sel)
      );
      setaEsquerda.removeEventListener("click", navegarPokemon);
      setaDireita.removeEventListener("click", navegarPokemon);

      if (id !== 1) {
        setaEsquerda.addEventListener("click", () => {
          navegarPokemon(id - 1);
        });
      }
      if (id !== 151) {
        setaDireita.addEventListener("click", () => {
          navegarPokemon(id + 1);
        });
      }

      window.history.pushState({}, "", `./detail.html?id=${id}`);
    }

    return true;
  } catch (erro) {
    console.error("Ocorreu um erro ao buscar dados do Pokémon:", erro);
    return false;
  }
}

async function navegarPokemon(id) {
  pokemonAtualId = id;
  await carregarPokemon(id);
}

const coresTipos = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  dark: "#EE99AC",
};

function definirEstilosElementos(elementos, propriedadeCss, valor) {
  elementos.forEach((elemento) => {
    elemento.style[propriedadeCss] = valor;
  });
}

function rgbaDeHex(corHex) {
  return [
    parseInt(corHex.slice(1, 3), 16),
    parseInt(corHex.slice(3, 5), 16),
    parseInt(corHex.slice(5, 7), 16),
  ].join(", ");
}

function definirCorDeFundoTipo(pokemon) {
  const tipoPrincipal = pokemon.types[0].type.name;
  const cor = coresTipos[tipoPrincipal];

  if (!cor) {
    console.warn(`Cor não definida para o tipo: ${tipoPrincipal}`);
    return;
  }

  const elementoPrincipalDetalhe = document.querySelector(".detail-main");
  definirEstilosElementos([elementoPrincipalDetalhe], "backgroundColor", cor);
  definirEstilosElementos([elementoPrincipalDetalhe], "borderColor", cor);

  definirEstilosElementos(
    document.querySelectorAll(".power-wrapper > p"),
    "backgroundColor",
    cor
  );

  definirEstilosElementos(
    document.querySelectorAll(".stats-wrap p.stats"),
    "color",
    cor
  );

  definirEstilosElementos(
    document.querySelectorAll(".stats-wrap .progress-bar"),
    "color",
    cor
  );

  const corRgba = rgbaDeHex(cor);
  const tagEstilo = document.createElement("style");
  tagEstilo.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${corRgba}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${cor};
    }
  `;
  document.head.appendChild(tagEstilo);
}

function capitalizarPrimeiraLetra(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function criarEAdicionarElemento(pai, tag, opcoes = {}) {
  const elemento = document.createElement(tag);
  Object.keys(opcoes).forEach((key) => {
    elemento[key] = opcoes[key];
  });
  pai.appendChild(elemento);
  return elemento;
}

function exibirDetalhesPokemon(pokemon) {
  const { name, id, types, weight, height, abilities, stats } = pokemon;
  const nomePokemonCapitalizado = capitalizarPrimeiraLetra(name);

  document.querySelector("title").textContent = nomePokemonCapitalizado;

  const elementoPrincipalDetalhe = document.querySelector(".detail-main");
  elementoPrincipalDetalhe.classList.add(name.toLowerCase());

  document.querySelector(".name-wrap .name").textContent =
    nomePokemonCapitalizado;

  document.querySelector(
    ".pokemon-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  const elementoImagem = document.querySelector(".detail-img-wrapper img");
  elementoImagem.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  elementoImagem.alt = name;

  const wrapperTipos = document.querySelector(".power-wrapper");
  wrapperTipos.innerHTML = "";
  types.forEach(({ type }) => {
    criarEAdicionarElemento(wrapperTipos, "p", {
      className: `body3-fonts type ${type.name}`,
      textContent: type.name,
    });
  });

  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
  ).textContent = `${weight / 10}kg`;
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
  ).textContent = `${height / 10}m`;

  const habilidadesWrapper = document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail.move"
  );
  abilities.forEach(({ ability }) => {
    criarEAdicionarElemento(habilidadesWrapper, "p", {
      className: "body3-fonts",
      textContent: ability.name,
    });
  });

  const wrapperStats = document.querySelector(".stats-wrapper");
  wrapperStats.innerHTML = "";

  const mapeamentoNomesStats = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    speed: "SPD",
  };

  stats.forEach(({ stat, base_stat }) => {
    const divStat = document.createElement("div");
    divStat.className = "stats-wrap";
    wrapperStats.appendChild(divStat);

    criarEAdicionarElemento(divStat, "p", {
      className: "body3-fonts stats",
      textContent: mapeamentoNomesStats[stat.name],
    });

    criarEAdicionarElemento(divStat, "p", {
      className: "body3-fonts",
      textContent: String(base_stat).padStart(3, "0"),
    });

    criarEAdicionarElemento(divStat, "progress", {
      className: "progress-bar",
      value: base_stat,
      max: 100,
    });
  });

  definirCorDeFundoTipo(pokemon);
}


//nao consegui fazer com que o texto viesse  em portugues, 
//este texto é oque vem abaixo do sobre e as estatisticas
function obterTextoFlavorEmIngles(especiePokemon) {
  for (let entrada of especiePokemon.flavor_text_entries) {
    if (entrada.language.name === "en") {
      let textoFlavor = entrada.flavor_text.replace(/\f/g, " ");
      return textoFlavor;
    }
  }
  return "";
}

//créditos Canal Manual do Dev (youtube)
// Api: Pokeapi
// Assets: Phosphor Icons