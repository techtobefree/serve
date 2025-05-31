import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Environment-based API endpoint
const API_ENDPOINT = import.meta.env.VITE_VENDURE_SHOP_API_URL;

// Store for authorization token
let authToken: string | null =
  localStorage.getItem("vendureSessionToken") || null;

const httpLink = createHttpLink({
  uri: API_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      ...(authToken && {
        authorization: authToken.startsWith("Bearer")
          ? authToken
          : `Bearer ${authToken}`,
      }),
    },
  };
});

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;

    if (headers) {
      // Extract authorization token from response headers
      const newToken = headers.get("vendure-auth-token");
      if (newToken) {
        authToken = newToken;
        localStorage.setItem("vendureSessionToken", newToken);
        // Option to persist in STBF profile/user table to share cart across devices
      }
    }

    return response;
  });
});

export const apolloClient = new ApolloClient({
  link: from([authLink, afterwareLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
