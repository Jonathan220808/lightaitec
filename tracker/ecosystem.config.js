/**
 * PM2 process config for the lightaitec tracker.
 *
 * Usage (on the server):
 *   cd /var/www/lightaitec/tracker
 *   DASHBOARD_KEY="<your-secret>" pm2 start ecosystem.config.js
 *   pm2 save
 *
 * Or to set the key permanently, edit this file's env block.
 */
module.exports = {
  apps: [
    {
      name: 'lightaitec-tracker',
      script: './server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production'
        // DASHBOARD_KEY is read from the shell env so it isn't committed to git.
      }
    }
  ]
};
