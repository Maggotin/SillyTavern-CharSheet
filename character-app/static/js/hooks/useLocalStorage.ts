import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";

import { tryGet, tryRemove, trySet } from "../helpers/localStorageUtils";

//got most of the typing for this at https://usehooks-ts.com/react-hook/use-local-storage

type SetValue<T> = Dispatch<SetStateAction<T>>;
type RemoveValue<T> = Dispatch<SetStateAction<T>>;
function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, SetValue<T>, RemoveValue<T>] {
  const getValue = useCallback(() => {
    const savedValue = tryGet(key);

    return savedValue === null
      ? (defaultValue as T)
      : (parseJSON(savedValue) as T);
  }, [key, defaultValue]);

  const [value, setValue] = useState(getValue());

  useEffect(() => {
    setValue(getValue());
  }, [getValue]);

  const set = useCallback(
    (newValue) => {
      setValue(newValue);
      trySet(key, newValue);
    },
    [key, setValue]
  );

  const remove = () => {
    setValue(defaultValue as T);
    tryRemove(key);
  };

  return [value, set, remove];
}

export default useLocalStorage;

// A wrapper for "JSON.parse()"" to support "undefined" value
function parseJSON<T>(value: any): T | undefined {
  try {
    return value === "undefined" ? undefined : JSON.parse(value ?? "");
  } catch (error) {
    console.log("parsing error on", { value });
    return value;
  }
}
