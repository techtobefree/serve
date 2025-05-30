import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { userStore } from "../auth/sessionStore";

// Environment-based API endpoint
const API_ENDPOINT = import.meta.env.VITE_VENDURE_SHOP_API_URL;

// Ensure we have a consistent guest user ID
const getGuestUserId = (): string => {
  let guestId = localStorage.getItem("guestUserId");
  if (!guestId) {
    guestId = `guest-${Date.now()}`;
    localStorage.setItem("guestUserId", guestId);
  }
  return guestId;
};

// Get the current user ID (either logged in or guest)
export const getUserId = (): string => {
  return userStore.current?.id || getGuestUserId();
};

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: API_ENDPOINT,
});

// Middleware for adding auth headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token if it exists
  const token = userStore.current?.token;

  // Get user ID for session management
  const userId = getUserId();

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "x-stbf-user-id": userId,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

// Apollo client instance
export const apiClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Debug info
console.log("API Client initialized with user ID:", getUserId());
