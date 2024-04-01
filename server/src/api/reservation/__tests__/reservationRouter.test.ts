import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { ProductDetail, Reservation } from '@/api/reservation/reservationModel';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { reservations } from '@/api/reservation/reservationRepository';
import { app } from '@/server';

describe('Reservation API Endpoints', () => {

    describe('GET /reservations', () => {

        it('should return a list of reservations', async () => {
            const limit = 10, offset = 0;
            const response = await request(app).get('/api/v1/reservations').query({ limit, offset });
            const responseBody: ServiceResponse<Reservation[]> = response.body;
            expect(response.statusCode).toEqual(StatusCodes.OK);
            expect(responseBody.success).toBeTruthy();
            expect(responseBody.message).toEqual('Reservation found');
            expect(responseBody.responseObject.length).toEqual(limit);
        });

        it('should fail to return a list of reservations', async () => {
            const response = await request(app).get('/api/v1/reservations');
            const responseBody: ServiceResponse<Reservation[]> = response.body;
            expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(responseBody.success).toBeFalsy();
            expect(responseBody.message).toContain('Invalid input');
            expect(responseBody.responseObject).toEqual(null);
        });

    });

    describe('GET /reservations/:uuid', () => {

        it('should return a reservation for a valid uuid', async () => {
            const testUuid = 'bebf296d-1722-464d-a985-a8891621162b';
            const expectedProducts = reservations.get(testUuid);
            const response = await request(app).get(`/api/v1/reservations/${testUuid}`);
            const responseBody: ServiceResponse<Reservation[]> = response.body;
            expect(response.statusCode).toEqual(StatusCodes.OK);
            expect(responseBody.success).toBeTruthy();
            expect(responseBody.message).toContain('Reservation found');
            if (!expectedProducts) throw new Error('Invalid test data: expectedProducts is undefined');
            compareReservation(expectedProducts, responseBody.responseObject);
        });

        it('should return an empty list for a invalid uuid', async () => {
            const testUuid = 'brucecaiftw';
            const response = await request(app).get(`/api/v1/reservations/${testUuid}`);
            const responseBody: ServiceResponse<Reservation[]> = response.body;
            expect(response.statusCode).toEqual(StatusCodes.OK);
            expect(responseBody.success).toBeTruthy();
            expect(responseBody.message).toContain('Reservation found');
            expect(responseBody.responseObject.length).toEqual(0);
        });

    });
    
});

const compareReservation = (mockProduct: ProductDetail[], responseReservation: Reservation[]) => {
    if (!mockProduct || !responseReservation) {
        throw new Error('Invalid test data: mockProduct or responseReservation is undefined');
    }
    expect(responseReservation.length).toEqual(1);
    let sum = 0, active = 0;
    for (let i = 0; i < responseReservation[0].products.length; i++) {
        expect(responseReservation[0].products[i].name).toEqual(mockProduct[i].name);
        expect(responseReservation[0].products[i].charge).toEqual(mockProduct[i].charge);
        expect(responseReservation[0].products[i].status).toEqual(mockProduct[i].status);
        if (mockProduct[i].status === 'true') {
            active++;
            sum += mockProduct[i].charge;
        }
    }
    expect(sum).toEqual(responseReservation[0].sum);
    expect(active).toEqual(responseReservation[0].active);
}