export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  console.log(pathname);
  if (pathname.endsWith('/settings')) {
    return new Response('Setting');
  }
  return new Response('Hello, Next.js!');
}
