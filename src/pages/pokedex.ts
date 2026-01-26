// import './style.css'
import "../types/interfaces.ts"
import type {Pokemon, ResourcePokemon} from "../types/interfaces.ts";
import {limitMaxPokemons} from "./pokemon.ts";
import {fetchAllTypes, fetchPokemonsPagination} from "./api.ts";

let offset = 0;

const allTypes = await fetchAllTypes();

let htmlTypes = "";

for (let type of allTypes!.results) {
    htmlTypes += `
        <div>
            <input type="checkbox" id="${type.name}" name="${type.name}" />
            <label for="${type.name}">${type.name}</label>
        </div>
    `
}

async function allPokemonsName() {
    const allPokemons = localStorage.getItem("allPokemons");

    if (allPokemons) {
        return;
    }

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limitMaxPokemons}`);
    const data = await response.json() as ResourcePokemon;
    const arrayPokemons: string[] = data.results.map((pokemon) => pokemon.name);
    localStorage.setItem("allPokemons", JSON.stringify(arrayPokemons));
}
await allPokemonsName();

const allPokemonLocal = JSON.parse(localStorage.getItem("allPokemons")!);

export const pokedexPage = `
    <input id="pokemon-search" placeholder="nom d'un pokemon...">
    <button id="btn-previous">PreviousPage</button>
    <button id="btn-next">NextPage</button>
    <div id="div-infos-pokemon"></div>
    <div id="div-types">
        ${htmlTypes}
    </div>
    <div id="list-pokemons"></div>
`

export function initPokedex () {

    const btnPrevious = document.getElementById("btn-previous");
    btnPrevious?.addEventListener("click", () => {
        void previousPage();
    });

    const btnNext = document.getElementById("btn-next");
    btnNext?.addEventListener("click", () => {
        void nextPage()
    });

    const divTypes = document.getElementById("div-types");
    divTypes?.addEventListener("change", () => {
        const listTypesChecked = [];
        for (let type of allTypes!.results) {
            const checkboxType = document.getElementById(`${type.name}`) as HTMLInputElement;
            listTypesChecked.push(checkboxType.checked);
        }
        console.log(listTypesChecked);
    })

    const pokemonInput = document.getElementById("pokemon-search") as HTMLInputElement;

    pokemonInput?.addEventListener("input", getInput);

    let listPokemons: (Pokemon | null)[] = [];

    async function getInput () {
        offset = 0;
        listPokemons = await fetchPokemonsPagination(allPokemonLocal, offset, pokemonInput.value);
        displayListPokemons(listPokemons);
    }
    void getInput();

    async function nextPage () {
        if (offset < limitMaxPokemons) {
            offset += 20;
            listPokemons = await fetchPokemonsPagination(allPokemonLocal, offset, pokemonInput.value);
            displayListPokemons(listPokemons);
        } else {
            console.error("Vous ne pouvez pas!");
        }
    }

    async function previousPage () {
        if (offset > 0) {
            offset -= 20;
            listPokemons = await fetchPokemonsPagination(allPokemonLocal, offset, pokemonInput.value);
            displayListPokemons(listPokemons);
        } else {
            console.error("Vous ne pouvez pas!");
        }
    }

    let infosPokemonHTML = "";

    const displayListPokemons = (listPokemons: (Pokemon | null)[]) => {
        infosPokemonHTML = "";
        for (let pokemon of listPokemons) {
            infosPokemonHTML += `
                <div>
                    <a href="?name=${pokemon?.name}">
                        <div>${pokemon?.name}</div>
                        <div>${pokemon?.id}</div>
                        <img src="${pokemon?.sprites.front_default}" alt="sprite-${pokemon?.name}">
                    </a>
                    <audio controls src="${pokemon?.cries.latest}"></audio>
                </div>
            `
        }
        document.getElementById("div-infos-pokemon")!.innerHTML = infosPokemonHTML
    }
    displayListPokemons(listPokemons);
}

