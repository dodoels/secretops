import './index.scss';
import { Data } from '../../models/Data';

interface DataCardProps {
    data: Data;
}

const DataCard = (props: DataCardProps) => {
    return (
        <div className="DataCard-container">
            <div className="DataCard-content">
                <h3>{props.data.id}</h3>
            </div>
        </div>
    );
};

export default DataCard;
