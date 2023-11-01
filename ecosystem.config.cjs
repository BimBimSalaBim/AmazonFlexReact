require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'blockbot.app',
      script: 'Server.js',
      instances: 'max', 
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'development',
        ...process.env // Spread your environment variables here
      },
      env_production: {
        NODE_ENV: 'production',
	PORT: 3000,
        ...process.env
      },
      autorestart: true,
      max_memory_restart: '1G',
    },
  ],

  deploy: {
    // Deployment configuration if needed
  },
};
