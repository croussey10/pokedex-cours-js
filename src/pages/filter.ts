import {allPokemonLocal} from "./pokedex.ts";
import {fetchPokemonsAbilities, fetchPokemonsGeneration, fetchPokemonsType} from "./api.ts";

const filterNameOrIdPokemon = async (input: string, listPokemonToFilter: string[]) => {
    const convertionNumber = Number(input);
    if (Number.isNaN(convertionNumber)) {
        return listPokemonToFilter.filter((item) => item.includes(input));
    }
    const testArray = [];
    testArray.push(listPokemonToFilter[convertionNumber - 1])
    return testArray;
}

const filterTypePokemon = async (type: string, listPokemonToFilter: string[]) => {
    const listPokemon = await fetchPokemonsType(type);
    const listPokemonByType: string[] = [];
    for (const pokemon of listPokemon) {
        if (listPokemonToFilter.includes(pokemon)) {
            listPokemonByType.push(pokemon)
        }
    }
    return listPokemonByType
}

const filterGenerationPokemon = async (generations: number[], listPokemonToFilter: string[]) => {
    const listPokemon = await fetchPokemonsGeneration(generations);
    const listPokemonByGeneration: string[] = [];
    for (const pokemon of listPokemon) {
        if (listPokemonToFilter.includes(pokemon)) {
            listPokemonByGeneration.push(pokemon)
        }
    }
    return listPokemonByGeneration
}

const filterAbilityPokemon = async (ability: string, listPokemonToFilter: string[]) => {
    const listPokemon = await fetchPokemonsAbilities(ability);
    const listPokemonByAbility: string[] = [];
    for (const pokemon of listPokemon) {
        if (listPokemonToFilter.includes(pokemon)) {
            listPokemonByAbility.push(pokemon)
        }
    }
    return listPokemonByAbility;
}

export const filterAll = async (input: string, type1: string, type2: string, generations: number[], ability: string) => {
    let filter = allPokemonLocal;
    if (input) filter = await filterNameOrIdPokemon(input, allPokemonLocal);
    console.log("input", filter);
    if (type1) filter = await filterTypePokemon(type1, filter);
    console.log("type 1", filter);
    if (type2) filter = await filterTypePokemon(type2, filter);
    console.log("type 2", filter);
    if (generations.length) filter = await filterGenerationPokemon(generations, filter);
    console.log("gen", filter);
    if (ability) filter = await filterAbilityPokemon(ability, filter)
    console.log("ability", filter);
    return filter
}