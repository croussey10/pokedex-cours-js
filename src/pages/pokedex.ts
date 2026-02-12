import "../types/interfaces.ts"
import { fetchAllAbilities, fetchAllTypes, fetchPokemonsPagination } from "./api.ts";
import { filterAll } from "./filter.ts";
import { createTeam, deleteTeam, getTeams, addPokemonToTeam, removePokemonFromTeam } from "./team.ts";
import type {Team, ResourcePokemon} from "../types/interfaces.ts";
import "../assets/style.css";

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
        optionTypes += `<option value="${type}">${type}</option>`
    }
    return optionTypes;
}

const displayOptionsAbilities = async () => {
    const allAbilities = await getAllAbilities();
    let optionAbilities = "";
    for (let ability of allAbilities!) {
        optionAbilities += `<option value="${ability}">${ability}</option>`
    }
    return optionAbilities;
}

const displayCheckboxGenerations = async () => {
    const allGeneration = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let checkboxGenerations = "";
    for (let generation of allGeneration) {
        checkboxGenerations += `<input type="checkbox" id="gen-${generation}">Gen-${generation}</input>`
    }
    return checkboxGenerations;
}

async function allPokemonsName() {
    const allPokemons = localStorage.getItem("allPokemons");
    if (allPokemons) return;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1350`);
    const data = await response.json() as ResourcePokemon;
    const arrayPokemons: string[] = data.results.map((pokemon) => pokemon.name);
    localStorage.setItem("allPokemons", JSON.stringify(arrayPokemons));
}
await allPokemonsName();

export const allPokemonLocal: string[] = JSON.parse(localStorage.getItem("allPokemons")!);

const optionsTypes = await displayOptionsTypes();
const optionsAbilities = await displayOptionsAbilities();
const checkboxGenerations = await displayCheckboxGenerations();


const generateTeamHTML = (team: Team) => {
    let slotsHTML = '<div class="pokemon-slots">'; // Utilise la classe CSS

    for (let i = 0; i < 6; i++) {
        const pokemon = team.pokemons[i];
        if (pokemon) {
            slotsHTML += `
                <div class="pokemon-card-filled">
                    <button class="btn-remove-poke" data-team="${team.id}" data-poke="${pokemon.id}">X</button>
                    <img src="${pokemon.sprite}" width="80">
                    <div class="pokemon-name">${pokemon.name}</div>
                    <div class="pokemon-stats-mini">
                        <div>Types: ${pokemon.types.join(", ")}</div>
                        <div class="weakness-text">Weak: ${pokemon.weaknesses.slice(0, 2).join(", ")}</div>
                    </div>
                </div>
            `;
        } else {
            slotsHTML += `<div class="pokemon-slot-empty"><span>Vide</span></div>`;
        }
    }
    slotsHTML += '</div>';

    return `
        <div class="team-card">
            <div class="team-header">
                <h3>${team.name} <span>(${team.pokemons.length}/6)</span></h3>
                <button class="btn-delete-team" data-id="${team.id}">Supprimer l'équipe</button>
            </div>
            ${slotsHTML}
        </div>
    `;
};

const updateActiveTeamSelector = () => {
    const selector = document.getElementById("active-team-select") as HTMLSelectElement;
    if (!selector) return;

    const teams = getTeams();
    const currentVal = selector.value;

    if (teams.length === 0) {
        selector.innerHTML = '<option value="">Aucune équipe créée</option>';
        selector.disabled = true;
    } else {
        selector.disabled = false;
        selector.innerHTML = '<option value="">-- Choisir une équipe cible --</option>' +
            teams.map(t => `<option value="${t.id}">${t.name} (${t.pokemons.length}/6)</option>`).join("");

        if (currentVal && teams.some(t => t.id === currentVal)) {
            selector.value = currentVal;
        }
    }
}

const refreshTeamsDisplay = () => {
    const container = document.getElementById("teams-container");
    if (!container) return;

    const teams = getTeams();
    updateActiveTeamSelector();

    if (teams.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#666;'>Aucune équipe. Créez-en une ci-dessus !</p>";
    } else {
        container.innerHTML = teams.map(generateTeamHTML).join("");
    }

    container.querySelectorAll(".btn-delete-team").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = (e.target as HTMLElement).getAttribute("data-id");
            if (id && confirm("Supprimer cette équipe ?")) {
                deleteTeam(id);
                refreshTeamsDisplay();
            }
        });
    });

    container.querySelectorAll(".btn-remove-poke").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const teamId = (e.target as HTMLElement).getAttribute("data-team");
            const pokeId = (e.target as HTMLElement).getAttribute("data-poke");
            if (teamId && pokeId) {
                removePokemonFromTeam(teamId, parseInt(pokeId));
                refreshTeamsDisplay();
            }
        });
    });
};

export const pokedexPage = `
    <div class="pokedex-container">
        <h1 class="pokedex-title">GrrPah Pokedex</h1>
        
        <div class="team-manager">
            <div class="team-header-actions">
                <button id="btn-create-team" class="btn-primary">+ Créer une équipe</button>
                <div class="separator"></div>
                <label>Ajouter dans :</label>
                <select id="active-team-select" class="select-team">
                    <option>Chargement...</option>
                </select>
            </div>
            <div id="teams-container"></div>
        </div>

        <div class="filters-bar">
            <input type="text" id="pokemon-search" placeholder="Rechercher un Pokémon...">
            <select id="select-type1"><option value="">Type 1</option>${optionsTypes}</select>
            <select id="select-type2"><option value="">Type 2</option>${optionsTypes}</select>
            <select id="select-ability"><option value="">Talent</option>${optionsAbilities}</select>
            <div id="div-checkbox" class="gen-filters">${checkboxGenerations}</div>
        </div>

        <div class="pagination-top">
            <button id="btn-previous" class="btn-nav">Précédent</button>
            <button id="btn-next" class="btn-nav">Suivant</button>
        </div>

        <div id="div-infos-pokemon" class="pokedex-grid"></div>
    </div>
`;

export function initPokedex() {

    const btnCreateTeam = document.getElementById("btn-create-team");
    btnCreateTeam?.addEventListener("click", () => {
        const name = prompt("Nom de l'équipe ?");
        if (name) {
            const err = createTeam(name);
            if (err) alert(err);
            else refreshTeamsDisplay();
        }
    });

    refreshTeamsDisplay();

    const btnPrevious = document.getElementById("btn-previous");
    btnPrevious?.addEventListener("click", () => { void changePage(-1); });

    const btnNext = document.getElementById("btn-next");
    btnNext?.addEventListener("click", () => { void changePage(1); });

    const pokemonInput = document.getElementById("pokemon-search") as HTMLInputElement;
    let selectType1 = "";
    let selectType2 = "";
    let selectAbility = "";
    let genChecked: number[] = [];

    const selectType1HTML = document.getElementById("select-type1") as HTMLSelectElement;
    selectType1HTML?.addEventListener("change", async () => {
        offset = 0; selectType1 = selectType1HTML.value; await display();
    });

    const selectType2HTML = document.getElementById("select-type2") as HTMLSelectElement;
    selectType2HTML?.addEventListener("change", async () => {
        offset = 0; selectType2 = selectType2HTML.value; await display();
    });

    const selectAbilityHTML = document.getElementById("select-ability") as HTMLSelectElement;
    selectAbilityHTML?.addEventListener("change", async () => {
        offset = 0; selectAbility = selectAbilityHTML.value; await display();
    })

    const divCheckboxGenerationHTML = document.getElementById("div-checkbox") as HTMLDivElement;
    divCheckboxGenerationHTML?.addEventListener("change", async () => {
        offset = 0;
        genChecked = [];
        for (let generation of Array.from(divCheckboxGenerationHTML.children)) {
            let genInput = generation as HTMLInputElement;
            if (genInput.tagName === "INPUT" && genInput.checked) {
                genChecked.push(Number(genInput.id.split("-").pop()));
            }
        }
        await display();
    });

    pokemonInput?.addEventListener("input", async () => {
        offset = 0; await display();
    });

    const changePage = async (sign: number) => {
        if (sign > 0 && offset < 1350) offset += 20;
        else if (offset > 0) offset -= 20;
        await display()
    }

    const display = async () => {
        const listPokemonsFiltered = await filterAll(pokemonInput.value, selectType1, selectType2, genChecked, selectAbility);
        const pokemonsToDisplay = await fetchPokemonsPagination(listPokemonsFiltered, offset)

        let infosPokemonHTML = "";
        for (let pokemon of pokemonsToDisplay) {
            if (!pokemon) continue;

            infosPokemonHTML += `
    <div class="pokedex-card"> 
        <a href="?name=${pokemon.name}" class="pokedex-link">
            <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" width="150px">
            <div class="pokemon-name">${pokemon.name}</div>
            <div class="pokemon-id">#${pokemon.id}</div>
        </a>
        <button class="btn-add-to-team" data-name="${pokemon.name}">
            + Ajouter à l'équipe
        </button>
    </div>
`;
        }

        const container = document.getElementById("div-infos-pokemon");
        if (container) {
            container.innerHTML = infosPokemonHTML;

            container.querySelectorAll(".btn-add-to-team").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const pokemonName = (e.target as HTMLElement).getAttribute("data-name");
                    const teamSelect = document.getElementById("active-team-select") as HTMLSelectElement;
                    const teamId = teamSelect.value;

                    if (!teamId) {
                        alert("Veuillez d'abord créer et sélectionner une équipe dans la liste déroulante en haut !");
                        return;
                    }

                    if (pokemonName) {
                        const originalText = (e.target as HTMLElement).innerText;
                        (e.target as HTMLElement).innerText = "...";

                        const error = await addPokemonToTeam(teamId, pokemonName);

                        (e.target as HTMLElement).innerText = originalText;

                        if (error) {
                            alert(error);
                        } else {
                            refreshTeamsDisplay();
                        }
                    }
                });
            });
        }
    }

    display();
}