const API_BASE_URL = 'http://localhost:3001/api';

class DreamVisualizerAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Submit dream for visualization
  async submitDream(dreamData) {
    return this.request('/dreams/submit', {
      method: 'POST',
      body: JSON.stringify(dreamData),
    });
  }

  // Generate visualization using FAL API
  async generateVisualization(dreamText, style) {
    return this.request('/visualize/generate', {
      method: 'POST',
      body: JSON.stringify({ dreamText, style }),
    });
  }

  // Get AI analysis of dream
  async analyzeDream(dreamText, imageUrl) {
    return this.request('/dreams/analyze', {
      method: 'POST',
      body: JSON.stringify({ dreamText, imageUrl }),
    });
  }

  // Get user favorites
  async getFavorites(userId) {
    return this.request(`/favorites/${userId}`);
  }

  // Share dream
  async shareDream(dreamId, platform = 'general') {
    return this.request('/dreams/share', {
      method: 'POST',
      body: JSON.stringify({ dreamId, platform }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/');
  }
}

export default new DreamVisualizerAPI();
