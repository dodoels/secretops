import { useEffect, useState } from 'react';
import { fetchReservation } from '../../../api/api';
import './index.scss';
import { Reservation } from '../../models/Reservation';

const ReservationTable = () => {

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const loadReservations = async (page: number = currentPage) => {
        try {
            const fetchedReservations = await fetchReservation(page);
            setReservations(fetchedReservations);
            setCurrentPage(page);
        } catch (error) {
            console.error('Failed to fetch data: ', error);
        }
    };

    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = (uuid: string): void => {
        setExpandedRows((prevExpandedRows) => {
            const newExpandedRows = new Set(prevExpandedRows);
            if (newExpandedRows.has(uuid)) {
                newExpandedRows.delete(uuid);
            } else {
                newExpandedRows.add(uuid);
            }
            return newExpandedRows;
        });
    };

    useEffect(() => {
        loadReservations();
    }, []);

    return (
        <div className='reservation-container'>
            <table className='reservation-table'>
                <thead>
                    <tr>
                        <th>Reservation UUID</th>
                        <th>Number of Active Purchases</th>
                        <th>Sum of Active Charges</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation: Reservation, idx: number) => (
                        <>
                            <tr key={reservation.uuid} onClick={() => toggleRow(reservation.uuid)}>
                                <td>{reservation.uuid}</td>
                                <td>{reservation.products.length}</td>
                                <td>{reservation.sum.toFixed(2)}</td>
                            </tr>
                            {expandedRows.has(reservation.uuid) && (
                                <tr key={`${reservation.uuid}-products`}>
                                    <table className='reservation-expande-table'>
                                        <thead>
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Status</th>
                                                <th>Charge</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reservation.products.map((product) => (
                                                <tr style={{ background: product.status === "true" ? "green" : "red"}}>
                                                    <td>{product.name}</td>
                                                    <td>{product.status === "true" ? "active" : "false" ? "cancelled" : "inactive"}</td>
                                                    <td>{product.charge.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
            <div className="Pagination-container">
                <button onClick={() => loadReservations(currentPage - 1)} disabled={currentPage === 1}>Last</button>
                <button onClick={() => loadReservations(currentPage + 1)} >Next</button>
            </div>
        </div>
    );
};

export default ReservationTable;
