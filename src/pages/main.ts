// import './style.css'
import "../types/interfaces.ts"
import {afficherInfosPokemon, fichePokemonPage} from "./pokemon.ts";
import {pokedexPage, initPokedex} from "./pokedex.ts";

let url = new URLSearchParams(location.search);
export const pokemon_name = url.get("name");

if (url.get("name")) {
    console.log("POKEMON");
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        ${fichePokemonPage}
    `
    await afficherInfosPokemon(pokemon_name!);

} else {
    console.log("POKEDEX");

    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        ${pokedexPage}
    `
    initPokedex();
}