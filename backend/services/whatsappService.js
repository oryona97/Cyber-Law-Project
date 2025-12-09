const axios = require('axios');

class WhatsappService {
  constructor() {
    this.token = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.apiVersion = 'v17.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  /**
   * Send a text message to a WhatsApp user
   * @param {string} to - The recipient's phone number
   * @param {string} text - The message text
   */
  async sendMessage(to, text) {
    if (!this.token || !this.phoneNumberId) {
      console.error('WhatsApp credentials (WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID) are missing.');
      return;
    }

    try {
      await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          text: { body: text }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`Message sent to ${to}`);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response ? error.response.data : error.message);
    }
  }
}

module.exports = new WhatsappService();
