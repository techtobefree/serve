import { gql, useQuery } from "@apollo/client";

// GraphQL query for products
const PRODUCTS_QUERY = gql`
  query Products {
    products {
      items {
        id
        name
        description
        assets {
          mimeType
          source
        }
        variants {
          price
          options {
            name
            group {
              name
            }
          }
        }
      }
    }
  }
`;

// Environment-based API endpoint
const API_ENDPOINT = import.meta.env.VITE_VENDURE_SHOP_API_URL;

// Define TypeScript interface for product data
interface Product {
  id: string;
  name: string;
  description: string;
  assets: {
    mimeType: string;
    source: string;
  }[];
  variants: {
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

  // Helper function to get the first image asset
  const getFirstImageAsset = (assets: Product["assets"]) => {
    return assets.find((asset) => asset.mimeType.startsWith("image"));
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
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No products available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageAsset = getFirstImageAsset(product.assets);

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
                <p className="text-gray-600 mb-4">{product.description}</p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors">
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
