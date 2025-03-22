const config = {
  api: {
    baseUrl: 'https://localhost:5000',
    endpoints: {
      auth: {
        login: '/auth/login',
        signup: '/auth/signup'
      },
      questions: {
        generate: '/questions/generate_questions'
      },
      report: {
        get: '/report'
      },
      history: {
        get: '/history'
      },
      feedback:{
        submit:'/feedback/submit'
      }
    }
  }
};

export default config;
