import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Upload } from 'lucide-react';
import { CVData, ExperienciaLaboral, Educacion } from '../types';
import CVPreview from './CVPreview';
import axios from 'axios';

const CVForm: React.FC = () => {
  const [cvData, setCVData] = useState<CVData>({
    nombreCompleto: '',
    titulo: '',
    email: '',
    telefono: '',
    direccion: '',
    foto: '',
    resumen: '',
    experiencia: [],
    educacion: [],
    habilidades: []
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCVData({ ...cvData, foto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const agregarExperiencia = () => {
    setCVData(prevData => ({
      ...prevData,
      experiencia: [...prevData.experiencia, {
        empresa: '',
        cargo: '',
        fechaInicio: '',
        fechaFin: '',
        descripcion: ''
      }]
    }));
  };

  const agregarEducacion = () => {
    setCVData({
      ...cvData,
      educacion: [...cvData.educacion, {
        institucion: '',
        titulo: '',
        fechaInicio: '',
        fechaFin: ''
      }]
    });
  };

  const actualizarExperiencia = (index: number, campo: keyof ExperienciaLaboral, valor: string) => {
    const nuevaExperiencia = [...cvData.experiencia];
    nuevaExperiencia[index] = {
      ...nuevaExperiencia[index],
      [campo]: valor
    };
    
    setCVData(prevData => ({
      ...prevData,
      experiencia: nuevaExperiencia
    }));
  };

  const actualizarEducacion = (index: number, campo: keyof Educacion, valor: string) => {
    const nuevaEducacion = [...cvData.educacion];
    nuevaEducacion[index] = { ...nuevaEducacion[index], [campo]: valor };
    setCVData({ ...cvData, educacion: nuevaEducacion });
  };

  const eliminarExperiencia = (index: number) => {
    setCVData({
      ...cvData,
      experiencia: cvData.experiencia.filter((_, i) => i !== index)
    });
  };

  const eliminarEducacion = (index: number) => {
    setCVData({
      ...cvData,
      educacion: cvData.educacion.filter((_, i) => i !== index)
    });
  };

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/create-preference`);
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error('Error: No se recibió el init_point del servidor');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      // Mostrar un mensaje de error al usuario
      alert('Hubo un error al procesar el pago. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4">
                  {cvData.foto ? (
                    <img 
                      src={cvData.foto} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Upload size={32} />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  <span className="flex items-center gap-2">
                    <Upload size={16} />
                    Subir Foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez González"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={cvData.nombreCompleto}
                  onChange={(e) => setCVData({ ...cvData, nombreCompleto: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título Profesional
                </label>
                <input
                  type="text"
                  placeholder="Ej: Ingeniero de Software Senior"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={cvData.titulo}
                  onChange={(e) => setCVData({ ...cvData, titulo: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Ej: juan.perez@email.com"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={cvData.email}
                  onChange={(e) => setCVData({ ...cvData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  placeholder="Ej: +34 612 345 678"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={cvData.telefono}
                  onChange={(e) => setCVData({ ...cvData, telefono: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Ej: Madrid, España"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={cvData.direccion}
                  onChange={(e) => setCVData({ ...cvData, direccion: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resumen Profesional
                </label>
                <textarea
                  placeholder="Breve descripción de tu perfil profesional y objetivos"
                  className="w-full p-2 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={cvData.resumen}
                  onChange={(e) => setCVData({ ...cvData, resumen: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Experiencia Laboral</h3>
              <button
                onClick={agregarExperiencia}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <PlusCircle size={20} /> Agregar
              </button>
            </div>
            
            {cvData.experiencia.map((exp, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => eliminarExperiencia(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <MinusCircle size={20} />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre de la empresa"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={exp.empresa}
                    onChange={(e) => actualizarExperiencia(index, 'empresa', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo
                  </label>
                  <input
                    type="text"
                    placeholder="Tu posición"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={exp.cargo}
                    onChange={(e) => actualizarExperiencia(index, 'cargo', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Inicio
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Enero 2020"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={exp.fechaInicio}
                      onChange={(e) => actualizarExperiencia(index, 'fechaInicio', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Fin
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Actual"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={exp.fechaFin}
                      onChange={(e) => actualizarExperiencia(index, 'fechaFin', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    placeholder="Describe tus responsabilidades y logros"
                    className="w-full p-2 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={exp.descripcion}
                    onChange={(e) => actualizarExperiencia(index, 'descripcion', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Educación</h3>
              <button
                onClick={agregarEducacion}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <PlusCircle size={20} /> Agregar
              </button>
            </div>
            
            {cvData.educacion.map((edu, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => eliminarEducacion(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <MinusCircle size={20} />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institución
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre de la institución"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={edu.institucion}
                    onChange={(e) => actualizarEducacion(index, 'institucion', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    placeholder="Título obtenido"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={edu.titulo}
                    onChange={(e) => actualizarEducacion(index, 'titulo', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Inicio
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 2016"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={edu.fechaInicio}
                      onChange={(e) => actualizarEducacion(index, 'fechaInicio', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Fin
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 2020"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={edu.fechaFin}
                      onChange={(e) => actualizarEducacion(index, 'fechaFin', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Habilidades</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Habilidades y Competencias
              </label>
              <textarea
                placeholder="Ingrese sus habilidades separadas por comas (Ej: JavaScript, React, Node.js)"
                className="w-full p-2 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={cvData.habilidades.join(', ')}
                onChange={(e) => setCVData({ ...cvData, habilidades: e.target.value.split(',').map(skill => skill.trim()) })}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg sticky top-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Vista Previa</h2>
          <CVPreview cvData={cvData} />
          <button onClick={handlePayment} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Pagar y Descargar CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVForm;