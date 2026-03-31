import { useState, useEffect } from "react";

export const useDebounce = <T>(value: T, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(handler); // cleanup on value change
    }, [value, delay]);

    return debouncedValue;
};