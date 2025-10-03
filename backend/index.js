import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:8081'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check endpoint
app.get('/', (c) => {
  return c.json({ 
    message: 'Dream Visualizer API', 
    status: 'running',
    version: '1.0.0'
  });
});

// Dream submission endpoint
app.post('/api/dreams/submit', async (c) => {
  try {
    const body = await c.req.json();
    const { dreamText, style, userId } = body;

    if (!dreamText || !style) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // TODO: Save to database
    const dreamId = Date.now().toString();
    
    return c.json({
      success: true,
      dreamId,
      message: 'Dream submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting dream:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// FAL API integration for image generation
app.post('/api/visualize/generate', async (c) => {
  try {
    const body = await c.req.json();
    const { dreamText, style } = body;

    if (!dreamText || !style) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // TODO: Integrate with FAL API
    // For now, return a mock response
    const mockImageUrl = `https://picsum.photos/400/600?random=${Date.now()}`;
    
    return c.json({
      success: true,
      imageUrl: mockImageUrl,
      style,
      processingTime: Math.floor(Math.random() * 3000) + 1000
    });
  } catch (error) {
    console.error('Error generating visualization:', error);
    return c.json({ error: 'Failed to generate visualization' }, 500);
  }
});

// AI comment generation
app.post('/api/dreams/analyze', async (c) => {
  try {
    const body = await c.req.json();
    const { dreamText, imageUrl } = body;

    if (!dreamText) {
      return c.json({ error: 'Missing dream text' }, 400);
    }

    // TODO: Integrate with OpenAI or similar AI service
    const mockComments = [
      "Your dream reveals a deep connection with nature and freedom. The flying symbolizes your desire to break free from limitations.",
      "This dream suggests you're seeking adventure and new experiences. The magical elements indicate creativity and imagination.",
      "The forest in your dream represents growth and transformation. You may be going through a period of personal development.",
      "Your dream shows a strong spiritual connection. The glowing elements suggest inner wisdom and enlightenment.",
      "This visualization reflects your subconscious desire for peace and harmony. The colors indicate emotional balance."
    ];
    
    const randomComment = mockComments[Math.floor(Math.random() * mockComments.length)];
    
    return c.json({
      success: true,
      analysis: randomComment,
      confidence: Math.floor(Math.random() * 30) + 70 // 70-100%
    });
  } catch (error) {
    console.error('Error analyzing dream:', error);
    return c.json({ error: 'Failed to analyze dream' }, 500);
  }
});

// Get user's favorites
app.get('/api/favorites/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // TODO: Fetch from database
    const mockFavorites = [
      {
        id: '1',
        dreamText: 'I was flying over a magical forest...',
        style: 'realistic',
        imageUrl: 'https://picsum.photos/400/600?random=1',
        createdAt: new Date().toISOString()
      }
    ];
    
    return c.json({
      success: true,
      favorites: mockFavorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return c.json({ error: 'Failed to fetch favorites' }, 500);
  }
});

// Share dream endpoint
app.post('/api/dreams/share', async (c) => {
  try {
    const body = await c.req.json();
    const { dreamId, platform } = body;

    if (!dreamId) {
      return c.json({ error: 'Missing dream ID' }, 400);
    }

    // TODO: Implement sharing logic
    return c.json({
      success: true,
      shareUrl: `https://dreamvisualizer.app/share/${dreamId}`,
      message: 'Dream shared successfully'
    });
  } catch (error) {
    console.error('Error sharing dream:', error);
    return c.json({ error: 'Failed to share dream' }, 500);
  }
});

// Error handling middleware
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

const port = process.env.PORT || 3001;

console.log(`🚀 Dream Visualizer API starting on port ${port}`);

serve({
  fetch: app.fetch,
  port: port,
});

export default app;