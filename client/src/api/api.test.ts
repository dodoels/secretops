import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { api, fetchData } from './api';
import { mockData } from './api.mock';

describe('secretops', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(api);
    });

    afterEach(() => {
        mock.restore();
    });

    it('fetches data successfully', async () => {
        const mockResponse = mockData;
        mock.onGet('/v1/something').reply(200, mockResponse);
        const result = await fetchData();
        expect(result).toEqual(mockResponse);
    });
});
