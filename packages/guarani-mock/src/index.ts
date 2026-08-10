// SIU-Guaraní mock REST API server
// Mimics real Guaraní WS endpoints at https://guarani.unc.edu.ar

import carrerasData from './fixtures/carreras.json' with { type: 'json' };
import historiaData from './fixtures/historia-academica.json' with { type: 'json' };
// Import fixtures
import padronData from './fixtures/padron-alumno.json' with { type: 'json' };

const PORT = Number(process.env.GUARANI_MOCK_PORT ?? '8090');

// Error simulation config
const ERROR_RATE = Number(process.env.GUARANI_MOCK_ERROR_RATE ?? '0');
const LATENCY_MIN = Number(process.env.GUARANI_MOCK_LATENCY_MIN ?? '0');
const LATENCY_MAX = Number(process.env.GUARANI_MOCK_LATENCY_MAX ?? '200');

function randomLatency(): number {
  return LATENCY_MIN + Math.floor(Math.random() * (LATENCY_MAX - LATENCY_MIN));
}

function shouldError(): boolean {
  return Math.random() < ERROR_RATE;
}

async function maybeDelayAndError(): Promise<void> {
  const delay = randomLatency();
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  if (shouldError()) {
    throw new Error('Simulated guarani server error');
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function notFound(): Response {
  return json({ error: 'recurso_no_encontrado', message: 'El recurso solicitado no existe' }, 404);
}

// Token auth middleware simulation
function checkAuth(request: Request): boolean {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) { return false; }
  const token = auth.slice(7);
  return token === (process.env.GUARANI_MOCK_TOKEN ?? 'mock-token');
}

const _server = Bun.serve({
  port: PORT,
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      await maybeDelayAndError();
    }
    catch {
      return json({ error: 'error_interno', message: 'Error interno del servidor' }, 500);
    }

    // GET /api/v1/padron — list all students
    if (path === '/api/v1/padron' && request.method === 'GET') {
      if (!checkAuth(request)) {
        return json({ error: 'token_invalido', message: 'Token de autenticacion invalido' }, 401);
      }
      return json(padronData);
    }

    // GET /api/v1/padron/:dni — get student by DNI
    const padronMatch = path.match(/^\/api\/v1\/padron\/(\d{2}\.\d{3}\.\d{3})$/);
    if (padronMatch && request.method === 'GET') {
      if (!checkAuth(request)) {
        return json({ error: 'token_invalido', message: 'Token de autenticacion invalido' }, 401);
      }
      const dni = padronMatch[1];
      const alumno = (padronData.alumnos as Array<{ dni: string }>).find(a => a.dni === dni);
      if (!alumno) { return notFound(); }
      return json({ alumno });
    }

    // GET /api/v1/historia-academica/:dni
    const historiaMatch = path.match(/^\/api\/v1\/historia-academica\//);
    if (historiaMatch && request.method === 'GET') {
      if (!checkAuth(request)) {
        return json({ error: 'token_invalido', message: 'Token de autenticacion invalido' }, 401);
      }
      return json(historiaData);
    }

    // GET /api/v1/carreras — course catalog
    if (path === '/api/v1/carreras' && request.method === 'GET') {
      if (!checkAuth(request)) {
        return json({ error: 'token_invalido', message: 'Token de autenticacion invalido' }, 401);
      }
      return json(carrerasData);
    }

    // GET /api/v1/mesas-examen/:carrera — exam dates
    const mesasMatch = path.match(/^\/api\/v1\/mesas-examen\/([A-Z0-9-]+)$/);
    if (mesasMatch && request.method === 'GET') {
      if (!checkAuth(request)) {
        return json({ error: 'token_invalido', message: 'Token de autenticacion invalido' }, 401);
      }
      return json({
        carrera: mesasMatch[1],
        mesas: [
          { fecha: '2026-03-15', materia: 'MAT-001', turno: 'manana' },
          { fecha: '2026-03-16', materia: 'PRO-001', turno: 'tarde' },
        ],
      });
    }

    // GET /health — health check (no auth)
    if (path === '/health' && request.method === 'GET') {
      return json({ status: 'ok', service: 'guarani-mock', version: '0.1.0' });
    }

    return notFound();
  },
});

console.log(`Guaraní mock server running at http://localhost:${PORT}`);
console.log(`Error rate: ${ERROR_RATE * 100}%, Latency: ${LATENCY_MIN}-${LATENCY_MAX}ms`);
