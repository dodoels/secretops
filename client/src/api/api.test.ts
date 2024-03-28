import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { api, fetchReservation, fetchReservationById } from './api';
import { successMock } from './api.mock';


let mock: MockAdapter;

describe('fetchReservation', () => {

    beforeEach(() => {
        mock = new MockAdapter(api);
    });

    afterEach(() => {
        mock.restore();
    });

    it('should fetch a list of reservation successfully', async () => {
        mock.onGet('/api/v1/reservations').reply(200, successMock);
        const result = await fetchReservation();
        expect(result).toEqual(successMock.responseObject);
    });

    it('handles API errors gracefully', async () => {
        mock.onGet('/api/v1/reservations').reply(500);
        await expect(fetchReservation(1, 10)).rejects.toThrow('Error fetching reservations');
    });

});

describe('fetchReservation', () => {

    beforeEach(() => {
        mock = new MockAdapter(api);
    });

    afterEach(() => {
        mock.restore();
    });

    it('should fetch a list of reservation successfully', async () => {
        mock.onGet('/api/v1/reservations/some-uuid').reply(200, successMock);
        const result = await fetchReservationById('some-uuid');
        expect(result).toEqual(successMock.responseObject);
    });

    it('handles API errors gracefully', async () => {
        mock.onGet('/api/v1/reservations/some-uuid').reply(500);
        await expect(fetchReservationById('some-uuid')).rejects.toThrow('Error fetching reservations by id');
    });

});
