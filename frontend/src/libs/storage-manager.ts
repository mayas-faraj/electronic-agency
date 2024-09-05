const tokenName = "at";

const StorageManager = {
  save: (token: string) => {
    localStorage.setItem(tokenName, token);
  },
  get: () => {
    return localStorage.getItem(tokenName);
  },
  clear: () => {
    localStorage.setItem(tokenName, "");
  },
  hasToken: () => {
    const value = localStorage.getItem(tokenName);
    return value != null && value !== "";
  }
};

export default StorageManager;
