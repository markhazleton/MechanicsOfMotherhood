# RecipeSpark Recipe Management Platform

## Overview

RecipeSpark is a full-stack recipe management web application designed for working mothers, branded as "MoM - Mechanics of Motherhood". It features a modern industrial design theme and provides comprehensive recipe management capabilities along with blog functionality. The application is built with React frontend and Express backend with dual API compatibility - supporting both the full RecipeSpark API specification and legacy MoM frontend compatibility.

## Recent Achievement (August 11, 2025)

Successfully implemented RecipeSpark API specification compatibility while maintaining full backward compatibility with the existing MoM frontend. The application now provides:

- **Full RecipeSpark API Compliance**: Complete implementation of the RecipeSpark API specification with proper response formats, pagination, and error handling
- **Dual-Mode Backend**: Single backend serving both RecipeSpark API (`/api/recipespark`) and legacy MoM API (`/api`) endpoints
- **Schema Transformation**: Automatic transformation between RecipeSpark schema format and legacy MoM format
- **API Documentation**: Built-in API documentation endpoint (`/api/docs`) showing both API formats and examples
- **Seamless Migration Path**: Existing MoM frontend continues to work while new RecipeSpark-compatible applications can integrate immediately

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Build Tool**: Vite for fast development builds and hot module replacement
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system featuring industrial/mechanical theme colors

### Backend Architecture
- **Runtime**: Node.js with TypeScript and ESM modules
- **Framework**: Express.js providing RESTful API endpoints
- **Development Server**: Custom Vite integration for unified development experience
- **Request Logging**: Custom middleware for API request/response logging
- **Error Handling**: Centralized error handling middleware
- **API Compatibility**: Dual-mode API supporting both RecipeSpark specification and legacy MoM format

### Data Management
- **Storage**: In-memory storage with RecipeSpark-compatible schema
- **Schema**: Shared schema definitions between client and server using Zod for validation
- **Data Format**: Full RecipeSpark API specification compliance with backward compatibility
- **Migration Support**: Ready for database integration when needed

### API Structure
- **RecipeSpark API (`/api/recipespark`)**: Full RecipeSpark specification compliance
  - Recipes: Complete CRUD operations with RecipeSpark format
  - Categories: Category management with display order and status
  - Response Format: Standard RecipeSpark format with data, success, message, pagination
- **Legacy API (`/api`)**: Backward compatibility for existing MoM frontend
  - Recipes: Legacy format transformation from RecipeSpark data
  - Categories: Legacy format support
  - Search: Full-text search across recipes
  - Stats: Dashboard statistics and analytics

### Development Tools
- **TypeScript**: Strict type checking across the entire codebase
- **Path Mapping**: Organized import aliases for clean code structure
- **Hot Reload**: Development server with automatic reload on changes
- **Code Quality**: ESLint and Prettier for consistent code formatting

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Connect-pg-simple**: PostgreSQL session store for Express sessions

### UI and Styling
- **Radix UI**: Comprehensive set of accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration
- **Lucide React**: Modern icon library for consistent iconography
- **Class Variance Authority**: Utility for managing component variants
- **Date-fns**: Date manipulation and formatting library

### State and Forms
- **TanStack React Query**: Server state management, caching, and synchronization
- **React Hook Form**: Performant form handling with validation
- **Hookform Resolvers**: Integration between React Hook Form and schema validation

### Development Infrastructure
- **Vite**: Fast build tool with development server and HMR
- **Replit Integration**: Custom plugins for Replit development environment
- **TSX**: TypeScript execution for development scripts
- **ESBuild**: Fast JavaScript bundler for production builds

### Additional Libraries
- **Embla Carousel**: Touch-friendly carousel component
- **CMDK**: Command palette and search interface
- **Wouter**: Minimalist routing library for React applications
- **Nanoid**: Secure URL-friendly unique string ID generator