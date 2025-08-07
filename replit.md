# Byda o.1 - Next-Generation AI Assistant

## Overview

Byda o.1 is a professional AI assistant platform that goes beyond traditional AI capabilities. Built with React, Express, and TypeScript, it provides a multi-AI system that can handle coding, web development, automation, app development, data analytics, music generation, and deep search with advanced problem-solving abilities. The system features self-improvement capabilities, automatic error detection and correction, and deep analytical thinking across all domains.

## User Preferences

Preferred communication style: Simple, everyday language.

## Current Issues to Resolve

**Message Display Issue (Priority: High)**
- Backend API is working correctly - messages are being created and stored
- Demo AI responses are generating properly 
- Frontend React Query is fetching messages successfully (confirmed in logs)
- Issue: Messages not rendering in UI despite being loaded
- Root cause: React state management or component rendering issue
- Next steps: Debug React component lifecycle and message rendering logic

**UI Improvements Completed**
- ✅ Removed annoying welcome banner from chat interface
- ✅ Fixed conversation creation flow
- ✅ Demo mode working with realistic AI responses

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with dark theme support and CSS custom properties

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Data Storage**: Currently using in-memory storage (MemStorage) with plans for PostgreSQL via Drizzle ORM
- **API Design**: RESTful API with endpoints for conversations and messages
- **Development**: Hot module replacement via Vite integration in development mode

### Database Schema Design
The application uses Drizzle ORM with PostgreSQL-compatible schema:
- **Users**: Basic user management with username/password authentication
- **Conversations**: Chat sessions linked to users with capability-specific contexts
- **Messages**: Individual chat messages with role-based structure (user/assistant) and metadata support

### AI Integration Architecture
- **Multi-Provider Support**: Integrated with both OpenAI (GPT-4o) and Anthropic (Claude Sonnet 4) APIs
- **Capability-Based Routing**: Different AI capabilities route to appropriate models and prompts
- **Service Layer**: Centralized AI service handles model selection and response processing

### Authentication & Authorization
- Currently implements basic session-based architecture
- User management through database schema with encrypted password storage
- Session handling via connect-pg-simple for PostgreSQL session store

### Component Architecture
- **Modular Design**: Reusable UI components following atomic design principles
- **Feature-Based Organization**: Components organized by functionality (chat, sidebar, messages)
- **Responsive Design**: Mobile-first approach with responsive breakpoints and mobile sidebar

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for general AI capabilities
- **Anthropic API**: Claude Sonnet 4 model for advanced reasoning tasks

### Database & Storage
- **Neon Database**: Serverless PostgreSQL database for production
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **In-Memory Storage**: Fallback storage implementation for development

### UI & Styling
- **Radix UI**: Headless UI components for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool with HMR and TypeScript support
- **ESBuild**: Fast JavaScript bundler for production builds
- **TanStack Query**: Data fetching and caching library
- **React Hook Form**: Form handling with validation support

### Third-Party Integrations
- **Replit Integration**: Development environment support with cartographer plugin
- **Session Management**: PostgreSQL-based session storage for user authentication
- **Font Awesome**: Icon library for AI capability indicators