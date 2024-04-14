import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WeatherToday from "./WeatherToday";
import WeatherHighlights from "./WeatherHighlights";

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
  }[];
}

const WeatherPage = () => {
  const { cityName } = useParams<{ cityName: string }>();

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
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
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, [cityName]);

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (!weatherData) {
    return (
      <div className="text-center mt-4">
        No weather data available for {cityName}.
      </div>
    );
  }

  const { main, wind, weather } = weatherData;

  return (
    <div className="flex justify-center flex-col  items-center h-screen mt-[25%] md:mt-2 p-4">
      {" "}
      <h2 className="text-center text-3xl font-extrabold mb-8 ">
        Weather for {cityName}
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
