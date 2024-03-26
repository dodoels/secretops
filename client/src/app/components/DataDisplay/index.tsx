import { useEffect, useState } from 'react';
import { fetchData } from '../../../api/api';
import './index.scss';
import DataCard from '../DataCard';
import { Data } from '../../models/Data';

const DataDisplay = () => {
    const [data, setData] = useState<Data[]>([]);

    const loadData = async () => {
        try {
            const fetchedData = await fetchData();
            setData(fetchedData);
        } catch (error) {
            console.error('Failed to fetch data: ', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="DataDisplay-container">
            <div className="DataDisplay-title">
                <h2>Data</h2>
            </div>
            <div className="DataDisplay-cards">
                {data && data.map((data: Data) => (
                    <DataCard key={data.id} data={data} />
                ))}
            </div>
        </div>
    );
};

export default DataDisplay;
