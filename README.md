# AniKam

> **Your Ultimate Anime Library** - Discover, track, and organize your anime and manga collection with style.

## 🎯 Project Overview

AniKam is a modern, full-stack web application designed for anime and manga enthusiasts. It provides a comprehensive platform for discovering new content, tracking viewing/reading progress, and organizing personal collections. The application combines a sleek, responsive user interface with powerful search and filtering capabilities, making it easy for users to manage their anime and manga libraries.

Built with modern web technologies, the application offers both online functionality through the Jikan API (MyAnimeList's unofficial API) and offline capabilities with fallback data, ensuring users can always access their content.

## ✨ Key Features

### 🔍 **Discovery & Exploration**

- **Advanced Catalog Search**: Search through thousands of anime and manga titles with real-time filtering
- **Seasonal Anime**: Browse current season's trending and popular anime
- **Featured Content**: Curated selection of top-rated and trending titles
- **Detailed Information**: Comprehensive details including synopsis, ratings, genres, and streaming platforms

### 📚 **Personal Library Management**

- **Progress Tracking**: Track episodes watched and chapters read
- **Status Management**: Organize content by status (Watching, Completed, Planning, Paused)
- **Personal Ratings**: Rate and review your favorite titles
- **Library Statistics**: View detailed statistics about your collection

### 🎨 **Modern User Experience**

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Glass Morphism UI**: Modern, elegant interface with glass-like effects
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Progressive Web App**: Fast loading with offline capabilities

### 🔧 **Advanced Functionality**

- **Real-time Search**: Instant search results with debounced queries
- **Infinite Scrolling**: Seamless content loading for large catalogs
- **Offline Support**: Fallback data ensures functionality without internet
- **Network Status**: Real-time network connectivity notifications

## 🏗️ Design & Architecture

### **Frontend Architecture**

- **Component-Based Design**: Modular React components with clear separation of concerns
- **Custom Hooks**: Reusable logic for data fetching, search, and state management
- **Type Safety**: Full TypeScript implementation for robust development
- **Responsive Layout**: Mobile-first design with Tailwind CSS utilities

### **Backend Architecture**

- **RESTful API**: Express.js server with clean endpoint structure
- **Serverless Ready**: Netlify Functions integration for scalable deployment
- **Environment Configuration**: Secure environment variable management
- **CORS Enabled**: Cross-origin resource sharing for API access

### **Data Management**

- **External API Integration**: Jikan API for comprehensive anime/manga data
- **Local Storage**: Client-side persistence for user preferences and library
- **Fallback System**: Graceful degradation when external APIs are unavailable
- **Data Adaptation**: Consistent data models across different API sources

## 🛠️ Technology Stack

### **Frontend Technologies**

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **React Router 6** - Client-side routing with SPA mode
- **Tailwind CSS 3** - Utility-first CSS framework for rapid styling

### **UI/Component Libraries**

- **Radix UI** - Unstyled, accessible UI primitives:
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog
  - Dropdown Menu, Navigation Menu, Popover, Progress
  - Radio Group, Select, Slider, Tabs, Toast, Tooltip
- **Lucide React** - Beautiful, customizable SVG icons
- **Framer Motion** - Production-ready motion library for animations
- **Class Variance Authority** - Type-safe component variants
- **Tailwind Merge** - Utility for merging Tailwind CSS classes

### **Backend Technologies**

- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, minimalist web framework
- **CORS** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management
- **Serverless HTTP** - Adapter for serverless deployment

### **Development Tools**

- **Vitest** - Fast unit testing framework
- **PostCSS** - CSS processing with Autoprefixer
- **ESBuild** - Fast JavaScript bundler (via Vite)
- **SWC** - Fast TypeScript/JavaScript compiler

### **Build & Deployment**

- **Netlify** - Modern web deployment platform
- **Netlify Functions** - Serverless function deployment
- **Vite Build** - Optimized production builds
- **TypeScript Compiler** - Type checking and compilation

### **External APIs & Services**

- **Jikan API** - Unofficial MyAnimeList API for anime/manga data
- **React Three Fiber** - 3D graphics capabilities (for future enhancements)
- **Simple Parallax JS** - Smooth parallax scrolling effects

### **State Management & Data**

- **React Query (TanStack Query)** - Server state management and caching
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Local Storage API** - Client-side data persistence

## 👥 Target Audience

### **Primary Users**

- **Anime & Manga Enthusiasts**: Fans looking to organize and track their viewing/reading progress
- **Casual Viewers**: Users who want to discover new content and keep simple watch lists
- **Content Collectors**: People who enjoy maintaining detailed libraries and statistics

### **Use Cases**

- **Personal Organization**: Track what you've watched, what you're currently watching, and what you plan to watch
- **Discovery**: Find new anime and manga based on genres, ratings, and recommendations
- **Progress Management**: Keep track of episodes watched and chapters read
- **Social Sharing**: Maintain a profile of your anime/manga preferences and ratings

### **Problems Solved**

- **Content Overload**: Helps users navigate the vast world of anime and manga
- **Progress Tracking**: Eliminates the need to remember where you left off
- **Discovery**: Makes it easy to find new content based on preferences
- **Organization**: Provides a centralized place to manage your entire collection
- **Accessibility**: Works across all devices with offline capabilities

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

The application will be available at `http://localhost:8080`

---

**Built with ❤️ for the anime and manga community**
