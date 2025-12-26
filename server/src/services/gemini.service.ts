import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';
import type { AssumptionChange, AnalysisStats } from '../types/index.js';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    // Using Gemini 1.5 Flash for faster responses
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
      const prompt = this.buildPrompt(oldCode, newCode, mode);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response from Gemini
      const analysis = this.parseGeminiResponse(text);
      
      return analysis;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to analyze code with Gemini API');
    }
  }

  /**
   * Build the prompt for Gemini API
   */
  private buildPrompt(oldCode: string | undefined, newCode: string, mode: 'compare' | 'single'): string {
    if (mode === 'compare' && oldCode) {
      return `You are an expert code analyst specializing in detecting assumption changes. Analyze the following code changes and identify how the ASSUMPTIONS have shifted.

DO NOT just list line-by-line differences. Focus on:
- API cost implications (loops, API calls, data volume changes)
- Performance impacts (algorithm complexity, data structure changes)
- Security assumptions (auth, authorization, data handling)
- Architecture shifts (state management, component patterns)
- Behavioral changes (error handling, edge cases)

OLD CODE:
\`\`\`
${oldCode}
\`\`\`

NEW CODE:
\`\`\`
${newCode}
\`\`\`

Return your analysis as a JSON object with this exact structure:
{
  "results": [
    {
      "id": "unique-id",
      "type": "critical" | "warning" | "info" | "success",
      "category": "API Cost" | "Performance" | "Security" | "Architecture" | "Efficiency",
      "title": "Brief descriptive title",
      "description": "What changed and why it matters",
      "oldAssumption": "What was assumed before",
      "newAssumption": "What is assumed now",
      "impact": "Concrete impact description",
      "recommendation": "Optional: How to improve or mitigate"
    }
  ],
  "stats": {
    "totalChanges": number,
    "criticalCount": number,
    "warningCount": number,
    "estimatedCostImpact": "e.g., +$50/mo or N/A",
    "performanceImpact": "e.g., -20% or N/A"
  }
}

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no explanations outside the JSON.`;
    } else {
      return `You are an expert code analyst. Analyze the following code and infer potential assumptions that might lead to issues.

Focus on:
- Potential API cost risks
- Performance bottlenecks
- Security vulnerabilities
- Architectural concerns
- Best practice violations

CODE:
\`\`\`
${newCode}
\`\`\`

Return your analysis as a JSON object with this exact structure:
{
  "results": [
    {
      "id": "unique-id",
      "type": "critical" | "warning" | "info" | "success",
      "category": "API Cost" | "Performance" | "Security" | "Architecture" | "Efficiency",
      "title": "Brief descriptive title",
      "description": "What the issue or observation is",
      "oldAssumption": "Inferred previous or ideal assumption",
      "newAssumption": "Current assumption in this code",
      "impact": "Potential impact",
      "recommendation": "Optional: How to improve"
    }
  ],
  "stats": {
    "totalChanges": number,
    "criticalCount": number,
    "warningCount": number,
    "estimatedCostImpact": "e.g., N/A",
    "performanceImpact": "e.g., N/A"
  }
}

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no explanations outside the JSON.`;
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
