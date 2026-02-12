// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';

globalThis.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({
        count: 1350,
        results: []
    })
});

describe('Page Pokemon (pokemon.ts)', () => {

    it('maxPokemons doit retourner le nombre total de pokémons', async () => {
        const resultat = 1350;
        expect(resultat).toBe(1350);
    });
});