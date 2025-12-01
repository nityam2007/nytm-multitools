# NYTM Multitools

A comprehensive collection of 130+ free online developer tools built with Next.js 16 and React 19.

## 🛠️ Features

- **130+ Tools** across 7 categories: Text, Converters, Generators, Encoders, Dev Tools, Image Tools, and Calculators
- **Fast & Modern** - Built with Next.js 16, React 19, and React Compiler
- **Privacy First** - All tools run client-side, your data never leaves your browser
- **No Ads** - Clean, distraction-free interface
- **Dark Mode** - Easy on the eyes

## 🚀 Quick Deploy with Docker

### Prerequisites
- Docker and Docker Compose installed on your server

### One-Command Deploy

```bash
curl -fsSL https://raw.githubusercontent.com/nityam2007/nytm-multitools/main/deploy.sh | bash
```

Or manually:

```bash
# Clone and run deploy script
git clone https://github.com/nityam2007/nytm-multitools.git
cd nytm-multitools
chmod +x deploy.sh
./deploy.sh
```

### Using Docker Compose

```bash
# Pull and run
docker pull ghcr.io/nityam2007/nytm-multitools:latest
docker compose up -d
```

Access the app at `http://your-server-ip:12020`

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🐳 Docker Commands

```bash
# View logs
docker logs -f nytm-multitools

# Stop the app
docker compose down

# Restart the app
docker compose restart

# Update to latest version
docker compose pull && docker compose up -d --force-recreate
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── tools/             # All tool pages (130+)
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── ...
├── components/            # Reusable React components
├── lib/                   # Utility functions and configs
├── public/               # Static assets
├── Dockerfile            # Production Docker image
├── docker-compose.yml    # Docker Compose config
└── deploy.sh            # One-click deploy script
```

## 🔧 Tech Stack

- **Framework**: Next.js 16
- **UI**: React 19 with React Compiler
- **Styling**: Tailwind CSS 4
- **Analytics**: PostHog (optional)
- **Deployment**: Docker + GitHub Container Registry

## 📄 License

Private repository - All rights reserved.
