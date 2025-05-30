import { gql, useQuery } from "@apollo/client";

import { useParams, Link } from "../../../../router";

// GraphQL query for a single product
const PRODUCT_QUERY = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      name
      description
      assets {
        mimeType
        source
      }
      variants {
        id
        name
        price
        currencyCode
        options {
          name
          group {
            name
          }
        }
      }
    }
  }
`;

// Environment-based API endpoint
const API_ENDPOINT = import.meta.env.VITE_VENDURE_SHOP_API_URL;

// Define TypeScript interface for product data
interface ProductVariant {
  id: string;
  name: string;
  price: number;
  currencyCode: string;
  options: {
    name: string;
    group: {
      name: string;
    };
  }[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  assets: {
    mimeType: string;
    source: string;
  }[];
  variants: ProductVariant[];
}

interface ProductData {
  product: Product;
}

export default function ProductView() {
  const { productId } = useParams("/product/:productId/view");

  const { loading, error, data } = useQuery<ProductData>(PRODUCT_QUERY, {
    variables: { id: productId },
    context: {
      uri: API_ENDPOINT,
    },
    skip: !productId,
  });

  // Helper function to get image assets
  const getImageAssets = (assets: Product["assets"]) => {
    return assets.filter((asset) => asset.mimeType.startsWith("image"));
  };

  // Helper function to format price
  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(price / 100); // Assuming price is in cents
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading product...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error loading product: {error.message}</p>
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Product not found</p>
        <Link
          to="/celebrate"
          className="text-blue-500 hover:underline mt-2 inline-block"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const product = data.product;
  const imageAssets = getImageAssets(product.assets);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/celebrate" className="text-blue-500 hover:underline">
          ← Back to Catalog
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {imageAssets.length > 0 ? (
            <div className="space-y-4">
              <img
                src={imageAssets[0].source}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {imageAssets.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {imageAssets.slice(1, 5).map((asset, index) => (
                    <img
                      key={index}
                      src={asset.source}
                      alt={`${product.name} ${(index + 2).toString()}`}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <div
                className="text-gray-700 prose"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* Variants and Pricing */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Available Options</h2>
            <div className="space-y-3">
              {product.variants.map((variant) => (
                <div key={variant.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{variant.name}</h3>
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(variant.price, variant.currencyCode)}
                    </span>
                  </div>
                  {variant.options.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {variant.options.map((option, index) => (
                        <span key={index}>
                          {option.group.name}: {option.name}
                          {index < variant.options.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
