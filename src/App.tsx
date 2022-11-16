import type { City } from "./types";
import React, { useEffect, useState } from "react";
import api, { type Weather } from "./api";

console.log(import.meta.env.VITE_API_KEY);


// espcificamos en el tipado que es un objeto en el que
// las keys son strings y los valores son cities
const CITIES: Record<string, City> = {
  mendoza:{
    id: "mendoza",
    name: "Mendoza",
    lat: -32.888355,
    lon: -68.838844,
  },
  bariloche:{
    id: "bariloche",
    name: "Bariloche",
    lat: 0,
    lon: 0,
  },
  sanjuan:{
    id: "san juan",
    name: "San Juan",
    lat: 0,
    lon: 0,
  },
};

function App() {
  const [status, setStatus] = useState<"pending" | "resolved">("pending");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [city, setCity] = useState<City>(CITIES['mendoza']);

  function handleChangeCity(event: React.ChangeEvent) {
    const city = event?.target.value as keyof typeof CITIES;
    setCity(CITIES[city]);
  }

  useEffect(() => {
    api.weather.fetch(city).then((weather) => {
      setWeather(weather);
      setStatus("resolved");
    });
  }, [city]);

  if (status === "pending") {
    return <div>Cargando...</div>;
  }

  if (!weather) {
    return <div>La ciudad no existe o no hay datos del clima</div>;
  }

  return (
    <main>
      <select onChange={handleChangeCity} value={city?.id}>
        <option value="">Seleccioná tu ciudad</option>
        {Object.values(CITIES).map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
      <h1>{weather.city.name}</h1>
      <ul>
        {weather.forecast.map((forecast, index) => (
          <li key={index}>
            Min: {forecast.min}, Max: {forecast.max}{" "}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
