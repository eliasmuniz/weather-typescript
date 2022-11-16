import type { City } from "./types";

export type RawWeather = {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      "3h": number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};

export type Weather = {
  city: {
    id: string;
    name: string;
  };
  forecast: {
    date: string;
    min: number;
    max: number;
  };
};

export function kelvinToCelcius(temp: number): number{
  return Math.round(temp - 273.15);
}

export function formatWeather(weather: RawWeather): Weather{

  const {
    0: first,
    8: second,
    16: third,
    24: fourth,
    32: fifth,
  } = weather.list;

  return {
    city: {
      id: String( weather.city.id),
      name: weather.city.name,
    },
    forecast: [first, second, third, fourth, fifth].map((forecast) => ({
      date: new Date(forecast.dt * 1000).toLocaleDateString('es-AR'),
      min: kelvinToCelcius(forecast.main.temp_min),
      max: kelvinToCelcius(forecast.main.temp_max),
    })),
  };
}

const api = {
  weather: {
    fetch: async (city: City): Promise<Weather> => {
      const request = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${
          city.lon
        }&appid=${import.meta.env.VITE_API_KEY}`
      );
      const response: RawWeather = await request.json();

      const {
        0: first,
        8: second,
        16: third,
        24: fourth,
        32: fifth,
      } = response.list;

      return formatWeather(response);

      
    },
  },
};

export default api;
