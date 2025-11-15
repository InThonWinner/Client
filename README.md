# KUnnect - React Application

A React application for portfolio management and experience data-based chatbot service, built with Vite and React Router.

## Features

- **Landing Page**: Beautiful gradient design with call-to-action
- **Portfolio Page**: Interactive portfolio editor with collapsible sections
- **React Router**: Seamless navigation between pages
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure images are in the `public/images/` folder:
   - logo.png
   - emblem.png
   - profile.png
   - image2.png

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── public/
│   └── images/              # Static images (logo, profile, emblem, etc.)
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx      # Landing page component
│   │   ├── LandingPage.css
│   │   ├── PortfolioPage.jsx    # Portfolio view page
│   │   ├── PortfolioPage.css
│   │   ├── PortfolioEditPage.jsx # Portfolio edit page
│   │   ├── PortfolioEditPage.css
│   │   ├── SignupPage.jsx        # Signup page
│   │   ├── SignupPage.css
│   │   ├── LoginPage.jsx         # Login page
│   │   ├── LoginPage.css
│   │   ├── ChatbotPage.jsx       # Chatbot page
│   │   ├── ChatbotPage.css
│   │   ├── FeedPage.jsx          # Feed page
│   │   ├── FeedPage.css
│   │   └── index.js              # Component exports
│   ├── App.jsx              # Main app component with routing
│   ├── App.css
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Routes

- `/` - Landing page
- `/portfolio` - Portfolio view page
- `/portfolio/edit` - Portfolio edit page
- `/signup` - Signup page
- `/login` - Login page
- `/chatbot` - Chatbot page
- `/feed` - Feed page

## Technologies Used

- React 18
- React Router DOM 6
- Vite
- CSS3

## Development

The app uses:
- **Vite** for fast development and building
- **React Router** for client-side routing
- **React Hooks** for state management
- **CSS Modules** for component styling

