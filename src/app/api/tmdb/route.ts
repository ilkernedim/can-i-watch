import { NextResponse } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint missing' }, { status: 400 });
  }

  const queryParams = new URLSearchParams(searchParams);
  queryParams.delete('endpoint');
  
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
  const url = `${TMDB_BASE_URL}/${endpoint}?api_key=${apiKey}&${queryParams.toString()}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}