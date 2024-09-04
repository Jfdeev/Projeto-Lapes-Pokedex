const elementoInput = document.querySelector("#search-input");
const iconePesquisa = document.querySelector("#search-close-icon");
const wrapperOrdenar = document.querySelector(".sort-wrapper");

elementoInput.addEventListener("input", () => {
  lidarComMudancaDeInput(elementoInput);
});
iconePesquisa.addEventListener("click", lidarComCliqueNoIconeDePesquisa);
wrapperOrdenar.addEventListener("click", lidarComCliqueNoIconeDeOrdenacao);

function lidarComMudancaDeInput(elementoInput) {
  const valorInput = elementoInput.value;

  if (valorInput !== "") {
    document
      .querySelector("#search-close-icon")
      .classList.add("search-close-icon-visible");
  } else {
    document
      .querySelector("#search-close-icon")
      .classList.remove("search-close-icon-visible");
  }
}

function lidarComCliqueNoIconeDePesquisa() {
  document.querySelector("#search-input").value = "";
  document
    .querySelector("#search-close-icon")
    .classList.remove("search-close-icon-visible");
}

function lidarComCliqueNoIconeDeOrdenacao() {
  document
    .querySelector(".filter-wrapper")
    .classList.toggle("filter-wrapper-open");
  document.querySelector("body").classList.toggle("filter-wrapper-overlay");
}

//créditos Canal Manual do Dev (youtube)
// Api: Pokeapi
// Assets: Phosphor Icons