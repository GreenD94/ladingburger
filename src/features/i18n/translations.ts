import { Translations } from './types';

export const translations: Record<string, Translations> = {
  en: {
    analytics: 'Analytics',
    orders: 'Orders',
    menu: 'Menu',
    business: 'Business',
    admin: 'Admin',
    users: 'Users',
    theme: 'Theme',
    config: 'Config',
    selectTheme: 'Select Theme',
    preview: 'Preview',
    adminThemeMode: 'Admin Theme Mode',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
    english: 'English',
    spanish: 'Spanish',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading',
    error: 'Error',
    success: 'Success',
  },
  es: {
    analytics: 'Analíticas',
    orders: 'Pedidos',
    menu: 'Menú',
    business: 'Negocio',
    admin: 'Administrador',
    users: 'Usuarios',
    theme: 'Tema',
    config: 'Configuración',
    selectTheme: 'Seleccionar Tema',
    preview: 'Vista Previa',
    adminThemeMode: 'Modo de Tema del Administrador',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    language: 'Idioma',
    english: 'Inglés',
    spanish: 'Español',
    save: 'Guardar',
    cancel: 'Cancelar',
    loading: 'Cargando',
    error: 'Error',
    success: 'Éxito',
  },
};

export function getTranslation(language: string, key: string): string {
  return translations[language]?.[key] || translations.en[key] || key;
}

