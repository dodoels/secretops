import './App.scss';
import ReservationTable from './components/ReservationTable';

function App() {
    return (
        <div id="app" className="App-container">
            <div className="App-header">
                <h1 className="App-title">Secret Ops</h1>
            </div>
            <ReservationTable />
        </div>
    );
}

export default App;
