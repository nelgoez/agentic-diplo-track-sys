// Maps SIU-Guaraní Spanish field names → DTS English models

export interface GuaraniAlumno {
  dni: string
  cuil: string
  apellido: string
  nombre: string
  email: string
  legajo: string
  carreras: string[]
  estado: string
}

export interface GuaraniMateriaAprobada {
  codigo: string
  nombre: string
  nota: number
  fecha: string
  libro: string
  folio: string
}

export interface DtsStudent {
  id?: string
  email: string
  name: string
  dni: string
  student_id: string // legajo
  is_active: boolean
}

export interface DtsCertificate {
  student_id?: string
  course_name: string
  issue_date: string
  qualification: number
  status: string
}

export function mapAlumnoToStudent(alumno: GuaraniAlumno): DtsStudent {
  return {
    email: alumno.email,
    name: `${alumno.nombre} ${alumno.apellido}`,
    dni: alumno.dni,
    student_id: alumno.legajo,
    is_active: alumno.estado === 'regular',
  };
}

export function mapMateriaToCertificate(materia: GuaraniMateriaAprobada): DtsCertificate {
  return {
    course_name: materia.nombre,
    issue_date: materia.fecha,
    qualification: materia.nota,
    status: materia.nota >= 4 ? 'approved' : 'failed',
  };
}

export function mapEstadoToEnrollmentStatus(estado: string): string {
  const estados: Record<string, string> = {
    regular: 'active',
    libre: 'inactive',
    egresado: 'graduated',
  };
  return estados[estado] ?? 'unknown';
}

export function mapCarreraToTrack(carrera: { codigo: string, nombre: string, duracion: number }): {
  name: string
  code: string
  description: string
  credits_required: number
} {
  return {
    name: carrera.nombre,
    code: carrera.codigo,
    description: `${carrera.nombre} — Plan de ${carrera.duracion} años`,
    credits_required: carrera.duracion * 40,
  };
}
