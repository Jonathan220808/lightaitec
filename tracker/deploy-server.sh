#!/bin/bash
# Deploy script — sets up PM2 auto-start and Nginx /api proxy.
# Run on the server with: bash deploy-server.sh
# Will prompt for sudo password ONCE (cached for the rest of the script).
set -e

echo ""
echo "==================================================="
echo " STEP 1/4  Configure PM2 to start on boot"
echo "==================================================="
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.20.2/bin \
  /home/ubuntu/.nvm/versions/node/v20.20.2/lib/node_modules/pm2/bin/pm2 \
  startup systemd -u ubuntu --hp /home/ubuntu

echo ""
echo "==================================================="
echo " STEP 2/4  Write updated nginx config"
echo "          (HTTPS + /api proxy + /dashboard + block /tracker)"
echo "==================================================="

sudo tee /etc/nginx/sites-available/lightaitec.conf > /dev/null << 'NGINXEOF'
server {
    listen 80;
    server_name lightaitec.com www.lightaitec.com 43.128.107.32;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lightaitec.com www.lightaitec.com;

    ssl_certificate /etc/letsencrypt/live/lightaitec.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lightaitec.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/lightaitec;
    index index.html;

    # Block direct access to backend source / git internals
    location ~ ^/(tracker|\.git) {
        deny all;
        return 404;
    }

    # Tracker API → local Node.js on :3001
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Dashboard (static, key-protected client-side)
    # ^~ makes this prefix beat the later regex, so /dashboard/*.js / *.css
    # are NOT cached for 7 days — dashboard updates show up immediately.
    location ^~ /dashboard {
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        add_header Pragma "no-cache" always;
        add_header Expires "0" always;
        try_files $uri $uri/ /dashboard/index.html;
    }

    # Main site
    location / {
        try_files $uri $uri/ =404;
    }

    # Cache common static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }
}
NGINXEOF
echo "[ok] nginx config written"

echo ""
echo "==================================================="
echo " STEP 3/4  Test nginx config"
echo "==================================================="
sudo nginx -t

echo ""
echo "==================================================="
echo " STEP 4/4  Reload nginx"
echo "==================================================="
sudo systemctl reload nginx

echo ""
echo "==================================================="
echo " ✅ DEPLOY COMPLETE"
echo "==================================================="
echo "  Main site:  https://lightaitec.com"
echo "  API health: https://lightaitec.com/api/health"
echo "  Dashboard:  https://lightaitec.com/dashboard/?key=<YOUR_KEY>"
echo "==================================================="
