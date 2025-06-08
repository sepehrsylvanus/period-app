export const serializeMongoId = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};
