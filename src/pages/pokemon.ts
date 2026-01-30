import "../types/interfaces.ts"
import type {ResourcePokemon} from "../types/interfaces.ts";
import {fetchPokemonEvolutions, fetchPokemonInfos} from "./api.ts";

export async function maxPokemons() : Promise<number> {
    const response = await fetch (`https://pokeapi.co/api/v2/pokemon`);
    const data:ResourcePokemon = await response.json();
    return data.count;
}

export const limitMaxPokemons = await (maxPokemons());

export async function afficherInfosPokemon(name: string) : Promise<void> {

    const data  = await fetchPokemonInfos(name);

    const listPokemonsEvolutions = await fetchPokemonEvolutions(data!.id);

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
    <div></div>
    ${statsPokemon}
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