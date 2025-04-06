import { useState } from 'react';

function useFetch() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const callFetch = async ({
    uri,
    method = 'GET',
    body,
    headers,
    signal,
    toJson = true,
    toBlob = false,
    parse = true,
    removeContentType = false,
  }) => {
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const heads = {
        'Content-Type': 'application/json',
        ...headers,
      };
      if (removeContentType) delete heads['Content-Type'];

      const reply = await fetch(uri, {
        method,
        body,
        headers,
        signal,
        credentials: 'include',
      });

      let res;
      if (!parse) res = reply;
      else if (toBlob) res = await reply.blob();
      else if (toJson) res = await reply.json();
      else res = await reply.text();

      setResult(res ?? true);
    } catch (ex) {
      let parsedError = null;

      try {
        parsedError = await ex.json();
      } catch (e) {
        // No se pudo convertir el error a json
        console.error('Error parsing error response:', e);
      }
      setError({
        status: ex?.status,
        message: parsedError?.err?.trim() || ex?.statusMessage?.trim() || ex?.statusText?.trim() || 'Ocurrió un error.',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    callFetch,
    result,
    error,
    loading,
  };
}

export default useFetch;
