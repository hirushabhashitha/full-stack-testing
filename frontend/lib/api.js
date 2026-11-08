export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://full-stack-testing-bm2o.onrender.com'
    : 'http://localhost:5000');
