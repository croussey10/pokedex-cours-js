export interface Pokemon {
    id: number;
    name: string;
    stats: {
        stat: {
            name: string;
        }
        base_stat: number;
    }[];
    sprites: {
        front_default: string;
    };
    cries: {
        latest: string;
    }
}

export interface ResourcePokemon {
    results: {
        name: string;
        url: string;
    }[];
    count: number;
}

export interface TypeInfos {
    id: number;
    name: string;
    pokemon: {
        pokemon: {
            name: string
        }
    }[]
}

export interface ResourceType {
    results: {
        name: string
    }[]
}

export interface Generations {
    name: string;
    pokemon_species : {
        name: string
    }[]
}

export interface Abilities {
    name: string;
    pokemon: {
        pokemon: {
            name: string
        }
    }[]
}

export interface ResourceAbility {
    results: {
        name: string
    }[]
}

export interface Evolution {
    chain: {
        species: {
            name: string
        }
        evolves_to: {
            species: {
                name: string;
                url: string
            }
            evolves_to: {
                species: {
                    name: string;
                    url: string
                }
            }[]
        }[]
    }
}

export interface Spicy {
    evolution_chain: {
        url: string
    }
}