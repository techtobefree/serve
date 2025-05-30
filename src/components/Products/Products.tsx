import { useQuery, useMutation } from "@apollo/client";

import { formatPrice } from "../../domains/text/format";
import { Link } from "../../router";
import { WalletBalance } from "../Wallet/WalletBalance";

import {
  PRODUCTS_QUERY,
  ADD_TO_CART_MUTATION,
  ACTIVE_ORDER_QUERY,
} from "./queries";

// Environment-based API endpoint
const API_ENDPOINT = import.meta.env.VITE_VENDURE_SHOP_API_URL;

// Define TypeScript interface for product data
interface Product {
  id: string;
  name: string;
  assets: {
    mimeType: string;
    source: string;
  }[];
  variants: {
    id: string;
    price: number;
    options: {
      name: string;
      group: {
        name: string;
      };
    }[];
  }[];
}

interface ProductsData {
  products: {
    items: Product[];
  };
}

const Products: React.FC = () => {
  const { loading, error, data } = useQuery<ProductsData>(PRODUCTS_QUERY, {
    context: {
      uri: API_ENDPOINT,
    },
  });

  const [addToCart, { loading: addingToCart }] = useMutation(
    ADD_TO_CART_MUTATION,
    {
      context: { uri: API_ENDPOINT },
      refetchQueries: [{ query: ACTIVE_ORDER_QUERY }],
    }
  );

  // Helper function to get the first image asset
  const getFirstImageAsset = (assets: Product["assets"]) => {
    return assets.find((asset) => asset.mimeType.startsWith("image"));
  };

  const handleAddToCart = async (productVariantId: string) => {
    try {
      await addToCart({
        variables: {
          productVariantId,
          quantity: 1,
        },
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading products...</div>
    );
  }
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error loading products: {error.message}</p>
      </div>
    );
  }

  const products = data?.products.items || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <WalletBalance extended />
      <br />
      <br />
      <h1 className="text-3xl font-bold mb-6">Catalog</h1>
      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No products available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageAsset = getFirstImageAsset(product.assets);
            const lowestPrice = Math.min(
              ...product.variants.map((v) => v.price)
            );
            const defaultVariant = product.variants[0];

            return (
              <div
                key={product.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {imageAsset && (
                  <div className="mb-3">
                    <img
                      src={imageAsset.source}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-green-600">
                    From {formatPrice(lowestPrice)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/product/:productId/view`}
                    params={{ productId: product.id }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => void handleAddToCart(defaultVariant.id)}
                    disabled={addingToCart}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded transition-colors"
                  >
                    {addingToCart ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
