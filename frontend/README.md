# Recruiting Tool Frontend

A modern React TypeScript frontend for the AI-powered recruiting tool.

## Features

- **CV Upload & Processing**: Upload PDF resumes with AI-powered data extraction
- **User Profiles**: Comprehensive candidate profiles with personality assessment
- **AI Question Generation**: Generate interview questions based on CV analysis
- **Dashboard**: Admin view for managing all candidates
- **Job Management**: Create and manage job postings
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## Tech Stack

- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **Axios** for API communication
- **React Hook Form** for form handling
- **React Dropzone** for file uploads

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   └── Navbar.tsx      # Navigation component
├── pages/              # Page components
│   ├── HomePage.tsx    # CV upload and initial setup
│   ├── ProfilePage.tsx # Individual user profiles
│   ├── DashboardPage.tsx # Admin dashboard
│   └── JobsPage.tsx    # Job management
├── lib/                # Utilities and API client
│   ├── api.ts          # API client functions
│   └── utils.ts        # Utility functions
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── App.tsx             # Main application component
```

## API Integration

The frontend connects to the FastAPI backend at `/api/v1`. Key API endpoints:

- `POST /user` - Create user profiles
- `GET /user/{id}` - Get user details
- `POST /file` - Upload CV files
- `GET /user/{id}/question` - Generate AI questions
- `POST /user/{id}/question` - Submit answers

## Features Overview

### Home Page
- Drag & drop CV upload
- AI-powered data extraction
- Profile creation

### Profile Page
- Personal information display
- Personality trait visualization
- AI question generation and answering
- CV download functionality

### Dashboard
- Overview statistics
- All candidates list
- Quick actions (view profile, download CV)

### Jobs Page
- Job listing
- Create new job postings
- Job management

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint and TypeScript for code quality. Follow these conventions:

- Use TypeScript interfaces for type definitions
- Prefer functional components with hooks
- Use Tailwind CSS for styling
- Follow the established component structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is part of the recruiting tool system. 