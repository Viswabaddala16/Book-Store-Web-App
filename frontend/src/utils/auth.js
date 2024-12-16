  import jwtDecode from 'jwt-decode';

  /**
   * Check if the user is authenticated based on the token stored in localStorage.
   * @returns {boolean} true if authenticated, otherwise false.
   */
  export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) {
         return !!token; // Return true if token exists
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime; // Check if token is still valid
    } catch (err) {
      console.error('Invalid token:', err);
      return false;
    }
  };

  /**
   * Logs out the user by clearing the token and navigating to the login page.
   * @param {function} navigate - React router navigate function.
   */
  export const logout = (navigate) => {
    localStorage.removeItem('token');
    if (navigate) {
      navigate('/login');
    }
  };
