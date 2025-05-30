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
