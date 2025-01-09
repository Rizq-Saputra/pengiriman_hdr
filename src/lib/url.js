export const isUrlMatch = (currentUrl, url, exact = false) => {
  if (exact) {
    // Cocokkan URL yang sama persis
    return currentUrl === url;
  }
  // Cocokkan URL yang sama persis atau dengan ID/slug tambahan
  const regex = new RegExp(`^${url}(/.*)?$`);
  return regex.test(currentUrl);
};

