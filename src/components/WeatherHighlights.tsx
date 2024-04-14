interface WeatherData {
  main: {
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  visibility: number;
  clouds: {
    all: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}

interface WeatherHighlightsProps {
  weatherData: WeatherData;
}

const WeatherHighlights = ({ weatherData }: WeatherHighlightsProps) => {
  if (!weatherData || !weatherData.main || !weatherData.visibility) {
    return null;
  }

  const humidity = weatherData.main.humidity;
  const visibility = weatherData.visibility;
  const windSpeed = weatherData.wind.speed;
  const cloudiness = weatherData.clouds.all;
  const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();

  return (
    <div className="bg-blue-200 rounded-lg shadow-md p-8">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Sunrise</h3>
          <p className="text-lg">{sunrise}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Sunset</h3>
          <p className="text-lg">{sunset}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Humidity</h3>
          <p className="text-lg">{humidity}%</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Wind Speed</h3>
          <p className="text-lg">{windSpeed} km/h</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Visibility</h3>
          <p className="text-lg">{visibility} km</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Cloudiness</h3>
          <p className="text-lg">{cloudiness}%</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherHighlights;
