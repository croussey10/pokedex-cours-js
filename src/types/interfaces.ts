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

export interface Type {
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