import type { SearchParams, Source } from '@/types';

export class SearchModule {
  async search(params: {
    queries: string[];
    searchType: string;
    topK: number;
    alpha?: number;
  }): Promise<{
    results: Source[];
    total_found: number;
  }> {
    try {
      console.log('[SearchModule] Rozpoczynam zapytanie:', {
        queries: params.queries,
        search_type: params.searchType,
        top_k: params.topK,
        alpha: params.alpha
      });

      const response = await fetch('http://127.0.0.1:8000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queries: params.queries,
          search_type: params.searchType,
          top_k: params.topK,
          alpha: params.alpha
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Backend error: ${response.status} ${errorData.detail || ''}`);
      }

      const data = await response.json();
      console.log('[SearchModule] Otrzymane wyniki:', {
        count: data.results?.length || 0,
        total: data.total || 0
      });

      return {
        results: data.results || [],
        total_found: data.total || 0
      };

    } catch (error) {
      console.error('[SearchModule] Błąd:', error);
      throw error; // Przekazujemy błąd wyżej, żeby mógł być obsłużony przez route.ts
    }
  }
}
