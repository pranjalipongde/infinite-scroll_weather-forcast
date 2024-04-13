import { useEffect, useRef, useState } from "react";

interface City {
  geonameid: number;
  name: string;
  country: string;
  timezone: string;
}

const CityTable = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const tableRef = useRef<HTMLTableElement>(null);

  const fetchCitiesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&lang=en"
      );

      const data = await response.json();

      setTotalPages(data.total_pages);
      setCities((prevCities) => [...prevCities, ...data.results]);
      setFilteredCities((prevCities) => [...prevCities, ...data.results]);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
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
          window.document.body.offsetHeight - 30 &&
        !loading
      ) {
        if (page < totalPages) {
          console.log("Fteching more data...");

          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, totalPages, loading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(term)
    );
    setFilteredCities(filtered);
  };

  return (
    <div className="mx-auto p-4 max-w-2xl">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
        className="border border-gray-300 rounded p-2 mb-4 w-full"
      />

      <table className="min-w-full border-collapse " ref={tableRef}>
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2">City Name</th>
            <th className="border border-gray-200 px-4 py-2">Country</th>
            <th className="border border-gray-200 px-4 py-2">Timezone</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCities.map((city, index) => (
            <tr key={city.geoname_id}>
              <td className="px-4 py-2">
                <a
                  href={`/weather/${city.name}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {city.name}
                </a>
              </td>
              <td className="px-4 py-2">{city.cou_name_en}</td>
              <td className="px-4 py-2">{city.timezone}</td>
              {index === filteredCities.length - 1 && page < totalPages && (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CityTable;
