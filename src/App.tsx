import "./App.css";
import { Routes, Route } from "react-router-dom";
import CityTable from "./components/CityTable";
import WeatherPage from "./components/WeatherPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CityTable />} />
      <Route path="/weather/:cityName" element={<WeatherPage />} />
    </Routes>
  );
}

export default App;
