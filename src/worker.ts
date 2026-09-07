export interface Env {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404 && request.method === 'GET') {
        const url = new URL(request.url);
        url.pathname = '/index.html';
        return env.ASSETS.fetch(new Request(url.toString(), request));
      }
      return response;
    }
    return new Response("Not Found", { status: 404 });
  },
};
