export const flattenObject = object => {
  let flattened = "";
  Object.keys(object).map(key => {
    return (flattened = flattened + key + ": " + object[key] + "\n");
  });
  return flattened;
};
