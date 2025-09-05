# Horn Hub

A modern, professional dark-themed private media sharing platform built with Next.js and Firebase.

## Features

- 🔐 Password-based authentication (two user profiles)
- 📹 Video upload and streaming from Firebase Storage
- 📸 Image gallery with responsive grid layout
- 👤 Profile picture management
- 🌙 Dark theme with orange highlights
- 📱 Fully responsive design
- ⚡ Real-time upload progress
- 🎨 Smooth animations and transitions

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Add your Firebase configuration to the environment variables:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Deployment Options

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Option 2: Netlify
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables in Netlify dashboard

### Option 3: GitHub Pages (Static Export)
1. Run `npm run export` to create static files
2. Upload the `out` folder to GitHub Pages

## User Credentials

- User 1: Password "Hadil" → Profile: had (male)
- User 2: Password "Hadi" → Profile: Hadil (female)

Profile pictures are stored as `hadi.jpg` and `hadil.jpg` in Firebase Storage.
