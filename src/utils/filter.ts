
export function findByProperty(
  items: any[],
  propertyName: string,
  propertyValue: string,
): any | undefined {
  const item = items.find((item) => item[propertyName] === propertyValue);
  return item;
}