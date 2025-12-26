import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';
import type { AssumptionChange, AnalysisStats } from '../types/index.js';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    // Prefer Gemini 2.5 Flash as requested; fallback handled at runtime if unavailable
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  /**
   * Analyze code changes and detect assumption shifts
   */
  async analyzeCodeChanges(
    oldCode: string | undefined,
    newCode: string,
    mode: 'compare' | 'single'
  ): Promise<{ results: AssumptionChange[]; stats: AnalysisStats }> {
    try {
      console.log(`[Gemini] Starting analysis in ${mode} mode...`);
      const prompt = this.buildPrompt(oldCode, newCode, mode);
      
      console.log('[Gemini] Calling Gemini API with streaming...');
      const result = await this.model.generateContentStream(prompt);
      
      // Collect streamed chunks
      let fullText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
      }

      console.log('[Gemini] Received complete response, parsing...');
      console.log('[Gemini] Response preview:', fullText.substring(0, 200));
      
      // Parse the JSON response from Gemini
      const analysis = this.parseGeminiResponse(fullText);
      
      console.log(`[Gemini] Analysis complete: ${analysis.results.length} changes detected`);
      return analysis;
    } catch (error) {
      console.error('[Gemini] API Error Details:', error);
      if (error instanceof Error) {
        console.error('[Gemini] Error message:', error.message);
        console.error('[Gemini] Error stack:', error.stack);
      }
      throw new Error('Failed to analyze code with Gemini API: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Build the prompt for Gemini API
   */
  private buildPrompt(oldCode: string | undefined, newCode: string, mode: 'compare' | 'single'): string {
    if (mode === 'compare' && oldCode) {
      return `You are a constructive code analyst. Analyze these code changes and identify meaningful assumption shifts.

Be BALANCED and CONSTRUCTIVE:
✅ Use type="success" for improvements (better performance, security, maintainability)
⚠️ Use type="warning" for potential concerns that may need attention
🔴 Use type="critical" ONLY for serious issues (security risks, major cost increases)
ℹ️ Use type="info" for neutral architectural changes

Focus on:
- Performance improvements OR concerns (algorithm changes, data structures)
- API efficiency changes (batching, caching, request patterns)
- Security enhancements OR risks
- Code maintainability and architecture quality
- Developer experience improvements

OLD CODE:
\`\`\`
${oldCode}
\`\`\`

NEW CODE:
\`\`\`
${newCode}
\`\`\`

Return a JSON object. CELEBRATE improvements with type="success". Be specific and actionable:
{
  "results": [
    {
      "id": "unique-id",
      "type": "critical" | "warning" | "info" | "success",
      "category": "Performance" | "API Cost" | "Security" | "Architecture" | "Efficiency" | "Maintainability",
      "title": "Clear, specific title",
      "description": "What changed and its significance",
      "oldAssumption": "Previous approach",
      "newAssumption": "New approach",
      "impact": "Concrete, measurable impact (positive or negative)",
      "recommendation": "How to optimize further (even for improvements)",
      "reasoning": "Technical explanation of the detected change"
    }
  ],
  "stats": {
    "totalChanges": number,
    "criticalCount": number,
    "warningCount": number,
    "estimatedCostImpact": "+$50/mo, -$20/mo, or N/A",
    "performanceImpact": "+25% faster, -15% slower, or N/A"
  }
}

IMPORTANT: Return ONLY valid JSON, no markdown. Balance positive and negative findings.`;
    } else {
      return `You are a constructive code analyst. Review this code for strengths and improvement opportunities.

Be BALANCED:
✅ Highlight what's done well (type="success")
💡 Suggest optimizations constructively (type="info")
⚠️ Flag potential concerns (type="warning")
🔴 Only use type="critical" for serious risks

Analyze:
- Code quality and best practices
- Performance patterns
- Security considerations
- Maintainability and readability
- Potential optimizations

CODE:
\`\`\`
${newCode}
\`\`\`

Return a balanced JSON analysis celebrating good patterns and suggesting improvements:
{
  "results": [
    {
      "id": "unique-id",
      "type": "critical" | "warning" | "info" | "success",
      "category": "Performance" | "Security" | "Architecture" | "Best Practices" | "Maintainability",
      "title": "Clear observation",
      "description": "What you observed",
      "oldAssumption": "Common alternative approach",
      "newAssumption": "Current implementation",
      "impact": "Practical implications",
      "recommendation": "Actionable next step",
      "reasoning": "Why this matters"
    }
  ],
  "stats": {
    "totalChanges": number,
    "criticalCount": number,
    "warningCount": number,
    "estimatedCostImpact": "N/A for single analysis",
    "performanceImpact": "N/A for single analysis"
  }
}

IMPORTANT: Return ONLY JSON. Find at least one positive aspect if code quality is decent.`;
    }
  }

  /**
   * Parse Gemini's response and extract JSON
   */
  private parseGeminiResponse(text: string): { results: AssumptionChange[]; stats: AnalysisStats } {
    try {
      // Remove markdown code blocks if present
      let cleanText = text.trim();
      
      // Remove ```json and ``` if present
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }

      const parsed = JSON.parse(cleanText);
      
      // Validate structure
      if (!parsed.results || !Array.isArray(parsed.results)) {
        throw new Error('Invalid response structure: missing results array');
      }
      
      if (!parsed.stats) {
        throw new Error('Invalid response structure: missing stats');
      }

      return {
        results: parsed.results,
        stats: parsed.stats,
      };
    } catch (error) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error('Failed to parse AI response. The response was not valid JSON.');
    }
  }
}

export default new GeminiService();
