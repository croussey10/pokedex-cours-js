// import './style.css'
import "../types/interfaces.ts"
import type {ResourcePokemon} from "../types/interfaces.ts";
import {limitMaxPokemons} from "./pokemon.ts";
import {
    fetchAllAbilities,
    fetchAllTypes,
    fetchPokemonEvolutions,
    fetchPokemonsPagination,
    fetchPokemonSpecies
} from "./api.ts";
import {filterAll} from "./filter.ts";

let offset = 0;

const getAllTypes = async () => {
    const data = await fetchAllTypes();
    return data?.results.map((type) => type.name);
}

const getAllAbilities = async () => {
    const data = await fetchAllAbilities();
    return data?.results.map((ability) => ability.name);
}

const displayOptionsTypes = async () => {
    const allTypes = await getAllTypes();
    let optionTypes = "";
    for (let type of allTypes!) {
        optionTypes += `
            <option value="${type}">${type}</option>
        `
    }
    return optionTypes;
}

const displayOptionsAbilities = async () => {
    const allAbilities = await getAllAbilities();
    let optionAbilities = "";
    for (let ability of allAbilities!) {
        optionAbilities += `
            <option value="${ability}">${ability}</option>
        `
    }
    return optionAbilities;
}

const displayCheckboxGenerations = async () => {
    const allGeneration = [1,2,3,4,5,6,7,8,9]
    let checkboxGenerations = "";
    for (let generation of allGeneration) {
        checkboxGenerations += `
            <input type="checkbox" id="gen-${generation}">Gen-${generation}</input>
        `
    }
    return checkboxGenerations;
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

export const allPokemonLocal: string[] = JSON.parse(localStorage.getItem("allPokemons")!);

const optionsTypes = await displayOptionsTypes();
const optionsAbilities = await displayOptionsAbilities();
const checkboxGenerations = await displayCheckboxGenerations();

export const pokedexPage = `
    <input id="pokemon-search" placeholder="nom d'un pokemon...">
    <button id="btn-previous">PreviousPage</button>
    <button id="btn-next">NextPage</button>
    <select id="select-type1">
        <option value=""></option>
        ${optionsTypes}
    </select>
    <select id="select-type2">
        <option value=""></option>
        ${optionsTypes}
    </select>
    <select id="select-ability">
        <option value=""></option>
        ${optionsAbilities}
    </select>
    <div id="div-checkbox">
        ${checkboxGenerations}
    </div>
    <div id="div-infos-pokemon" />
`

export function initPokedex () {

    const btnPrevious = document.getElementById("btn-previous");
    btnPrevious?.addEventListener("click", () => {
        void changePage(-1);
    });

    const btnNext = document.getElementById("btn-next");
    btnNext?.addEventListener("click", () => {
        void changePage(1);
    });

    const pokemonInput = document.getElementById("pokemon-search") as HTMLInputElement;

    let selectType1 = "";
    let selectType2 = "";
    let selectAbility = "";
    let genChecked: number[] = [];

    console.log(selectAbility);

    const selectType1HTML = document.getElementById("select-type1") as HTMLSelectElement;
    selectType1HTML?.addEventListener("change", async () => {
        offset = 0;
        selectType1 = selectType1HTML.value;
        await display();
        console.log(selectType1)
    });

    const selectType2HTML = document.getElementById("select-type2") as HTMLSelectElement;
    selectType2HTML?.addEventListener("change", async () => {
        offset = 0;
        selectType2 = selectType2HTML.value;
        await display();
        console.log(selectType2)
    });

    const selectAbilityHTML = document.getElementById("select-ability") as HTMLSelectElement;
    selectAbilityHTML.addEventListener("change", async () => {
        offset = 0;
        selectAbility = selectAbilityHTML.value;
        await display();
        console.log(selectAbility)
    })

    const divCheckboxGenerationHTML = document.getElementById("div-checkbox") as HTMLDivElement;
    divCheckboxGenerationHTML?.addEventListener("change", async () => {
        offset = 0;
        genChecked = [];
        console.log(divCheckboxGenerationHTML.children);
        for (let generation of divCheckboxGenerationHTML.children) {
            let genId = document.getElementById(`${generation.id}`) as HTMLInputElement;
            if (genId.checked) {
                genChecked.push(Number(generation.id.split("-").pop()))
            }
        }
        await display();
        console.log(genChecked)
    });

    pokemonInput?.addEventListener("input", getInput);

    async function getInput () {
        offset = 0;
        await display();
    }
    // void getInput();

    const changePage = async (sign: number) => {
        if (sign > 0 && offset < limitMaxPokemons) {
            offset += 20;
        } else if (offset > 0) {
            offset -= 20;
        }
        await display()
    }

    let infosPokemonHTML = "";

    const display = async () => {
        const listPokemonsFiltered = await filterAll(pokemonInput.value, selectType1, selectType2, genChecked, selectAbility);
        const test = await fetchPokemonsPagination(listPokemonsFiltered, offset)
        console.log(test);
        infosPokemonHTML = "";
        for (let pokemon of test) {
            infosPokemonHTML += `
                <div>
                    <a href="?name=${pokemon?.name}">
                        <div>${pokemon?.name}</div>
                        <div>${pokemon?.id}</div>
                        <img src="${pokemon?.sprites.front_default}" alt="sprite-${pokemon?.name}">
                    </a>
                </div>
            `
        }
        document.getElementById("div-infos-pokemon")!.innerHTML = infosPokemonHTML
    }
    display()
}
