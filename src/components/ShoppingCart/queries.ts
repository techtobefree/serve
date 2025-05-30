import { gql } from "@apollo/client";

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

export const ACTIVE_ORDER_QUERY = gql`
  query ActiveOrder {
    activeOrder {
      id
      totalQuantity
      totalWithTax
      subTotalWithTax
      shippingWithTax
      lines {
        id
        quantity
        linePrice
        linePriceWithTax
        productVariant {
          id
          name
          price
          priceWithTax
          product {
            name
            assets {
              source
              mimeType
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_ORDER_LINE_MUTATION = gql`
  mutation UpdateOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      ... on Order {
        id
        totalQuantity
        totalWithTax
        lines {
          id
          quantity
          linePriceWithTax
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const REMOVE_ORDER_LINE_MUTATION = gql`
  mutation RemoveOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      ... on Order {
        id
        totalQuantity
        totalWithTax
        lines {
          id
          quantity
          linePriceWithTax
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;
