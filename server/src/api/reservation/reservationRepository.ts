import { Reservation, ProductDetail, ProductCharges, ProductAssignment } from '@/api/reservation/reservationModel';
import { MockProductAssignments } from '@/api/reservation/product_assignment';
import { MockProductCharges } from '@/api/reservation/product_charges';


/**
 * The goal is to convert the data into key-value store for better performance
 * originally they are in the function as I want to treat the raw data as it is
 * but if we want to have it behave as database we need to preprocess them
 */

const preprocess = (
    productAssignment: ProductAssignment[],
    productCharges: ProductCharges[]
): Map<string, ProductDetail[]> => {

    // create transaction map
    const chargesMap = new Map<number, ProductCharges>();
    productCharges.forEach((charge: ProductCharges) => {
        chargesMap.set(charge.special_product_assignment_id, charge);
    });

    // create reservation map that stores all transactions that link to the same reservation
    // if the transaction does not exist, meaning it is "unpaid" (none as strinng)
    const reservations = new Map<string, ProductDetail[]>();
    productAssignment.forEach((record: ProductAssignment) => {
        const transaction = chargesMap.get(record.id);
        if (!reservations.has(record.reservation_uuid)) {
            reservations.set(record.reservation_uuid, []);
        }
        reservations.get(record.reservation_uuid)!.push({
            name: record.name,
            status: transaction? transaction.active.toString() : "none",
            charge: transaction ? transaction.amount : 0
        });
    });

    // sort the store by uuid
    return new Map([...reservations.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

export const reservations = preprocess(MockProductAssignments, MockProductCharges);

export const reservationRepository = {
    
    findAllAsync: async (limit: number, offset: number): Promise<Reservation[]> => {
        const result: Reservation[] = Array.from(reservations.keys())
            .slice(offset, offset + limit)
            .map((uuid: string) => {
            const products = reservations.get(uuid) || [];
            return {
                uuid,
                sum: products.reduce((acc, product) => acc += product.status === "true" ? product.charge : 0, 0),
                active: products.reduce((acc, product) => acc += product.status === "true" ? 1 : 0, 0),
                products
            }
        });
        return result;
    },

    findByIdAsync: async (searchUuid: string): Promise<Reservation[]> => {
        const result: Reservation[] = Array.from(reservations.keys())
            .filter((uuid: string) => uuid.indexOf(searchUuid) !== -1)
            .map((uuid: string) => {
            const products = reservations.get(uuid) || [];
            return {
                uuid,
                sum: products.reduce((acc, product) => acc += product.status === "true" ? product.charge : 0, 0),
                active: products.reduce((acc, product) => acc += product.status === "true" ? 1 : 0, 0),
                products
            }
        });
        return result;
    }

};
