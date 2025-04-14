import axios from 'axios';
import redis from '@/config/redis';
import { logger } from '@/utils/logger';

export const searchHotelsByCity = async (params: any) => {
  const cacheKey = `citySearch:${JSON.stringify(params)}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    logger.info('✅ Cache hit for City Search');
    return JSON.parse(cached);
  }

  logger.info('🔍 Calling Yatra API for City Search');

  try {
    // ✅ Format dates to yyyy-MM-dd
    const formattedParams = {
      ...params,
      checkInDate: params.checkInDate.split('T')[0],
      checkOutDate: params.checkOutDate.split('T')[0],
    };

    const response = await axios.get(process.env.YATRA_API_URL!, {
      params: formattedParams,
      headers: {
        'X-Api-Key': process.env.YATRA_API_KEY!,
        'Content-Type': 'application/json',
      },
    });

    await redis.setex(
      cacheKey,
      parseInt(process.env.CACHE_TTL || '300'),
      JSON.stringify(response.data)
    );

    return response.data;
  } catch (err: any) {
    logger.error('❌ Error fetching from Yatra API', {
      message: err.message,
      status: err.response?.status,
      response: err.response?.data,
      url: process.env.YATRA_API_URL,
      params,
    });
    throw err;
  }
};
