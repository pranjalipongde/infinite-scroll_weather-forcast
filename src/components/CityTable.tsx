import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface City {
  geoname_id: number;
  name: string;
  country: string;
  timezone: string;
  cou_name_en?: string;
}

const CityTable = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const tableRef = useRef<HTMLTableElement>(null);

  const fetchCitiesData = async () => {
    try {
      const response = await fetch(
        "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&lang=en"
      );

      const data = await response.json();

      setTotalPages(data.total_pages);
      setCities((prevCities) => [...prevCities, ...data.results]);
      setFilteredCities((prevCities) => [...prevCities, ...data.results]);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    fetchCitiesData();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        tableRef.current &&
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 20 &&
        page < totalPages
      ) {
        {
          console.log("Fetching more data...");
          setPage((prevPage) => prevPage + 1);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, totalPages]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(term)
    );
    setFilteredCities(filtered);
  };

  return (
    <div className="mx-auto p-4 max-w-3xl">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
        className="border-none border-gray-200  bg-gray-200  rounded p-2 mb-4 w-full"
      />

      <table className="min-w-full border-collapse " ref={tableRef}>
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-200 px-4 py-2">City Name</th>
            <th className="border border-gray-200 px-4 py-2">Country</th>
            <th className="border border-gray-200 px-4 py-2 ">Timezone</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCities.map((city, index) => (
            <tr
              key={`${city.geoname_id}-${index}`}
              className={index % 2 === 0 ? "bg-gray-50" : ""}
            >
              <td className="px-4 py-2">
                <Link
                  to={`/weather/${encodeURIComponent(city.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {city.name}
                </Link>
              </td>
              <td className="px-4 py-2">{city.cou_name_en}</td>
              <td className="px-4 py-2 ">{city.timezone}</td>
            </tr>
          ))}
        </tbody>
        {page < totalPages && (
          <div className="text-center py-4">Loading...</div>
        )}
      </table>
    </div>
  );
};

export default CityTable;
