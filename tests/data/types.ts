export interface TestDni {
  dni: string
  cuil: string
}

export interface TestStudent {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  dni: string
  cuil: string
  legajo: string
  carrera: string
  estado: 'regular' | 'libre' | 'egresado'
}

export interface TestCarrera {
  codigo: string
  nombre: string
  facultad: string
  duracion: number
  plan: string
}

export interface TestMateriaAprobada {
  codigo: string
  nombre: string
  nota: number
  fecha: string
  libro: string
  folio: string
}

export interface TestHistoriaAcademica {
  studentId: string
  carreras: Array<{
    codigo: string
    materiasAprobadas: TestMateriaAprobada[]
    promedio: number
    fechaIngreso: string
  }>
}
