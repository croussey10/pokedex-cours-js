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
        other: {
            "official-artwork": {
                front_default: string
            }
        }
    };
    cries: {
        latest: string;
    }
    types: {
        type: {
            name: string;
            url: string
        }
    }[]
}

export interface ResourcePokemon {
    results: {
        name: string;
        url: string;
    }[];
    count: number;
}

// --- MODIFICATION ICI POUR LES FAIBLESSES ---
export interface TypeRelations {
    double_damage_from: {
        name: string;
        url: string;
    }[];
}

export interface TypeInfos {
    id: number;
    name: string;
    damage_relations: TypeRelations; // Ajout des relations de dégâts
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

export interface Specy {
    evolution_chain: {
        url: string
    }
}

// --- NOUVELLES INTERFACES POUR LA TEAM ---

export interface TeamPokemon {
    id: number;
    name: string;
    sprite: string;
    types: string[];
    weaknesses: string[];
}

export interface Team {
    id: string;
    name: string;
    pokemons: TeamPokemon[];
}