const axios = require('axios');

class AIService {
  constructor() {
    this.baseUrl = process.env.OLLAMA_HOST || 'http://localhost:11434';
    this.model = 'llama3'; // Default model, can be changed
  }

  /**
   * Generate a response from the AI.
   * @param {string} prompt - The user's input or full prompt.
   * @param {string} systemPrompt - (Optional) The persona/expert configuration.
   * @returns {Promise<string>} - The AI's text response.
   */
  async generateResponse(prompt, systemPrompt = '') {
    try {
      const payload = {
        model: this.model,
        prompt: prompt,
        stream: false, // Set to true if you want to handle streaming responses
      };

      if (systemPrompt) {
        payload.system = systemPrompt;
      }

      const response = await axios.post(`${this.baseUrl}/api/generate`, payload);
      return response.data.response;
    } catch (error) {
      console.error('Error communicating with Ollama:', error.message);
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Generate a structured summary for a lead.
   * @param {string} conversationHistory 
   * @returns {Promise<Object>} { summary, urgency }
   */
  async generateLeadSummary(conversationHistory) {
    try {
      const systemPrompt = `You are a legal triage specialist.
      Analyze the conversation history.
      Return ONLY a JSON object with this format (no markdown, no extra text):
      {
        "summary": "Concise summary of the legal issue (max 2 sentences)",
        "urgency": "High" | "Medium" | "Low"
      }`;

      const payload = {
        model: this.model,
        prompt: `Conversation History:\n${conversationHistory}\n\nProvide the JSON summary.`,
        system: systemPrompt,
        stream: false,
        format: "json" // Request JSON format from Ollama if supported, otherwise the prompt helps.
      };

      const response = await axios.post(`${this.baseUrl}/api/generate`, payload);
      let content = response.data.response;

      try {
        // Clean up potential markdown code blocks
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
            content = content.substring(jsonStart, jsonEnd + 1);
            return JSON.parse(content);
        }
        return JSON.parse(content);
      } catch (parseError) {
        console.warn("AI returned non-JSON summary:", content);
        return { summary: content, urgency: "Medium" };
      }

    } catch (error) {
      console.error('Error generating summary:', error.message);
      return { summary: "Error generating summary.", urgency: "Medium" };
    }
  }

  /**
   * Ensure the model is pulled and available.
   * Useful to call on startup.
   */
  async ensureModelExists() {
    try {
      // Check if model exists (this is a simplified check, typically you'd list models)
      // For now, we'll just try to pull it to be safe.
      console.log(`Checking/Pulling model: ${this.model}...`);
      await axios.post(`${this.baseUrl}/api/pull`, { name: this.model });
      console.log(`Model ${this.model} is ready.`);
    } catch (error) {
      console.error(`Error pulling model ${this.model}:`, error.message);
    }
  }
}

module.exports = new AIService();
