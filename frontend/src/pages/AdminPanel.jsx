import { useState, useEffect } from "react";
import { getSweets, addSweet, restockSweet } from "../services/sweetService";

const AdminPanel = () => {
  const [sweets, setSweets] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    imageUrl: "",
  });
  const [message, setMessage] = useState("");

  const fetchSweets = async () => {
    const data = await getSweets();
    setSweets(data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSweet(formData);
      setMessage("Sweet added successfully!");
      setFormData({ name: "", price: "", quantity: "", imageUrl: "" });
      fetchSweets(); // Refresh list
    } catch (error) {
      setMessage("Error adding sweet.");
    }
  };

  const handleRestock = async (id) => {
    try {
      await restockSweet(id, 50); // Default restock 50
      setMessage("Restocked successfully!");
      fetchSweets();
    } catch (error) {
      alert("Failed to restock");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        {/* Add Sweet Form */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Add New Sweet</h2>
          {message && <div className="mb-4 text-green-600">{message}</div>}

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Name"
              required
              className="rounded border p-2"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              placeholder="Price"
              type="number"
              required
              className="rounded border p-2"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
            <input
              placeholder="Quantity"
              type="number"
              required
              className="rounded border p-2"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
            <input
              placeholder="Image URL (Optional)"
              className="rounded border p-2"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />
            <button
              type="submit"
              className="col-span-full rounded bg-blue-600 py-2 font-bold text-white hover:bg-blue-700"
            >
              Add Sweet
            </button>
          </form>
        </div>

        {/* Quick Restock List */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Inventory Management</h2>
          <div className="space-y-4">
            {sweets.map((sweet) => (
              <div
                key={sweet.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <span className="font-bold">{sweet.name}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    Stock: {sweet.quantity}
                  </span>
                </div>
                <button
                  onClick={() => handleRestock(sweet.id)}
                  className="rounded bg-green-500 px-3 py-1 text-sm font-bold text-white hover:bg-green-600"
                >
                  Restock (+50)
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
