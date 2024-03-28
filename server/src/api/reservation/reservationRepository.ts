import { Reservation, ProductDetail, ProductCharges, ProductAssignment } from '@/api/reservation/reservationModel';
import { MockProductAssignments } from '@/api/reservation/product_assignment';
import { MockProductCharges } from '@/api/reservation/product_charges';

// Mock databse in-memory data

export const productAssignment: ProductAssignment[] = MockProductAssignments;
export const productCharges: ProductCharges[] = MockProductCharges;


export const reservationRepository = {
    findAllAsync: async (): Promise<Reservation[]> => {
        const reservations = new Map<string, ProductDetail[]>();
        productAssignment.forEach((record: ProductAssignment) => {
            const transaction = productCharges.find((charge: ProductCharges) => 
                charge.special_product_assignment_id === record.id
            )
            if (!reservations.has(record.reservation_uuid)) {
                reservations.set(record.reservation_uuid, []);
            }
            reservations.get(record.reservation_uuid)!.push({
                name: record.name,
                status: transaction ? transaction.active.toString() : 'none',
                charge: transaction ? transaction.amount : 0
            })
        });
        const result: Reservation[] = Array.from(reservations.entries()).map(([uuid, products]) => ({
            uuid,
            sum: products.reduce((acc, product) => acc + product.charge, 0),
            products
        }));
        return result;
    },

    // findByIdAsync: async (id: number): Promise<Reservation | null> => {
    //     return users.find((user) => user.id === id) || null;
    // },
};
