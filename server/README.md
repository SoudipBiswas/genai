# AssumptionLens Backend

Backend server for AssumptionLens - AI-powered code assumption change detector using Google Gemini AI.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **AI**: Google Gemini API (gemini-1.5-flash)
- **Environment**: dotenv for configuration

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Edit `server/.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Get your Gemini API key**: https://aistudio.google.com/app/apikey

### 3. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### POST /api/analyze

Analyze code changes and detect assumption shifts.

**Request Body:**
```json
{
  "oldCode": "previous code version (optional for single mode)",
  "newCode": "current code version",
  "mode": "compare" | "single"
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "unique-id",
      "type": "critical" | "warning" | "info" | "success",
      "category": "API Cost" | "Performance" | "Security" | ...,
      "title": "Change title",
      "description": "What changed",
      "oldAssumption": "Previous assumption",
      "newAssumption": "New assumption",
      "impact": "Impact description",
      "recommendation": "Optional recommendation"
    }
  ],
  "stats": {
    "totalChanges": 4,
    "criticalCount": 1,
    "warningCount": 2,
    "estimatedCostImpact": "+$50/mo",
    "performanceImpact": "-15%"
  }
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-26T...",
  "service": "AssumptionLens API"
}
```

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration and env loader
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic (Gemini service)
│   ├── types/           # TypeScript type definitions
│   └── index.ts         # Server entry point
├── .env                 # Environment variables (DO NOT COMMIT)
├── package.json
└── tsconfig.json
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run clean` - Remove build artifacts

## Error Handling

The API returns structured errors:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

Common error codes:
- `INVALID_INPUT` - Missing or invalid request parameters
- `ANALYSIS_FAILED` - Gemini API error or parsing failure
- `INTERNAL_SERVER_ERROR` - Unexpected server error
