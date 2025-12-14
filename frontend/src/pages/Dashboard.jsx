import { useEffect, useState } from "react";
import {
  getSweets,
  searchSweets,
  purchaseSweet,
} from "../services/sweetService";
import SweetCard from "../components/SweetCard";
import { useToast } from "../context/ToastContext";

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Use the Toast hook
  const { showToast } = useToast();

  const fetchSweets = async (query = "") => {
    setLoading(true);
    try {
      const data = query ? await searchSweets(query) : await getSweets();
      setSweets(data);
    } catch (error) {
      console.error("Failed to fetch sweets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSweets(searchTerm);
  };

  // The SINGLE handleBuy function
  const handleBuy = async (id) => {
    try {
      await purchaseSweet(id);
      fetchSweets(searchTerm); // Refresh list to update stock
      showToast("Delicious choice! Purchase successful.", "success");
    } catch (error) {
      console.error("Purchase failed", error);
      showToast("Failed to buy sweet. Out of stock?", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header & Search */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="text-3xl font-bold text-gray-800">Available Sweets</h1>

          <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
            <input
              type="text"
              placeholder="Search sweets..."
              className="w-full rounded border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-xl text-gray-500">
            Loading delicious sweets...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sweets.length > 0 ? (
              sweets.map((sweet) => (
                <SweetCard key={sweet.id} sweet={sweet} onBuy={handleBuy} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No sweets found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
