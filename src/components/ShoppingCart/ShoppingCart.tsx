import { useQuery, useMutation } from "@apollo/client";

import {
  ACTIVE_ORDER_QUERY,
  UPDATE_ORDER_LINE_MUTATION,
  REMOVE_ORDER_LINE_MUTATION,
} from "./queries";

interface OrderLine {
  id: string;
  quantity: number;
  linePrice: number;
  linePriceWithTax: number;
  productVariant: {
    id: string;
    name: string;
    price: number;
    priceWithTax: number;
    product: {
      name: string;
      assets: Array<{
        source: string;
        mimeType: string;
      }>;
    };
  };
}

interface ActiveOrder {
  id: string;
  totalQuantity: number;
  totalWithTax: number;
  subTotalWithTax: number;
  shippingWithTax: number;
  lines: OrderLine[];
}

export const ShoppingCart: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(ACTIVE_ORDER_QUERY);
  const [updateOrderLine] = useMutation(UPDATE_ORDER_LINE_MUTATION);
  const [removeOrderLine] = useMutation(REMOVE_ORDER_LINE_MUTATION);

  const activeOrder: ActiveOrder | null = data?.activeOrder;

  const handleUpdateQuantity = async (
    orderLineId: string,
    quantity: number
  ) => {
    try {
      await updateOrderLine({
        variables: { orderLineId, quantity },
      });
      void refetch();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (orderLineId: string) => {
    try {
      await removeOrderLine({
        variables: { orderLineId },
      });
      void refetch();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (loading) return <div className="p-4">Loading cart...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">
        Error loading cart: {error.message}
      </div>
    );
  if (!activeOrder || activeOrder.lines.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      <div className="space-y-4">
        {activeOrder.lines.map((line) => (
          <div
            key={line.id}
            className="flex items-center space-x-4 p-4 border rounded-lg"
          >
            {line.productVariant.product.assets.length > 0 && (
              <img
                src={line.productVariant.product.assets[0].source}
                alt={line.productVariant.product.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}

            <div className="flex-1">
              <h3 className="font-semibold">
                {line.productVariant.product.name}
              </h3>
              <p className="text-sm text-gray-600">
                {line.productVariant.name}
              </p>
              <p className="text-sm font-medium">
                ${(line.productVariant.priceWithTax / 100).toFixed(2)} each
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  void handleUpdateQuantity(line.id, line.quantity - 1)
                }
                disabled={line.quantity <= 1}
                className="px-2 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="px-3 py-1 min-w-[2rem] text-center">
                {line.quantity}
              </span>
              <button
                onClick={() =>
                  void handleUpdateQuantity(line.id, line.quantity + 1)
                }
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ${(line.linePriceWithTax / 100).toFixed(2)}
              </p>
              <button
                onClick={() => void handleRemoveItem(line.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border-t">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${(activeOrder.subTotalWithTax / 100).toFixed(2)}</span>
          </div>
          {activeOrder.shippingWithTax > 0 && (
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${(activeOrder.shippingWithTax / 100).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>${(activeOrder.totalWithTax / 100).toFixed(2)}</span>
          </div>
        </div>

        <button className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};
