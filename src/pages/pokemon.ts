import "../types/interfaces.ts"
import type {ResourcePokemon} from "../types/interfaces.ts";
import {fetchPokemonEvolutions, fetchPokemonInfos} from "./api.ts";
import {allPokemonLocal} from "./pokedex.ts";

export async function maxPokemons() : Promise<number> {
    const response = await fetch (`https://pokeapi.co/api/v2/pokemon`);
    const data:ResourcePokemon = await response.json();
    return data.count;
}

export const limitMaxPokemons = await (maxPokemons());

export async function afficherInfosPokemon(name: string) : Promise<void> {

    const data  = await fetchPokemonInfos(name);

    const pokemonEvo0Sprites = [];
    const pokemonEvo1Sprites = [];
    const pokemonEvo2Sprites = [];

    const listPokemonsEvolutions = await fetchPokemonEvolutions(data!.id);

    const listEvo0 = listPokemonsEvolutions[0].map((pokemon) => pokemon)
    console.log(listEvo0);
    for (const pokemonOfAllPokemon of allPokemonLocal) {
        for (const pokemonOfEvo0 of listEvo0) {
            if (pokemonOfAllPokemon === pokemonOfEvo0) {
                const id = allPokemonLocal.indexOf(pokemonOfAllPokemon) + 1;
                console.log(id)
                pokemonEvo0Sprites.push(id);
            }
        }
    }

    const listEvo1 = listPokemonsEvolutions[1].map((pokemon) => pokemon)
    console.log(listEvo1);
    for (const pokemonOfAllPokemon of allPokemonLocal) {
        for (const pokemonOfEvo1 of listEvo1) {
            if (pokemonOfAllPokemon === pokemonOfEvo1) {
                const id = allPokemonLocal.indexOf(pokemonOfAllPokemon) + 1;
                console.log(id)
                pokemonEvo1Sprites.push(id);
            }
        }
    }

    const listEvo2 = listPokemonsEvolutions[2].map((pokemon) => pokemon)
    console.log(listEvo2);
    for (const pokemonOfAllPokemon of allPokemonLocal) {
        for (const pokemonOfEvo2 of listEvo2) {
            if (pokemonOfAllPokemon === pokemonOfEvo2) {
                const id = allPokemonLocal.indexOf(pokemonOfAllPokemon) + 1;
                console.log(id)
                pokemonEvo2Sprites.push(id);
            }
        }
    }

    let evo0HTML = "";
    let evo1HTML = "";
    let evo2HTML = "";

    let i = 0;
    let j = 0
    let k = 0

    for (const pokemon of listPokemonsEvolutions[0]) {
        let id = pokemonEvo0Sprites[i]
        i++
        evo1HTML += `
            <a id="${pokemon}" href="?name=${pokemon}">
                ${pokemon}
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png">
            </a>
        `
    }

    for (const pokemon of listPokemonsEvolutions[1]) {
        let id = pokemonEvo1Sprites[j]
        j++
        evo1HTML += `
            <a id="${pokemon}" href="?name=${pokemon}">
                ${pokemon}
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png">
            </a>
        `
    }

    for (const pokemon of listPokemonsEvolutions[2]) {
        console.log(pokemon)
        let id = pokemonEvo2Sprites[k]
        k++
        evo2HTML += `
            <a id="${pokemon}" href="?name=${pokemon}">
                ${pokemon}
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png"> 
            </a>
        `
    }

    let pokemonInfos = "";

    if (!data) {
        return;
    }

    let statsPokemon = "";

    for (let i = 0; i < 6; i++) {
        statsPokemon += `
            <div>\n${data.stats[i].stat.name} : ${data.stats[i].base_stat}</div>
        `;
    }

    let pokemonPage = document.getElementById("infos-pokemon");

    pokemonInfos += `
    <div>ID : ${data.id} Name : ${data.name}</div>
    <img id="img-pokemon" src="${data.sprites.front_default}" alt="${data.name}">
    <audio controls src="${data.cries.latest}"></audio>
    <div>
        ${statsPokemon}
    </div>
    <div id="evo-0">
        ${evo0HTML}
    </div>
    <div id="evo-1">
        ${evo1HTML}
    </div>
    <div id="evo-2">
        ${evo2HTML}
    </div>
    
    `

    if (pokemonPage) {
        pokemonPage.innerHTML += pokemonInfos;
    }
}

export async function getPreviousPokemon (name: string) : Promise<string | void> {
    const data = await fetchPokemonInfos(name);
    if (!data) {
        return;
    }
    let idPreviousPokemon = data.id - 1;
    let namePreviousPokemon = null;
    if (idPreviousPokemon > 0) {
        namePreviousPokemon = await fetchPokemonInfos(`${idPreviousPokemon}`);
    }
    if (namePreviousPokemon) {
        console.log(`pkm precedent : ${namePreviousPokemon?.name}`);
        return `${namePreviousPokemon.name}`;
    }
}

export async function getNextPokemon (name: string, limitMaxPokemons: number) : Promise<string | void> {
    const data = await fetchPokemonInfos(name);
    if (!data) {
        return;
    }
    let idNextPokemon = data.id + 1;
    let nameNextPokemon = null;
    if (idNextPokemon < limitMaxPokemons) {
        nameNextPokemon = await fetchPokemonInfos(`${idNextPokemon}`);
    }
    if (nameNextPokemon) {
        console.log(`pkm suivant : ${nameNextPokemon?.name}`);
        return `${nameNextPokemon.name}`;
    }
}

let url = new URLSearchParams(location.search);
const namePokemon = (url.get("name"));
const previousPokemon = await getPreviousPokemon(namePokemon!);
const nextPokemon = await getNextPokemon(namePokemon!, limitMaxPokemons);

export const fichePokemonPage = `
    <div>
        <a href="/public">home</a>
    </div>
    <a href="?name=${previousPokemon}" id="btn-previous">PreviousPage</a>
    <a href="?name=${nextPokemon}" id="btn-next">NextPage</a>
    <div id="infos-pokemon"></div>
`