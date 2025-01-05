import { NextResponse } from 'next/server';
import { SearchModule } from '@/lib/search_module';
import type { SearchParams } from '@/types';
import cors from '@/lib/cors';

const searchModule = new SearchModule();

export async function POST(req: Request) {
  const corsResponse = cors(req);
  if (corsResponse) return corsResponse;

  try {
    const { query, search_type = 'semantic', top_k = 5, alpha = 0.5, queryMode = 'last' } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const queries = queryMode === 'all'
      ? [...(req.body.history || []), query]
      : [query];

    const searchParams: SearchParams = {
      queries,
      search_type,
      top_k,
      alpha: search_type === 'hybrid' ? alpha : undefined
    };

    const results = await searchModule.search(searchParams);

    const response = NextResponse.json({
      results: results.results,
      total: results.total_found
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(req: Request) {
  return cors(req);
}
