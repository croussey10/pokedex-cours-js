import { fetchPokemonEvolutions, fetchPokemonInfos } from "./api.ts";
import { allPokemonLocal } from "./pokedex.ts";
import "../assets/style.css";

const limitMaxPokemons = 1025;

export async function getPreviousPokemon(name: string): Promise<string | void> {
    const data = await fetchPokemonInfos(name);
    if (!data) return;
    let idPreviousPokemon = data.id - 1;
    if (idPreviousPokemon > 0) {
        const prev = await fetchPokemonInfos(`${idPreviousPokemon}`);
        if (prev) return prev.name;
    }
}

export async function getNextPokemon(name: string, limitMaxPokemons: number): Promise<string | void> {
    const data = await fetchPokemonInfos(name);
    if (!data) return;
    let idNextPokemon = data.id + 1;
    if (idNextPokemon < limitMaxPokemons) {
        const next = await fetchPokemonInfos(`${idNextPokemon}`);
        if (next) return next.name;
    }
}

export const afficherInfosPokemon = async (name: string) => {
    const divInfos = document.getElementById("infos-pokemon");
    if (!divInfos) return;

    const data = await fetchPokemonInfos(name);
    if (!data) return;

    // 1. Logique des Évolutions (On récupère les IDs pour les images)
    const listEvo = await fetchPokemonEvolutions(data.id);
    const getEvoHTML = (list: string[], label: string) => {
        if (list.length === 0) return "";
        let html = `<div class="evo-label">${label}</div><div class="evo-group">`;
        list.forEach(pokeName => {
            // Recherche de l'ID via ta liste locale pour l'artwork
            const id = allPokemonLocal.indexOf(pokeName) + 1;
            html += `
                <a class="evo-card" href="?name=${pokeName}">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="${pokeName}">
                    <span>${pokeName}</span>
                </a>`;
        });
        return html + `</div>`;
    };

    const typesHTML = data.types.map(item => {
        const typeId = item.type.url.split("/").at(-2);
        return `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/${typeId}.png" class="type-img">`;
    }).join('');

    divInfos.innerHTML = `
        <h1 class="pkm-title">#${data.id} ${data.name.toUpperCase()}</h1>
        
        <img id="img-pokemon" src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
        
        <audio controls src="${data.cries.latest}"></audio>
        
        <div class="stats-container">
            ${data.stats.map(s => `
                <div class="stat-row">
                    <span>${s.stat.name}</span>
                    <span>${s.base_stat}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="types-container">
            ${typesHTML}
        </div>
        
        <div class="evolution-section">
            ${getEvoHTML(listEvo[0], "Forme de Base")}
            ${getEvoHTML(listEvo[1], "Évolution 1")}
            ${getEvoHTML(listEvo[2], "Évolution 2")}
        </div>
    `;
};

let url = new URLSearchParams(location.search);
const namePokemon = url.get("name");

const prev = namePokemon ? await getPreviousPokemon(namePokemon) : null;
const next = namePokemon ? await getNextPokemon(namePokemon, limitMaxPokemons) : null;

export const fichePokemonPage = `
    <div class="pokemon-container">
        <div class="nav-header">
            <a href="/public" class="btn-home">Home</a>
            <div class="nav-arrows">
                ${prev ? `<a href="?name=${prev}" class="btn-nav">Précédent</a>` : ""}
                ${next ? `<a href="?name=${next}" class="btn-nav">Suivant</a>` : ""}
            </div>
        </div>
        <div id="infos-pokemon">
            <p>Chargement...</p>
        </div>
    </div>
`;

if (namePokemon) {
    afficherInfosPokemon(namePokemon);
}