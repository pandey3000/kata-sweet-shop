// Add onBuy to the props
const SweetCard = ({ sweet, onBuy }) => {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg">
      <div className="h-48 w-full bg-gray-200">
        <div className="flex h-full items-center justify-center text-gray-400">
          {sweet.imageUrl ? (
            <img
              src={sweet.imageUrl}
              alt={sweet.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>No Image</span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">{sweet.name}</h3>
          {isOutOfStock && (
            <span className="rounded bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
              Out of Stock
            </span>
          )}
        </div>

        <p className="mt-2 text-gray-600">Price: ${sweet.price}</p>
        <p className="text-sm text-gray-500">Stock: {sweet.quantity}</p>

        <button
          onClick={() => onBuy(sweet.id)} // <--- CONNECT THE BUTTON
          disabled={isOutOfStock}
          className={`mt-4 w-full rounded px-4 py-2 font-bold text-white transition 
            ${
              isOutOfStock
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {isOutOfStock ? "Unavailable" : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export default SweetCard;
