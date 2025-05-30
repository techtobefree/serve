import { gql } from "@apollo/client";

// GraphQL query for products
export const PRODUCTS_QUERY = gql`
  query Products {
    products {
      items {
        id
        name
        assets {
          mimeType
          source
        }
        variants {
          id
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

// Add cart mutation
export const ADD_TO_CART_MUTATION = gql`
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ... on Order {
        id
        totalQuantity
        totalWithTax
        lines {
          id
          quantity
          productVariant {
            id
            name
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

// Add active order query
export const ACTIVE_ORDER_QUERY = gql`
  query ActiveOrder {
    activeOrder {
      id
      totalQuantity
      totalWithTax
    }
  }
`;
