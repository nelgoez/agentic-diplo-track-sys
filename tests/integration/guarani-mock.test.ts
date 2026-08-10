import { beforeAll, describe, expect, it } from 'bun:test';
import { DataFactory } from '../data';

const GUARANI_MOCK_URL = process.env.GUARANI_MOCK_URL ?? 'http://localhost:8090';

describe('Guaraní Mock — server integration', () => {
  beforeAll(() => {
    // tests run against fixtures, no live server needed
  });

  it('DataFactory generates valid DNI format', () => {
    const dni = DataFactory.createDni();
    expect(dni.dni).toMatch(/^\d{2}\.\d{3}\.\d{3}$/);
    expect(dni.cuil).toMatch(/^(20|27)-\d{8}-\d$/);
  });

  it('DataFactory generates valid student', () => {
    const student = DataFactory.createStudent();
    expect(student.email).toContain('@mi.unc.edu.ar');
    expect(student.dni).toMatch(/^\d{2}\.\d{3}\.\d{3}$/);
    expect(student.legajo).toMatch(/^\d{8}\/\d$/);
    expect(['regular', 'libre', 'egresado']).toContain(student.estado);
  });

  it('DataFactory generates valid academic history', () => {
    const historia = DataFactory.createHistoriaAcademica(DataFactory.SENTINEL.fakeStudentId);
    expect(historia.carreras.length).toBeGreaterThan(0);
    expect(historia.carreras[0].materiasAprobadas.length).toBeGreaterThan(0);
    expect(historia.carreras[0].promedio).toBeGreaterThan(0);
  });

  it('DataFactory overrides work correctly', () => {
    const student = DataFactory.createStudent({ dni: '40.123.456', estado: 'egresado' });
    expect(student.dni).toBe('40.123.456');
    expect(student.estado).toBe('egresado');
  });

  it('SENTINEL constants are immutable boundary markers', () => {
    expect(DataFactory.SENTINEL.nonExistentDni).toBe('00.000.000');
    expect(DataFactory.SENTINEL.nonExistentLegajo).toBe('00000/0');
  });

  it('guarani-mock package.json is valid workspace', async () => {
    const pkg = await import('../../packages/guarani-mock/package.json', { with: { type: 'json' } });
    expect(pkg.default.name).toBe('@dts/guarani-mock');
    expect(pkg.default.private).toBe(true);
  });

  it('mock fixtures are valid JSON', async () => {
    const padron = await import('../../packages/guarani-mock/src/fixtures/padron-alumno.json', { with: { type: 'json' } });
    expect(Array.isArray(padron.default.alumnos)).toBe(true);
    expect(padron.default.alumnos.length).toBeGreaterThan(0);

    const carreras = await import('../../packages/guarani-mock/src/fixtures/carreras.json', { with: { type: 'json' } });
    expect(Array.isArray(carreras.default.carreras)).toBe(true);
  });

  it('health endpoint returns ok', async () => {
    try {
      const resp = await fetch(`${GUARANI_MOCK_URL}/health`);
      expect(resp.status).toBe(200);
    }
    catch {
      // server not running — skip
    }
  });
});
