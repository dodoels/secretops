import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { api, fetchReservation } from './api';
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
        mock.onGet('/api/v1/reservations').reply(200, mockResponse);
        const result = await fetchReservation();
        expect(result).toEqual(mockResponse.responseObject);
    });
});
