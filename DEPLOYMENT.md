# NYTM Tools - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (for version control)

## Quick Start (Development)

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your values
# - Set AUTH_PASSWORD (admin login password)
# - Set AUTH_SECRET (JWT signing key, min 32 chars)

# Run development server
npm run dev

# Open http://localhost:3000
```

## Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## Deployment Options

### Option 1: Vercel (Recommended for Simplicity)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/nytm-tools.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `AUTH_PASSWORD`: Your admin password
     - `AUTH_SECRET`: Your JWT secret (32+ chars)
   - Deploy!

3. **Custom Domain (nytm.in)**
   - In Vercel dashboard, go to Project Settings > Domains
   - Add `nytm.in`
   - Update DNS records at your registrar:
     ```
     A     @    76.76.19.19
     CNAME www  cname.vercel-dns.com
     ```

**Note**: Vercel's serverless functions have ephemeral storage. For persistent SQLite data, consider using Vercel's Edge Config or an external database.

---

### Option 2: Hostinger VPS

1. **Server Setup**
   ```bash
   # Connect to your VPS
   ssh root@your-server-ip

   # Update system
   apt update && apt upgrade -y

   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs

   # Install PM2 for process management
   npm install -g pm2

   # Install Nginx
   apt install -y nginx
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   cd /var/www
   git clone https://github.com/yourusername/nytm-tools.git
   cd nytm-tools

   # Install dependencies
   npm install

   # Create environment file
   cp .env.example .env.local
   nano .env.local  # Edit with your values

   # Create data directory
   mkdir -p data
   chmod 755 data

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "nytm-tools" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**
   ```bash
   nano /etc/nginx/sites-available/nytm.in
   ```

   ```nginx
   server {
       listen 80;
       server_name nytm.in www.nytm.in;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable site
   ln -s /etc/nginx/sites-available/nytm.in /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

4. **SSL Certificate (Let's Encrypt)**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d nytm.in -d www.nytm.in
   ```

5. **DNS Configuration**
   At your domain registrar (Hostinger):
   ```
   A     @    YOUR_VPS_IP
   A     www  YOUR_VPS_IP
   ```

---

### Option 3: Netlify

1. **Push to GitHub** (same as Vercel)

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Import from GitHub
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variables

3. **Custom Domain**
   - Domain Settings > Add custom domain
   - Update DNS:
     ```
     A     @    75.2.60.5
     CNAME www  your-site.netlify.app
     ```

**Note**: Netlify requires `@netlify/plugin-nextjs` for full Next.js support. Add to `netlify.toml`:
```toml
[[plugins]]
package = "@netlify/plugin-nextjs"
```

---

## Post-Deployment Checklist

- [ ] Application loads at your domain
- [ ] Dark/light theme toggle works
- [ ] Tools function correctly
- [ ] Admin login works at `/admin/login`
- [ ] Admin dashboard shows statistics
- [ ] Archive records are being saved
- [ ] SSL certificate is active (https://)

---

## Maintenance

### Update Application
```bash
cd /var/www/nytm-tools
git pull origin main
npm install
npm run build
pm2 restart nytm-tools
```

### View Logs
```bash
# PM2 logs
pm2 logs nytm-tools

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Backup Database
```bash
# Copy SQLite database
cp /var/www/nytm-tools/data/archive.sqlite /backup/archive-$(date +%Y%m%d).sqlite
```

### Monitor Resources
```bash
pm2 monit
htop
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_PASSWORD` | Yes | Admin panel password |
| `AUTH_SECRET` | Yes | JWT signing secret (32+ chars) |
| `NEXT_PUBLIC_APP_URL` | No | Application URL for metadata |
| `NEXT_PUBLIC_APP_NAME` | No | Application name |

---

## Troubleshooting

### Application won't start
```bash
# Check Node version
node --version  # Should be 18+

# Check for errors
npm run build 2>&1 | head -50

# Check PM2 status
pm2 status
pm2 logs nytm-tools --lines 100
```

### Database errors
```bash
# Ensure data directory exists and is writable
mkdir -p data
chmod 755 data

# Check SQLite file
ls -la data/
```

### 502 Bad Gateway (Nginx)
```bash
# Check if app is running
pm2 status

# Check Nginx config
nginx -t

# Restart services
pm2 restart nytm-tools
systemctl restart nginx
```

### SSL Certificate Issues
```bash
# Renew certificate
certbot renew --dry-run

# Force renewal
certbot renew --force-renewal
```

---

## Security Recommendations

1. **Use strong passwords** for AUTH_PASSWORD
2. **Generate secure secrets**: `openssl rand -base64 32`
3. **Enable firewall**: 
   ```bash
   ufw allow 22
   ufw allow 80
   ufw allow 443
   ufw enable
   ```
4. **Keep system updated**: `apt update && apt upgrade`
5. **Regular backups** of the data directory
6. **Monitor logs** for suspicious activity

---

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/yourusername/nytm-tools/issues)
- Review Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)

---

Built with ❤️ using Next.js, TailwindCSS, and TypeScript
