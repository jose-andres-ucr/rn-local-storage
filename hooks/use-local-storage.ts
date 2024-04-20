import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";

export function useLocalStorage<S>(key: string, initialValue?: S) {
  const [value, setValueState] = React.useState<S | null>(null);

  const getValue = async (): Promise<S | null> => {
    const jsonValue = await AsyncStorage.getItem(key);

    if (jsonValue) {
      try {
        const result = await JSON.parse(jsonValue);
        return result;
      } catch {
        return jsonValue as S;
      }
    }

    if (initialValue) {
      return initialValue;
    }

    return null;
  };

  useEffect(() => {
    getValue().then((response) => {
      return setValueState(response);
    });
  }, []);

  const setValue = (value: S) => {
    setValueState(value);
    if (typeof value === "string") {
      return AsyncStorage.setItem(key, value);
    }
    return AsyncStorage.setItem(key, JSON.stringify(value));
  };

  return { value, setValue } as const;
}
