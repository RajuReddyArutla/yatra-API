import { NextRequest, NextResponse } from 'next/server';
import { citySearchSchema } from '@/dtos/citySearch.dto';
import { searchHotelsByCity } from '@/services/hotel.service';
import { logger } from '@/utils/logger';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');

  const { error, value } = citySearchSchema.validate({ city, checkInDate, checkOutDate });
  if (error) {
    logger.error('❌ Validation failed', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  try {
    const data = await searchHotelsByCity(value);
    return NextResponse.json(data);
  } catch (err: any) {
    logger.error('❌ API Error', { message: err.message, stack: err.stack, response: err.response?.data });
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }  
}
