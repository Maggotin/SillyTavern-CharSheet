export const tryGet = (key: string) => {
  try {
    return window.localStorage.getItem(key);
  } catch (exception) {
    // If 3rd party cookies are turned off even though window.localStorage
    // is accessible or local storage is full this will error
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
    return null;
  }
};

export const trySet = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);

    return true;
  } catch (exception) {
    // Safari can throw an exception when calling localStorage.setItem in a private browsing tab.
    // https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem#Exceptions
    return false;
  }
};

export const tryRemove = (key: string) => {
  try {
    window.localStorage.removeItem(key);

    return true;
  } catch (exception) {
    // Get and trySet can throw exceptions, so this probably can too...
    return false;
  }
};
