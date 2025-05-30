import { useMutation } from "@apollo/client";
import { useState } from "react";

import { userStore } from "../../domains/auth/sessionStore";
import { showToast } from "../../domains/ui/toast";
import { Link } from "../../router";

import { ADD_TO_CART_MUTATION, ACTIVE_ORDER_QUERY } from "./queries";

// Environment-based API endpoint
const API_ENDPOINT = import.meta.env.VITE_VENDURE_SHOP_API_URL;

type AddToCartButtonProps = {
  productVariantId: string;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productVariantId,
  quantity = 1,
  className = "cursor-pointer bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded transition-colors",
  children = "Add to Cart",
  disabled = false,
}: AddToCartButtonProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const [addToCart] = useMutation(ADD_TO_CART_MUTATION, {
    context: {
      uri: API_ENDPOINT,
      headers: {
        // Use the user ID from your STBF app instead of generating a session ID
        "x-stbf-user-id":
          userStore.current?.id ||
          `guest-${
            localStorage.getItem("guestUserId") || Date.now().toString()
          }`,
      },
    },
    refetchQueries: [
      {
        query: ACTIVE_ORDER_QUERY,
        context: {
          uri: API_ENDPOINT,
          headers: {
            // Ensure consistent user ID across requests
            "x-stbf-user-id":
              userStore.current?.id ||
              `guest-${
                localStorage.getItem("guestUserId") || Date.now().toString()
              }`,
          },
        },
      },
    ],
  });

  // Ensure we have a consistent guest user ID for non-logged-in users
  if (!userStore.current?.id && !localStorage.getItem("guestUserId")) {
    localStorage.setItem("guestUserId", Date.now().toString());
  }

  console.log(
    "AddToCartButton using user ID:",
    userStore.current?.id ||
      `guest-${localStorage.getItem("guestUserId") || "unknown"}`
  );

  const handleAddToCart = async () => {
    if (disabled || isAdding) return;

    setIsAdding(true);
    try {
      const result = await addToCart({
        variables: {
          productVariantId,
          quantity,
        },
      });

      if (result.data?.addItemToOrder?.__typename === "Order") {
        // Success - show toast with cart link
        showToast(
          <div className="flex items-center justify-between w-full bg-white rounded-lg p-3 shadow-md">
            <span>Item added to cart!</span>
            <Link
              to="/cart"
              className="ml-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              View Cart
            </Link>
          </div>,
          {
            duration: 4000,
            isError: false,
          }
        );
      } else {
        // Error from GraphQL
        const error = result.data?.addItemToOrder;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        showToast(`Failed to add item: ${error?.message || "Unknown error"}`, {
          duration: 5000,
          isError: true,
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      showToast("Failed to add item to cart", {
        duration: 5000,
        isError: true,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={className}
    >
      {isAdding ? "Adding..." : children}
    </button>
  );
};

export default AddToCartButton;
