module.exports = {
  apps: [
    {
      name: "my-app", 
      script: "./server.js", 
      instances: 1, 
      autorestart: true, 
      watch: false, 
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8080,
      },
    },
  ],
};
