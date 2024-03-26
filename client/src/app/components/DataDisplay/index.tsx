import { useEffect, useState } from 'react';
import { fetchData } from '../../../api/api';
import './index.scss';
import DataCard from '../DataCard';

const DataDisplay = () => {
    const [data, setData] = useState([]);

    const loadData = async () => {
        try {
            const fetchedData = await fetchData();
            setData(fetchedData.data);
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
                {data.map((data) => (
                    <DataCard key={data.id} data={data} />
                ))}
            </div>
        </div>
    );
};

export default DataDisplay;
