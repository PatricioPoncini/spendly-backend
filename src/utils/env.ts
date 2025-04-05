export const getEnvOrFail = (key: string): string => {
  const value = Bun.env[key];
  if (!value) {
    throw new Error(`Environment variable "${key}" is required but was not found.`);
  }
  return value;
};
