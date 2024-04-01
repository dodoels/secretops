import { useCallback, useEffect, useState } from 'react';
import { fetchReservation, fetchReservationById } from '../../../api/api';
import './index.scss';
import { Reservation } from '../../models/Reservation';
import { RxTriangleDown, RxTriangleRight } from 'react-icons/rx';
import React from 'react';


const ReservationTable = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const loadReservations = useCallback(async (page: number = currentPage) => {
        try {
            const fetchedReservations = await fetchReservation(page);
            setReservations(fetchedReservations);
            setCurrentPage(page);
            setExpandedRows(new Set());
        } catch (error) {
            console.error('Failed to fetch data: ', error);
        }
    }, []);

    const searchReservationById = useCallback(async (event: SubmitEvent) => {
        try {
            event.preventDefault();
            let fetchedReservations: Reservation[];
            if (event.target[0].value.length > 0) {
                fetchedReservations = await fetchReservationById(event.target[0].value);
                setReservations(fetchedReservations);
                setCurrentPage(1);
                setExpandedRows(new Set());
            } else {
                loadReservations();
            }
        } catch (error) {
            console.error('Failed to fetch data: ', error);
        }
    }, []);

    const toggleRow = useCallback((uuid: string): void => {
        setExpandedRows((prevExpandedRows) => {
            const newExpandedRows = new Set(prevExpandedRows);
            if (newExpandedRows.has(uuid)) {
                newExpandedRows.delete(uuid);
            } else {
                newExpandedRows.add(uuid);
            }
            return newExpandedRows;
        });
    }, []);

    const getStatus = useCallback((status: strinng) => {
        switch (status) {
            case 'true': return 'active';
            case 'false': return 'cancelled';
            case 'none': return 'unpaid';
        }
    }, []);

    const getColor = useCallback((status: string) => {
        switch (status) {
            case 'true': return '#6aa84f';
            case 'false': return '#e06666';
            case 'none': return '#e88112';
        }
    }, []);

    useEffect(() => {
        loadReservations();
    }, []);

    return (
        <div className='reservation-container'>
            <div className='pagination-container'>
                <form onSubmit={searchReservationById}>
                    <input type='search' placeholder='Search by UUID' />
                    <button type='submit'>Search</button>
                </form>
                <button onClick={() => loadReservations(currentPage - 1)} disabled={currentPage === 1}>Last</button>
                <button onClick={() => loadReservations(currentPage + 1)}>Next</button>
            </div>
            <table className='reservation-table'>
                <thead>
                    <tr>
                        <th>Reservation UUID</th>
                        <th>Number of Active Purchases</th>
                        <th>Sum of Active Charges</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation: Reservation) => (
                        <React.Fragment key={reservation.uuid}>
                            <tr onClick={() => toggleRow(reservation.uuid)} className='clickable-cell' key={reservation.uuid} >
                                <td>
                                    {!expandedRows.has(reservation.uuid) ? <RxTriangleRight /> : <RxTriangleDown />}
                                    <span>{reservation.uuid}</span>
                                </td>
                                <td>{reservation.active}</td>
                                <td>{reservation.sum.toFixed(2)}</td>
                            </tr>
                            {expandedRows.has(reservation.uuid) && (
                                <React.Fragment>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Status</th>
                                        <th>Charge</th>
                                    </tr>
                                    {reservation.products.map((product, index) => (
                                        <tr key={`${reservation.uuid}-${index}`} style={{ background: getColor(product.status)}} >
                                            <td>{product.name}</td>
                                            <td>{getStatus(product.status)}</td>
                                            <td>{product.charge.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationTable;