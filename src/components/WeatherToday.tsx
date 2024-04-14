interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  name: string;
  sys: {
    country: string;
  };
}

interface WeatherTodayProps {
  weatherData: WeatherData;
}

const WeatherToday = ({ weatherData }: WeatherTodayProps) => {
  if (
    !weatherData ||
    !weatherData.main ||
    !weatherData.weather ||
    weatherData.weather.length === 0
  ) {
    return null;
  }

  const temperature = Math.round(weatherData.main.temp - 273.15);
  const feelsLike = Math.round(weatherData.main.feels_like - 273.15);
  const description = weatherData.weather[0].description;
  const location = weatherData.name;
  const country = weatherData.sys.country;

  const iconCode = weatherData.weather[0].icon;

  const weatherIcon = iconCode ? (
    <img
      src={`https://openweathermap.org/img/wn/${iconCode}.png`}
      alt="Weather Icon"
      className="w-16 h-16 mr-8"
    />
  ) : null;

  return (
    <div className="flex items-center bg-blue-200 rounded-lg shadow-md p-8">
      {weatherIcon}
      <div>
        <h2 className="text-4xl font-bold mb-2">{temperature}°C</h2>
        <p className="text-lg">Feels Like: {feelsLike}°C</p>
        <p className="text-lg">Description: {description}</p>
        <hr className="border-gray-300 my-4" />
        <div className="text-lg space-y-4">
          <p>
            Location: {location}, {country}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherToday;
