# OTT Platform

A production-ready Basic OTT Platform with a Flutter mobile application, React admin panel, and ASP.NET Core Web API.

## Features
- Clean Architecture & SOLID Principles
- JWT Authentication
- HLS Video Streaming
- AWS S3 Integration
- PostgreSQL Database
- Responsive UI (Mobile & Web)

## Project Structure
- `/backend`: ASP.NET Core 9 Web API
- `/admin`: React Admin Dashboard
- `/mobile`: Flutter Mobile Application

## Prerequisites
- .NET 9 SDK
- Node.js & npm
- Flutter SDK
- Docker & Docker Compose
- AWS S3 Account (for video storage)

## Getting Started

### 1. Database & Backend
Run the database using Docker:
```bash
docker-compose up -d db
```
Update `appsettings.json` with your AWS credentials and connection string.
Run the API:
```bash
cd backend
dotnet run --project OttPlatform.API
```

### 2. Admin Panel
```bash
cd admin
npm install
npm run dev
```

### 3. Mobile App
```bash
cd mobile
flutter pub get
flutter run
```

## Deployment Guide
1. Configure AWS S3 Bucket with public access for HLS playback.
2. Deploy the Backend to AWS Elastic Beanstalk or Azure App Service.
3. Deploy the Admin Panel to Netlify or Vercel.
4. Publish the Flutter app to Google Play Store and Apple App Store.

## License
MIT
