import type {Team, TeamPokemon, TypeInfos} from "../types/interfaces.ts";
import { fetchPokemonInfos } from "./api.ts";

// NOUS PRECISONS QUE NOUS AVONS BEAUCOUP UTILISER L'IA CONCERANT LA FONCTIONNALITE DU CREATEUR D'EQUIPE.


const TEAM_STORAGE_KEY = "pokemon_teams";

export const getTeams = (): Team[] => {
    const stored = localStorage.getItem(TEAM_STORAGE_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored) as Team[];
    } catch (e) {
        console.error("Erreur lecture teams", e);
        return [];
    }
}

const saveTeams = (teams: Team[]) => {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teams));
}

export const createTeam = (name: string): string | null => {
    const teams = getTeams();
    if (teams.length >= 10) return "Limite de 10 équipes atteinte !";
    if (!name.trim()) return "Le nom est vide !";

    const newTeam: Team = {
        id: Date.now().toString(),
        name: name,
        pokemons: []
    };
    teams.push(newTeam);
    saveTeams(teams);
    return null;
}

export const deleteTeam = (teamId: string) => {
    const teams = getTeams().filter(t => t.id !== teamId);
    saveTeams(teams);
}

const getWeaknessesFromTypes = async (types: string[]): Promise<string[]> => {
    const weaknessesSet = new Set<string>();

    const promises = types.map(type =>
        fetch(`https://pokeapi.co/api/v2/type/${type}`)
            .then(res => res.json() as Promise<TypeInfos>)
            .catch(() => null)
    );

    const results = await Promise.all(promises);

    results.forEach(info => {
        if (info?.damage_relations) {
            info.damage_relations.double_damage_from.forEach(w => weaknessesSet.add(w.name));
        }
    });

    return Array.from(weaknessesSet);
}

export const addPokemonToTeam = async (teamId: string, pokemonName: string): Promise<string | null> => {
    const teams = getTeams();
    const index = teams.findIndex(t => t.id === teamId);
    if (index === -1) return "Équipe introuvable";

    const team = teams[index];
    if (team.pokemons.length >= 6) return "Équipe complète (6 max) !";
    if (team.pokemons.some(p => p.name.toLowerCase() === pokemonName.toLowerCase())) {
        return "Ce Pokémon est déjà dans l'équipe !";
    }

    const data = await fetchPokemonInfos(pokemonName.toLowerCase());
    if (!data) return "Pokémon introuvable !";

    const types = data.types.map(t => t.type.name);
    const weaknesses = await getWeaknessesFromTypes(types);

    const newPokemon: TeamPokemon = {
        id: data.id,
        name: data.name,
        sprite: data.sprites.front_default,
        types: types,
        weaknesses: weaknesses
    };

    team.pokemons.push(newPokemon);
    teams[index] = team;
    saveTeams(teams);
    return null;
}

export const removePokemonFromTeam = (teamId: string, pokemonId: number) => {
    const teams = getTeams();
    const team = teams.find(t => t.id === teamId);
    if (team) {
        team.pokemons = team.pokemons.filter(p => p.id !== pokemonId);
        saveTeams(teams);
    }
}