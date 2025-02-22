import { useCallback, useState } from "react";

const identity = (x) => x;

/**
 * Hook that encapsulates loading/error state setting when calling an API promise
 * Usage:
 * const [
 *   doThing, // callback to invoke to initiate the API call
 *   isDoingThing, // boolean indicating if the API call is in progress
 *   errorDoingThing, // error object indicating if there was an error caught (whatever param is passed to the .catch() callback)
 * ] = useApiCall(MyApiUtils.doThing);
 * @param {function} apiFunc The API function to use for setting loading/error state - Must return a promise!
 * @param {function} [onSuccess] Optional callback invoked if the apiFunc promise succeeds
 * @returns {[function, boolean, any]} An array containing a callback to initiate the API call, a isLoading boolean, and an error object
 */
const useApiCall = (apiFunc, onSuccess = identity) => {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const makeCall = useCallback(
    (...args) => {
      setIsLoading(true);
      setError(null);

      apiFunc(...args)
        .then(onSuccess)
        .then(() => {
          setIsLoading(false);
        })

        .catch((err) => {
          setIsLoading(false);
          setError(err);
        });
    },
    [apiFunc, onSuccess]
  );

  return [
    makeCall as (...args: any[]) => void,
    isLoading as boolean,
    error as any,
  ];
};

export default useApiCall;
