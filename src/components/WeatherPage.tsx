import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WeatherToday from "./WeatherToday";
import WeatherHighlights from "./WeatherHighlights";

interface WeatherDataProps {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  visibility: number;
  clouds: {
    all: number;
  };
}

const WeatherPage = () => {
  const { cityName } = useParams<{ cityName?: string }>();

  const [weatherData, setWeatherData] = useState<WeatherDataProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!cityName) return;

    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            cityName
          )}&appid=e9729e9b5d386595439d2d761a5e5435`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();

        setWeatherData(data);
      } catch (error) {
        setError("Error fetching weather data");
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, [cityName]);

  if (!cityName) {
    return <div className="text-xl text-red-600">No city name provided.</div>;
  }

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-4">{error}</div>;
  }

  if (!weatherData) {
    return (
      <div className="text-center mt-4">
        No weather data available for {cityName}.
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col  items-center h-screen mt-[30%] md:mt-2 p-4">
      <button
        className="absolute top-4 left-4 bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-800"
        onClick={() => navigate("/")}
      >
        ⬅️ Back
      </button>

      <h2 className="text-center text-3xl font-extrabold mb-8 mt-2">
        Weather for{" "}
        <span className="text-pink-600">
          {weatherData.name} <span className="text-black">City,</span>{" "}
          {weatherData.sys.country}
        </span>
      </h2>

      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {" "}
        <div className="flex-grow bg-gray-300 rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold mb-4 text-indigo-800">
            Today's Weather
          </h2>

          <WeatherToday weatherData={weatherData} />
        </div>
        <div className="flex-grow bg-gray-300 rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold mb-4 text-indigo-800">
            Today's Highlights
          </h2>

          <WeatherHighlights weatherData={weatherData} />
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
