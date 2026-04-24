// Utility to store the access token in memory to avoid circular dependencies
// between api-client and useAuthStore.

let _cachedAccessToken: string | null = null;

export const setCachedAccessToken = (token: string | null) => {
  _cachedAccessToken = token;
};

export const getCachedAccessToken = () => {
  return _cachedAccessToken;
};
