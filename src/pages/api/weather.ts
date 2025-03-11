import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // You'll need to sign up for a free API key at weatherapi.com
    const API_KEY = process.env.WEATHER_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Weather API key not configured');
    }

    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=auto:ip`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Weather API error:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch weather data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 