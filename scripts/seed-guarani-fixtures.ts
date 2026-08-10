#!/usr/bin/env bun
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const FIXTURES_DIR = join(import.meta.dir, '..', 'packages', 'guarani-mock', 'src', 'fixtures');

function generate(): void {
  mkdirSync(FIXTURES_DIR, { recursive: true });

  const padron = {
    alumnos: [
      { dni: '35.123.456', cuil: '20-35123456-8', apellido: 'Gonzalez', nombre: 'Juan Carlos', email: 'jgonzalez@mi.unc.edu.ar', legajo: '20191001/3', carreras: ['ING-SIS'], estado: 'regular' },
      { dni: '28.987.654', cuil: '27-28987654-2', apellido: 'Martinez', nombre: 'Maria Laura', email: 'mlmartinez@mi.unc.edu.ar', legajo: '20180805/1', carreras: ['ABO-001'], estado: 'regular' },
      { dni: '32.456.789', cuil: '20-32456789-5', apellido: 'Rodriguez', nombre: 'Pedro Alberto', email: 'prodriguez@mi.unc.edu.ar', legajo: '20201203/7', carreras: ['MED-001'], estado: 'regular' },
      { dni: '30.111.222', cuil: '20-30111222-3', apellido: 'Fernandez', nombre: 'Ana Lucia', email: 'afernandez@mi.unc.edu.ar', legajo: '20171115/2', carreras: ['CP-001'], estado: 'egresado' },
    ],
  };

  const historia = {
    dni: '35.123.456',
    historia: [{
      carrera: 'ING-SIS',
      materias_aprobadas: [
        { codigo: 'MAT-001', nombre: 'Matematica I', nota: 8, fecha: '2020-06-15', libro: 'L-123', folio: '45' },
        { codigo: 'FIS-001', nombre: 'Fisica I', nota: 6, fecha: '2020-12-10', libro: 'L-124', folio: '12' },
        { codigo: 'ALG-001', nombre: 'Algebra', nota: 9, fecha: '2021-06-20', libro: 'L-125', folio: '78' },
        { codigo: 'PRO-001', nombre: 'Programacion', nota: 7, fecha: '2021-12-15', libro: 'L-126', folio: '33' },
        { codigo: 'BDD-001', nombre: 'Base de Datos', nota: 8, fecha: '2022-06-10', libro: 'L-127', folio: '90' },
      ],
      promedio: 7.6,
      fecha_ingreso: '2019-03-01',
    }],
  };

  const carreras = {
    carreras: [
      { codigo: 'ING-SIS', nombre: 'Ingenieria en Sistemas', facultad: 'FCEFyN', duracion: 5, plan: '2020' },
      { codigo: 'ABO-001', nombre: 'Abogacia', facultad: 'Derecho', duracion: 5, plan: '2015' },
      { codigo: 'MED-001', nombre: 'Medicina', facultad: 'Ciencias Medicas', duracion: 6, plan: '2018' },
      { codigo: 'CP-001', nombre: 'Contador Publico', facultad: 'Ciencias Economicas', duracion: 5, plan: '2019' },
    ],
  };

  writeFileSync(join(FIXTURES_DIR, 'padron-alumno.json'), `${JSON.stringify(padron, null, 2)}\n`);
  writeFileSync(join(FIXTURES_DIR, 'historia-academica.json'), `${JSON.stringify(historia, null, 2)}\n`);
  writeFileSync(join(FIXTURES_DIR, 'carreras.json'), `${JSON.stringify(carreras, null, 2)}\n`);
  console.log('Guaraní fixtures seeded to packages/guarani-mock/src/fixtures/');
}

generate();
