import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const responseText = await res.text();
      if (responseText) {
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || responseText;
        } catch {
          errorMessage = responseText;
        }
      }
    } catch (e) {
      // Use statusText if we can't read the response
    }
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

function getAuthToken() {
  return localStorage.getItem('findermeister_token');
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = getAuthToken();
    const res = await fetch(queryKey.join("/") as string, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('findermeister_token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    // Try to parse error response as JSON, fallback to status text
    let errorMessage = `Request failed: ${response.status}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        // For non-JSON responses (like multipart errors), use status text
        errorMessage = response.statusText || errorMessage;
      }
    } catch (parseError) {
      // If we can't parse the response, use the default message
      console.warn('Failed to parse error response:', parseError);
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
};