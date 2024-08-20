import cache from 'memory-cache';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET(request: Request) {
  const cachedData = cache.get('tokenData');

  if (cachedData) {
    return new Response(JSON.stringify(cachedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const [cosmosResponse, terraResponse] = await Promise.all([
      fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=cosmos-ecosystem&per_page=250',
      ),
      fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=terra-ecosystem&per_page=250',
      ),
    ]);

    const [cosmosData, terraData] = await Promise.all([
      cosmosResponse.json(),
      terraResponse.json(),
    ]);

    const combinedData = [...cosmosData, ...terraData];
    const tokenInfos = combinedData.reduce((acc: any, token: any) => {
      acc[token.id.toLowerCase()] = {
        price: token.current_price,
        image: token.image,
      };
      return acc;
    }, {});
    cache.put('tokenData', tokenInfos, CACHE_DURATION);

    return new Response(JSON.stringify(tokenInfos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
