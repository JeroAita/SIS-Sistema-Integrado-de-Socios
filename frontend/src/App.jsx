import SportsDashboard from './components/layout/SportsDashboard'
import './App.css'

function App() {
  let api_endpoint = import.meta.env.VITE_API_ENDPOINT;
  
  return (
    <div className="App">
      <SportsDashboard />
    </div>
  )
}

export default App