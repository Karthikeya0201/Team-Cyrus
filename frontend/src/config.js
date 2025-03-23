const config = {
  api: {
    baseUrl: 'http://localhost:8000',
    endpoints: {
      auth: {
        login: '/login',
        signup: '/signup',
      },
      resume: {
        ats: '/ats',
        enhance: '/enhance'
      }
    },
  },
};

export default config;
