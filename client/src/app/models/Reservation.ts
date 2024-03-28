export interface ProductDetail {
    name: string,
    status: string,
    charge: number
}

export interface Reservation {
    uuid: string;
    sum: number;
    products: ProductDetail[]
}
