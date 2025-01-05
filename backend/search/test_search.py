import asyncio
from search_module import SearchModule, SearchParams
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_omega3_search():
   try:
       search_module = SearchModule()
       test_queries = ["Jak omega-3 wpływa na poziom cholesterolu?"]
       search_types = ["semantic", "statistical", "hybrid"]

       for query in test_queries:
           logger.info(f"\n=== Testowanie zapytania: {query} ===")

           for search_type in search_types:
               logger.info(f"\n--- Metoda wyszukiwania: {search_type} ---")

               params = SearchParams(
                   queries=[query],
                   search_type=search_type,
                   top_k=5,
                   alpha=0.5 if search_type == 'hybrid' else None
               )

               result = await search_module.search(params)

               logger.info(f"Znaleziono {len(result.results)} wyników:")

               for idx, item in enumerate(result.results, 1):
                   logger.info(f"\nWynik {idx}:")
                   logger.info(f"PMID: {item.get('PMID', 'N/A')}")
                   distance = item.get('__nn_distance', 0)
                   similarity = 1 - distance
                   logger.info(f"Odległość: {distance:.4f}")
                   logger.info(f"Podobieństwo: {similarity:.4f}")
                   logger.info(f"Tytuł: {item.get('title', 'N/A')}")

           logger.info("\n" + "=" * 50)

   except Exception as e:
       logger.error(f"Błąd podczas testowania: {str(e)}")
       raise

if __name__ == "__main__":
   asyncio.run(test_omega3_search())
