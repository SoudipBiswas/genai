import { Router, Request, Response } from 'express';
import geminiService from '../services/gemini.service.js';
import type { AnalyzeCodeRequest, AnalyzeCodeResponse, ErrorResponse } from '../types/index.js';

const router = Router();

/**
 * POST /api/analyze
 * Analyze code changes and detect assumption shifts
 */
router.post('/analyze', async (req: Request<{}, {}, AnalyzeCodeRequest>, res: Response<AnalyzeCodeResponse | ErrorResponse>) => {
  try {
    const { oldCode, newCode, mode } = req.body;

    // Validation
    if (!newCode || typeof newCode !== 'string' || newCode.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'newCode is required and must be a non-empty string',
      });
      return;
    }

    if (mode === 'compare' && (!oldCode || typeof oldCode !== 'string' || oldCode.trim().length === 0)) {
      res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'oldCode is required when mode is "compare"',
      });
      return;
    }

    if (!mode || !['compare', 'single'].includes(mode)) {
      res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'mode must be either "compare" or "single"',
      });
      return;
    }

    // Analyze with Gemini
    console.log(`[API] Analyzing code in ${mode} mode...`);
    const analysis = await geminiService.analyzeCodeChanges(oldCode, newCode, mode);

    res.status(200).json({
      success: true,
      results: analysis.results,
      stats: analysis.stats,
    });
  } catch (error) {
    console.error('[API] Analysis error:', error);

    const errAny = error as any;

    // If the service detected a revoked/leaked API key, return a clear client-facing message
    if (errAny && (errAny.code === 'GEMINI_API_KEY_REVOKED' || errAny.statusCode === 401)) {
      res.status(401).json({
        success: false,
        error: 'GEMINI_API_KEY_REVOKED',
        message: errAny instanceof Error ? errAny.message : 'Gemini API key appears revoked or leaked. Replace GEMINI_API_KEY in server/.env with a valid key.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'ANALYSIS_FAILED',
      message: error instanceof Error ? error.message : 'An unexpected error occurred during analysis',
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AssumptionLens API',
  });
});

export default router;
