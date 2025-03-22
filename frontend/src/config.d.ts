declare module '../config' {
    const config: {
      api: {
        baseUrl: string;
        endpoints: {
          auth: {
            login: string;
            signup: string;
          };
        };
      };
    };
    export default config;
  }