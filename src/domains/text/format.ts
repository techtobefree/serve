// Helper function to format price
export const formatPrice = (price: number, currencyCode: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  })
    .format(price)
    .replace(".00", "")
    .replace("$", "§"); // Assuming price is in cents
};

// Helper function to truncate description
export const truncateDescription = (
  description: string,
  maxLength: number = 100
) => {
  if (!description) return "";
  const stripped = description.replace(/<[^>]*>/g, ""); // Remove HTML tags
  return stripped.length > maxLength
    ? stripped.substring(0, maxLength) + "..."
    : stripped;
};
