import React, { useState, useEffect } from 'react';
import { FileDown } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, Image } from '@react-pdf/renderer';
import axios from 'axios';
import type { CVData } from '../types';
import { createPDFStyles } from '../styles';
import { previewStyles, templateStyles } from '../styles';

interface Props {
  cvData: CVData;
}

const CVDocument: React.FC<{ cvData: CVData; template: keyof typeof templateStyles }> = ({ cvData, template }) => {
  const styles = createPDFStyles(template);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {cvData.foto && (
              <Image
                src={cvData.foto}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  border: '2px solid white'
                }}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.headerText}>{cvData.nombreCompleto}</Text>
              <Text style={styles.headerSubText}>{cvData.titulo}</Text>
            </View>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.text}>{cvData.email}</Text>
            <Text style={styles.text}>•</Text>
            <Text style={styles.text}>{cvData.telefono}</Text>
            <Text style={styles.text}>•</Text>
            <Text style={styles.text}>{cvData.direccion}</Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          {cvData.resumen && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Perfil Profesional</Text>
              <Text style={styles.text}>{cvData.resumen}</Text>
            </View>
          )}

          {cvData.experiencia.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experiencia Profesional</Text>
              {cvData.experiencia.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={[styles.text, { fontFamily: templateStyles[template].fonts.header }]}>
                      {exp.cargo}
                    </Text>
                    <Text style={[styles.text, { fontSize: 10 }]}>
                      {exp.fechaInicio} - {exp.fechaFin}
                    </Text>
                  </View>
                  <Text style={[styles.text, { fontStyle: 'italic', marginBottom: 4 }]}>{exp.empresa}</Text>
                  <Text style={styles.text}>{exp.descripcion}</Text>
                </View>
              ))}
            </View>
          )}

          {cvData.educacion.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Formación Académica</Text>
              {cvData.educacion.map((edu, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={[styles.text, { fontFamily: templateStyles[template].fonts.header }]}>
                      {edu.titulo}
                    </Text>
                    <Text style={[styles.text, { fontSize: 10 }]}>
                      {edu.fechaInicio} - {edu.fechaFin}
                    </Text>
                  </View>
                  <Text style={[styles.text, { fontStyle: 'italic' }]}>{edu.institucion}</Text>
                </View>
              ))}
            </View>
          )}

          {cvData.habilidades.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Competencias</Text>
              <View style={styles.skillsContainer}>
                {cvData.habilidades.map((skill, index) => (
                  <View key={index} style={styles.skillItem}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

const CVPreview: React.FC<Props> = ({ cvData }) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'clasico' | 'moderno' | 'profesional'>('moderno');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    if (status === 'approved') {
      setIsPurchased(true);
    }
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/create-preference`, {
        items: [{
          title: 'CV Profesional - ' + cvData.nombre,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: Number(cvData.tarifa)
        }]
      });
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference_id=${data.id}`;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Error al iniciar el pago');
      } else {
        alert('Error desconocido al procesar el pago');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const currentStyle = previewStyles[selectedTemplate as keyof typeof previewStyles];

  return (
    <div className="space-y-8">
      {/* Selector de Plantillas */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Selecciona un diseño</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['clasico', 'moderno', 'profesional'] as const).map((template) => (
            <div
              key={template}
              onClick={() => setSelectedTemplate(template)}
              className={`cursor-pointer border-2 p-2 rounded-lg transition-all ${
                selectedTemplate === template
                  ? 'border-blue-500 shadow-md scale-105'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <img
                src={`/templates/${template}.jpg`}
                alt={`Plantilla ${template}`}
                className="w-20 h-20 object-cover rounded"
              />
              <p className="text-center mt-1 text-sm capitalize">{template}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vista Previa del CV con estilos dinámicos */}
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300`}>
        <div className={`${currentStyle.header} text-center`}>
          <div className={`${currentStyle.container}`}>
            <div className="flex items-center justify-center gap-6 mb-4">
              {cvData.foto && (
                <img
                  src={cvData.foto}
                  alt="Foto de perfil"
                  className={`w-20 h-20 rounded-full object-cover border-2 ${
                    selectedTemplate === 'profesional' ? 'border-yellow-400' : 'border-current'
                  } shadow-lg`}
                />
              )}
              <div>
                <h1 className={`${currentStyle.title} mb-2`}>
                  {cvData.nombreCompleto}
                </h1>
                <h2 className={`${currentStyle.subtitle}`}>{cvData.titulo}</h2>
              </div>
            </div>
            <div className={`flex items-center justify-center gap-4 ${currentStyle.text} mt-4`}>
              <span>{cvData.email}</span>
              <span>•</span>
              <span>{cvData.telefono}</span>
              <span>•</span>
              <span>{cvData.direccion}</span>
            </div>
          </div>
        </div>

        <div className={`p-6 space-y-8 ${currentStyle.container}`}>
          {cvData.resumen && (
            <div>
              <h3 className={`${currentStyle.sectionTitle} mb-4`}>
                Perfil Profesional
              </h3>
              <p className={`${currentStyle.text} leading-relaxed`}>{cvData.resumen}</p>
            </div>
          )}

          {cvData.experiencia.length > 0 && (
            <div>
              <h3 className={`${currentStyle.sectionTitle} mb-6`}>
                Experiencia Profesional
              </h3>
              <div className="space-y-6">
                {cvData.experiencia.map((exp, index) => (
                  <div key={index} className={`${
                    selectedTemplate === 'moderno' ? 'bg-blue-50 p-4 rounded-lg' :
                    selectedTemplate === 'profesional' ? 'border-l-2 border-yellow-400 pl-4' :
                    ''
                  }`}>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h4 className={`${currentStyle.experienceTitle}`}>{exp.cargo}</h4>
                      <span className={`${currentStyle.text} text-sm`}>
                        {exp.fechaInicio} - {exp.fechaFin}
                      </span>
                    </div>
                    <p className={`${currentStyle.experienceCompany} mt-1`}>{exp.empresa}</p>
                    <p className={`${currentStyle.text} mt-2`}>{exp.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cvData.educacion.length > 0 && (
            <div>
              <h3 className={`${currentStyle.sectionTitle} mb-6`}>
                Formación Académica
              </h3>
              <div className="space-y-4">
                {cvData.educacion.map((edu, index) => (
                  <div key={index} className={`${
                    selectedTemplate === 'moderno' ? 'bg-blue-50 p-4 rounded-lg' :
                    selectedTemplate === 'profesional' ? 'border-l-2 border-yellow-400 pl-4' :
                    ''
                  }`}>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h4 className={`${currentStyle.experienceTitle}`}>{edu.titulo}</h4>
                      <span className={`${currentStyle.text} text-sm`}>
                        {edu.fechaInicio} - {edu.fechaFin}
                      </span>
                    </div>
                    <p className={`${currentStyle.experienceCompany} mt-1`}>{edu.institucion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cvData.habilidades.length > 0 && (
            <div>
              <h3 className={`${currentStyle.sectionTitle} mb-6`}>
                Competencias
              </h3>
              <div className={currentStyle.skillsContainer}>
                {cvData.habilidades.map((skill, index) => (
                  <div
                    key={index}
                    className={`${currentStyle.skillItem}`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de Pago/Descarga */}
          <div className="mt-8 space-y-3">
            <PDFDownloadLink
              document={<CVDocument cvData={cvData} template={selectedTemplate} />}
              fileName="CV_Vista_Previa.pdf"
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <FileDown className="w-5 h-5" />
              Descargar Vista Previa
            </PDFDownloadLink>

            {isPurchased ? (
              <PDFDownloadLink
                document={<CVDocument cvData={cvData} template={selectedTemplate} />}
                fileName="CV_Profesional.pdf"
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileDown className="w-5 h-5" />
                Descargar CV
              </PDFDownloadLink>
            ) : (
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Procesando...' : 'Pagar y Generar CV'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;