import './App.css';
import DataDisplay from './components/DataDisplay';

function App() {
    return (
        <div id="app" className="App-container">
            <div className="App-header">
                <h1 className="App-title">Secret Ops</h1>
            </div>
            <DataDisplay />
        </div>
    );
}

export default App;
