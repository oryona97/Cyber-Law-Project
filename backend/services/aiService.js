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
