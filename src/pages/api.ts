import type {
    Abilities,
    Evolution,
    Generations,
    Pokemon,
    ResourceAbility,
    ResourceType, Spicy,
    TypeInfos
} from "../types/interfaces.ts";

export const fetchPokemonInfos = async (name: string) : Promise<Pokemon | null> => {
    try {
        const data = await fetch (`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (data.ok) {
            return await data.json();
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const fetchPokemonsType = async (type: string) => {
    const data = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!type) {
        return []
    }
    const result: TypeInfos = await data.json();
    return result.pokemon.map((pokemon) => pokemon.pokemon.name)
}

export const fetchAllTypes = async () : Promise<ResourceType | null> => {
    try {
        const data = await fetch(`https://pokeapi.co/api/v2/type`);
        return await data.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const fetchPokemonsGeneration = async (generations: number[]) => {
    const allPokemonsGens = [];
    for (let generation of generations) {
        const data = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`);
        const result: Generations = await data.json();
        allPokemonsGens.push(result.pokemon_species.map((pokemon) => pokemon.name));
    }
    return allPokemonsGens.flat();
}

export const fetchPokemonsAbilities = async (ability: string) => {
    const data = await fetch (`https://pokeapi.co/api/v2/ability/${ability}`);
    const result: Abilities = await data.json();
    return result.pokemon.map((pokemon) => pokemon.pokemon.name)
}

export const fetchAllAbilities = async () : Promise<ResourceAbility | null> => {
    try {
        const data = await fetch(`https://pokeapi.co/api/v2/ability?limit=367`);
        return await data.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const fetchPokemonsPagination = async (listPokemons: string[], offset: number) => {
    const paginatePokemons = listPokemons.slice(offset, offset + 20);
    const promises = paginatePokemons.map(async (pokemon) => await fetchPokemonInfos(pokemon));
    return await Promise.all(promises);
}

export const fetchPokemonSpecies = async (id: number) => {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const result: Spicy = await data.json();
    return result.evolution_chain.url.split("/").at(6)
}

export const fetchPokemonEvolutions = async (id: number) => {
    const evolutionChainId = await fetchPokemonSpecies(id);
    const data = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${evolutionChainId}`);
    const result: Evolution = await data.json();
    const listPokemonsEvolutions: string[][] = [
        [],
        [],
        []
    ];
    listPokemonsEvolutions[0].push(result.chain.species.name);
    const listEvo1 = result.chain.evolves_to.map((evo1) => evo1.species.name)
    for (const pokemon of listEvo1) {
        listPokemonsEvolutions[1].push(pokemon)
    }
    const listEvo2 = result.chain.evolves_to.flatMap((evo1) => evo1.evolves_to.map((evo2) => evo2.species.name))
    for (const pokemon of listEvo2) {
        listPokemonsEvolutions[2].push(pokemon)
    }
    console.log(listPokemonsEvolutions)
    return listPokemonsEvolutions;
}