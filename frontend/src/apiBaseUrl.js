// Use this file to get the backend API URL depending on environment

const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    // Use your Render backend URL in production
  return 'https://girls-deck.onrender.com';
  } else {
    // Use local backend in development
  return 'http://localhost:3001';
  }
};

export default getApiBaseUrl;
