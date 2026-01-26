import type {Pokemon, ResourceType} from "../types/interfaces.ts";

export const fetchPokemonInfos = async (name: string) : Promise<Pokemon | null> => {
    try {
        const response = await fetch (`https://pokeapi.co/api/v2/pokemon/${name}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const fetchPokemonsPagination = async (allPokemons: string[], offset: number, input: string) => {
    const filterPokemons = allPokemons.filter((allPokemons) => allPokemons.includes(input));
    const paginatePokemons = filterPokemons.slice(offset, offset + 20);
    const promises = paginatePokemons.map(async (name) => await fetchPokemonInfos(name));
    return await Promise.all(promises);
}

export const fetchAllTypes = async () : Promise<ResourceType | null> => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

