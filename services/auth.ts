export async function login(email: string, password: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
  
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Login failed: ${error}`);
    }
  
    return await res.json();
  }
  