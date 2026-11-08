'use client';


export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  shippingAddress,
  setShippingAddress,
  handlePlaceOrder,
  submitting,
  totalAmount,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-lg font-bold text-gray-800">Your Shopping Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>
          </div>

          <div className="divide-y my-4 max-h-[280px] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item._id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-xs text-blue-600 font-bold">
                      ${item.price} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-lg bg-gray-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 text-xs ml-1 font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <form onSubmit={handlePlaceOrder} className="space-y-3 pt-3 border-t">
              <h3 className="font-bold text-gray-700 text-xs uppercase tracking-wider">
                Delivery Information
              </h3>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={shippingAddress.fullName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                }
                className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Phone Number"
                required
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, phone: e.target.value })
                }
                className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Delivery Address"
                required
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, address: e.target.value })
                }
                className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="City"
                required
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                className="w-full bg-gray-50 border p-2.5 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold flex justify-between">
                <span>Payment Method:</span>
                <span>Cash on Delivery (COD)</span>
              </div>

              <div className="flex justify-between items-center text-base font-bold pt-2">
                <span>Total Amount:</span>
                <span className="text-blue-600 text-lg">${totalAmount}</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-sm shadow"
              >
                {submitting ? 'Placing Order...' : 'Confirm & Place Order'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}