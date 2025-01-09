import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const fetchWithAuth = async (endpoint, options = {}, token = null) => {
    // Use the provided token or get it from localStorage
    const authToken = token || (typeof window !== 'undefined' && localStorage.getItem('token'));

    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        },
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, mergedOptions);

    if (response.status === 401) {
        console.log("Unauthorized");
        const refreshToken = typeof window !== 'undefined' && localStorage.getItem('refreshToken');
        const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${refreshToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });
        console.log(refreshResponse);

        if (refreshResponse.status === 200) {
            const { token } = await refreshResponse.json();
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
            }
            console.log('should refetch');

            // reload the page
            window.location.reload();

            return fetchWithAuth(endpoint, options, token);
        }
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }
        redirect('/login');
    }

    // Parse the response based on content type
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    // Return both status and parsed data
    return {
        status: response.status,
        body: data,
        ok: response.ok
    };
}; 