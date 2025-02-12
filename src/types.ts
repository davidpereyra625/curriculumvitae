export interface CVData {
  nombre: string;
  nombreCompleto: string;
  titulo: string;
  email: string;
  telefono: string;
  direccion: string;
  foto: string;
  resumen: string;
  tarifa: string;
  experiencia: ExperienciaLaboral[];
  educacion: Educacion[];
  habilidades: string[];
}

export interface ExperienciaLaboral {
  empresa: string;
  cargo: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
}

export interface Educacion {
  institucion: string;
  titulo: string;
  fechaInicio: string;
  fechaFin: string;
}