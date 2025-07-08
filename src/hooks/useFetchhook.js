import { useState, useEffect, useCallback, useRef } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function useFetchhook(
  endpoint,
  options = {
    method: "GET",
    headers: {},
    body: null,
    token: null,
    credentials: "same-origin",
    skip: false,
  }
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!options.skip);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(BASE_URL + endpoint, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.token && { Authorization: `Bearer ${options.token}` }),
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : null,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed with status ${res.status}: ${text}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Fetch error");
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]); // Properly scoped dependencies

  useEffect(() => {
    if (!options.skip) {
      fetchData();
    }
    return () => controllerRef.current?.abort();
  }, [fetchData, options.skip]);

  return { data, loading, error, refetch: fetchData };
}
