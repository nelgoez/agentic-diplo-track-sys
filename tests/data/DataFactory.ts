import type { TestCarrera, TestDni, TestHistoriaAcademica, TestMateriaAprobada, TestStudent } from './types';

export class DataFactory {
  static SENTINEL = {
    nonExistentDni: '00.000.000',
    nonExistentLegajo: '00000/0',
    nonExistentCarrera: 'XX-999',
    fakeStudentId: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
  } as const;

  private static uniqueId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  static createDni(overrides?: Partial<TestDni>): TestDni {
    const base = 10_000_000 + Math.floor(Math.random() * 40_000_000);
    const dniStr = String(base);
    const formatted = `${dniStr.slice(0, 2)}.${dniStr.slice(2, 5)}.${dniStr.slice(5, 8)}`;
    const gender = Math.random() > 0.5 ? '20' : '27';
    const cuil = `${gender}-${dniStr}-${Math.floor(Math.random() * 9) + 1}`;
    return { dni: formatted, cuil, ...overrides };
  }

  static createLegajo(year?: number): string {
    const yr = year ?? 2015 + Math.floor(Math.random() * 10);
    const seq = String(1000 + Math.floor(Math.random() * 9000));
    return `${yr}${seq}/${Math.floor(Math.random() * 9)}`;
  }

  static createStudent(overrides?: Partial<TestStudent>): TestStudent {
    const id = this.uniqueId();
    const firstName = ['Juan', 'Maria', 'Carlos', 'Laura', 'Pedro', 'Ana', 'Diego', 'Sofia', 'Martin', 'Lucia'][Math.floor(Math.random() * 10)];
    const lastName = ['Gonzalez', 'Rodriguez', 'Lopez', 'Martinez', 'Fernandez', 'Garcia', 'Perez', 'Sanchez', 'Romero', 'Torres'][Math.floor(Math.random() * 10)];
    const dni = this.createDni();
    const carreras = ['Ingenieria en Sistemas', 'Abogacia', 'Medicina', 'Contador Publico', 'Psicologia', 'Arquitectura'];
    return {
      id,
      email: `student-${id.slice(0, 8)}@mi.unc.edu.ar`,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      dni: dni.dni,
      cuil: dni.cuil,
      legajo: this.createLegajo(),
      carrera: carreras[Math.floor(Math.random() * carreras.length)],
      estado: (['regular', 'regular', 'regular', 'libre', 'egresado'] as const)[Math.floor(Math.random() * 5)],
      ...overrides,
    };
  }

  static createCarrera(overrides?: Partial<TestCarrera>): TestCarrera {
    const carreras: TestCarrera[] = [
      { codigo: 'ING-SIS', nombre: 'Ingenieria en Sistemas', facultad: 'FCEFyN', duracion: 5, plan: '2020' },
      { codigo: 'ABO-001', nombre: 'Abogacia', facultad: 'Derecho', duracion: 5, plan: '2015' },
      { codigo: 'MED-001', nombre: 'Medicina', facultad: 'Ciencias Medicas', duracion: 6, plan: '2018' },
      { codigo: 'CP-001', nombre: 'Contador Publico', facultad: 'Ciencias Economicas', duracion: 5, plan: '2019' },
    ];
    const base = carreras[Math.floor(Math.random() * carreras.length)];
    return { ...base, ...overrides };
  }

  static createMateriaAprobada(overrides?: Partial<TestMateriaAprobada>): TestMateriaAprobada {
    const materias = ['Matematica I', 'Fisica I', 'Algebra', 'Programacion', 'Base de Datos', 'Redes', 'Sistemas Operativos', 'Analisis Matematico', 'Estadistica', 'Ingenieria de Software'];
    const id = this.uniqueId();
    return {
      codigo: `MAT-${id.slice(0, 4)}`,
      nombre: materias[Math.floor(Math.random() * materias.length)],
      nota: 4 + Math.floor(Math.random() * 7),
      fecha: `${2019 + Math.floor(Math.random() * 6)}-${String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')}`,
      libro: `L-${100 + Math.floor(Math.random() * 900)}`,
      folio: String(10 + Math.floor(Math.random() * 90)),
      ...overrides,
    };
  }

  static createHistoriaAcademica(studentId: string, overrides?: Partial<TestHistoriaAcademica>): TestHistoriaAcademica {
    const carrera = this.createCarrera();
    const materiasCount = 5 + Math.floor(Math.random() * 20);
    const materias: TestMateriaAprobada[] = [];
    for (let i = 0; i < materiasCount; i++) {
      materias.push(this.createMateriaAprobada());
    }
    const promedio = materias.reduce((sum, m) => sum + m.nota, 0) / materias.length;
    return {
      studentId,
      carreras: [{
        codigo: carrera.codigo,
        materiasAprobadas: materias,
        promedio: Number(promedio.toFixed(2)),
        fechaIngreso: `${2016 + Math.floor(Math.random() * 6)}-03-01`,
      }],
      ...overrides,
    };
  }
}

export default DataFactory;
