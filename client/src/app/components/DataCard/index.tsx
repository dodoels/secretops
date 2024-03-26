import './index.scss';

const DataCard = ({ data }) => {
    return (
        <div className="DataCard-container">
            <div className="DataCard-content">
                <h3>{data}</h3>
            </div>
        </div>
    );
};

export default DataCard;
