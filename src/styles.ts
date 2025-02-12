import { StyleSheet } from '@react-pdf/renderer';

// Estilos para la vista previa en web
export const previewStyles = {
  clasico: {
    header: 'bg-white py-8',
    title: 'text-4xl font-serif text-gray-800 uppercase tracking-wide',
    subtitle: 'text-xl font-serif text-gray-600 italic',
    sectionTitle: 'text-lg font-serif font-bold text-gray-800 uppercase border-b-2 border-gray-300 tracking-wider',
    text: 'text-gray-700 font-serif leading-relaxed',
    accent: 'bg-gray-100 border border-gray-300',
    container: 'px-8',
    experienceTitle: 'font-serif font-bold text-gray-800 text-lg',
    experienceCompany: 'text-gray-600 italic',
    skillsContainer: 'grid grid-cols-2 gap-2',
    skillItem: 'bg-gray-100 border border-gray-300 px-3 py-1 text-center font-serif'
  },
  moderno: {
    header: 'bg-gradient-to-r from-blue-600 to-blue-400 py-8 rounded-b-3xl shadow-lg',
    title: 'text-4xl font-sans text-white font-light tracking-tight',
    subtitle: 'text-xl font-sans text-blue-100',
    sectionTitle: 'text-lg font-sans font-bold text-blue-600 flex items-center gap-2 before:content-[""] before:block before:w-4 before:h-4 before:bg-blue-200 before:rounded-full',
    text: 'text-gray-600 font-sans',
    accent: 'bg-blue-50 shadow-sm',
    container: 'px-6',
    experienceTitle: 'font-sans font-bold text-blue-600 text-lg',
    experienceCompany: 'text-blue-500 font-medium',
    skillsContainer: 'flex flex-wrap gap-2',
    skillItem: 'bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 rounded-full text-blue-600 font-medium'
  },
  profesional: {
    header: 'bg-slate-900 py-12 relative overflow-hidden',
    title: 'text-5xl font-sans text-white font-bold tracking-tight relative z-10',
    subtitle: 'text-xl font-sans text-slate-300 relative z-10',
    sectionTitle: 'text-lg font-sans font-bold text-slate-800 border-l-4 border-yellow-400 pl-4',
    text: 'text-slate-600 font-sans',
    accent: 'bg-slate-100',
    container: 'px-8 relative',
    experienceTitle: 'font-sans font-bold text-slate-800 text-xl flex items-center gap-2',
    experienceCompany: 'text-yellow-600 font-semibold',
    skillsContainer: 'grid grid-cols-3 gap-3',
    skillItem: 'bg-slate-800 text-white px-4 py-2 rounded text-center font-medium'
  }
};

// Estilos existentes para el PDF
export const templateStyles = {
  clasico: {
    colors: {
      primary: '#ffffff',
      secondary: '#34495e',
      accent: '#ffffff',
      background: '#ffffff',
      headerText: '#272935',
      sectionBg: '#ffffff'
    },
    fonts: {
      header: 'Times-Bold',
      body: 'Times-Roman'
    }
  },
  moderno: {
    colors: {
      primary: 'rgb(37, 99, 235)',
      secondary: '#4c5564',
      accent: '#000000',
      background: '#ffffff',
      headerText: '#ffffff',
      sectionBg: '#f0f9ff'
    },
    fonts: {
      header: 'Helvetica-Bold',
      body: 'Helvetica'
    }
  },
  profesional: {
    colors: {
      primary: '#1e293b',
      secondary: '#334155',
      accent: '#ca8a04',
      background: '#ffffff',
      headerText: '#ffffff',
      sectionBg: '#f8fafc'
    },
    fonts: {
      header: 'Helvetica-Bold',
      body: 'Helvetica'
    }
  }
};

export const createPDFStyles = (template: keyof typeof templateStyles) => StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: templateStyles[template].colors.background,
    fontFamily: templateStyles[template].fonts.body
  },
  header: {
    backgroundColor: templateStyles[template].colors.primary,
    padding: '40 30',
    marginBottom: template === 'moderno' ? 0 : 20,
    position: 'relative',
    ...(template === 'moderno' && {
      borderBottomRightRadius: 100,
      borderBottomLeftRadius: 8
    })
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 15
  },
  headerText: {
    color: templateStyles[template].colors.headerText,
    fontFamily: templateStyles[template].fonts.header,
    fontSize: 24,
    letterSpacing: 0.5
  },
  headerSubText: {
    color: templateStyles[template].colors.headerText,
    opacity: 0.9,
    fontSize: 16,
    marginTop: 5
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 15,
    flexWrap: 'wrap',
    color: templateStyles[template].colors.headerText,
    opacity: 0.9
  },
  mainContent: {
    padding: '20 30'
  },
  section: {
    marginBottom: 20,
    padding: template === 'moderno' ? 15 : 0,
    backgroundColor: template === 'moderno' ? templateStyles[template].colors.sectionBg : 'transparent',
    borderRadius: template === 'moderno' ? 8 : 0
  },
  sectionTitle: {
    fontSize: 16,
    color: templateStyles[template].colors.primary,
    marginBottom: 12,
    fontFamily: templateStyles[template].fonts.header,
    ...(template === 'clasico' && {
      borderBottomWidth: 1,
      borderBottomColor: templateStyles[template].colors.accent,
      paddingBottom: 5
    }),
    ...(template === 'moderno' && {
      backgroundColor: templateStyles[template].colors.primary,
      color: '#ffffff',
      padding: '5 10',
      borderRadius: 4
    }),
    ...(template === 'profesional' && {
      borderLeftWidth: 4,
      borderLeftColor: templateStyles[template].colors.accent,
      paddingLeft: 8
    })
  },
  text: {
    fontSize: 11,
    color: templateStyles[template].colors.secondary,
    marginBottom: 4,
    lineHeight: 1.4
  },
  experienceItem: {
    marginBottom: 12,
    ...(template === 'moderno' && {
      backgroundColor: '#ffffff',
      padding: 10,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 }
    })
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  skillItem: {
    backgroundColor: template === 'profesional' 
      ? templateStyles[template].colors.primary
      : template === 'moderno'
      ? templateStyles[template].colors.primary
      : templateStyles[template].colors.sectionBg,
    padding: '4 12',
    borderRadius: 4,
    ...(template === 'clasico' && {
      borderWidth: 1,
      borderColor: templateStyles[template].colors.accent
    })
  },
  skillText: {
    fontSize: 10,
    color: template === 'clasico' 
      ? templateStyles[template].colors.secondary
      : '#ffffff'
  }
});
