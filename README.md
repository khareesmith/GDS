# Go Develop Something (GDS)

A modern web application that generates customized project briefs based on user preferences, programming language, and difficulty level. The application uses OpenAI's GPT to create detailed, contextual project specifications while incorporating current trends.

## Project Structure

```
go-develop-something/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── core/          # Core configuration
│   │   └── services/      # Business logic
│   ├── requirements.txt
│   └── .env
└── frontend/              # React frontend
    ├── src/
    │   ├── components/    # React components
    │   │   ├── BriefGenerator/     # Main form component
    │   │   ├── BriefDisplay/       # Brief display component
    │   │   └── DifficultySelector/ # Difficulty selection cards
    │   ├── services/      # API services
    │   └── styles/        # Global styles
    └── package.json
```

## Prerequisites

- Python 3.11 or higher
- Node.js 16.x or higher
- npm 8.x or higher
- OpenAI API key

## Setup Instructions

### Backend Setup

1. Create and activate a virtual environment:
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory with the following contents:
```env
ENVIRONMENT=development
API_V1_STR=/api/v1
OPENAI_API_KEY=your_openai_api_key_here
MODEL_VERSION=gpt-4o
MODEL_TEMP=0.5
CORS_ORIGINS=http://localhost:5173
```

4. Start the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## Features

- Dynamic project brief generation based on:
  - Difficulty level (1-10) with intuitive card-based selection
  - Programming language with autocomplete suggestions
  - Project type
  - Current trends (optional)
- Modern, responsive UI built with:
  - React + Vite
  - Tailwind CSS
  - shadcn/ui components
- Interactive components:
  - Card-based difficulty selector with live level adjustment
  - Language autocomplete with popular suggestions
  - Dynamic project type options based on difficulty
- Brief display features:
  - Markdown rendering
  - Copy to clipboard
  - Download as markdown
  - Share functionality
- Local storage for saving generated briefs
- Real-time form validation

## API Documentation

The backend API documentation is available at `http://localhost:8000/docs` when the server is running.

### Key Endpoints

- `POST /api/v1/brief`: Generate a new project brief
- `GET /api/v1/project-types/{difficulty}`: Get available project types for a difficulty level

## Environment Variables

### Backend (.env)
- `ENVIRONMENT`: Application environment (development/production)
- `API_V1_STR`: API version prefix
- `OPENAI_API_KEY`: Your OpenAI API key
- `MODEL_VERSION`: OpenAI model version to use
- `MODEL_TEMP`: Temperature setting for GPT model
- `CORS_ORIGINS`: Allowed CORS origins

### Frontend (.env)
- `VITE_API_URL`: Backend API URL

## Development

### Backend
- Built with FastAPI
- Uses pydantic for data validation
- OpenAI integration for brief generation
- CORS middleware enabled for frontend communication

### Frontend
- Built with React + Vite
- Uses Tailwind CSS for styling
- shadcn/ui components
- Markdown rendering support
- Component architecture:
  - `BriefGenerator`: Main form component with difficulty selection
  - `DifficultySelector`: Card-based difficulty level selection
  - `BriefDisplay`: Renders generated briefs with actions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
