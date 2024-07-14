const tokenName = "at";
const tokenName2 = `${tokenName}2`;

const StorageManager = {
  save: (token: string) => {
    localStorage.setItem(tokenName, token);
  },
  save2: (token: string) => {
    localStorage.setItem(tokenName2, token);
  },
  get: () => {
    return localStorage.getItem(tokenName);
  },
  get2: () => {
    return localStorage.getItem(tokenName2);
  },
  clear: () => {
    localStorage.setItem(tokenName, "");
    localStorage.setItem(tokenName2, "");
  },
  hasToken: () => {
    const value = localStorage.getItem(tokenName);
    return value != null && value !== "";
  }
};

export default StorageManager;
