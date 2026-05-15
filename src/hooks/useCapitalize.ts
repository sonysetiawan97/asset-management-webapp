import { useCallback } from "react";

const useCapitalize = () => {
  const capitalizeFirstLetterWords = useCallback((str: string): string => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }, []);

  return { capitalizeFirstLetterWords };
};

export default useCapitalize;
