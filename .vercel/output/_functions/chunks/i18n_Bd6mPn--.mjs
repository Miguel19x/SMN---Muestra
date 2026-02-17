import { jsx } from 'react/jsx-runtime';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const Menu$1 = "Menu";
const Hastaghs$1 = "#NoMásSecuestros    |    #NoMásSecuestrados    |    #LiberenALosPresosPolíticos";
const Process1$1 = "Cargando datos...";
const Process2$1 = "Cargando detalles...";
const Footer$1 = "© 2026 NoMásSecuestros. Esta iniciativa comunitaria busca crear conciencia sobre la situación de los presos políticos en Venezuela.";
const es = {
  "Navbar-1": "Listado de Secuestrados",
  "Navbar-2": "Subir Información",
  "Navbar-3": "Listado de Fallecidos",
  "Navbar-4": "Estadísticas",
  Menu: Menu$1,
  "Menu-Option1": "Más Información",
  "Menu-Option2": "Modo Oscuro",
  "Menu-Option3": "Lenguaje",
  "Title-1": "NO MÁS SECUESTROS",
  "Title-1.1": "#NOMÁSSECUESTROS",
  "Title-1.2": "NO MÁS SECUESTRADOS",
  "Title-1.3": "#NOMÁSSECUESTRADOS",
  "Title-1.4": "NO MÁS PRESOS POLÍTICOS",
  "Title-1.5": "#NOMÁSPRESOSPOLÍTICOS",
  "Title-1.6": "NO MÁS SECUESTROS",
  "Title-2": "LISTADO DE FALLECIDOS",
  "Title-3": "Subir Información del Secuestrado",
  "Title-4": "Panel de solicitudes pendientes sobre desaparecidos",
  "Subtitle-1": "Nuestro Propósito",
  "Subtitle-2": "Valor de cada vida",
  "Subtitle-3": "Sobre esta iniciativa",
  "Subtitle-4": "Aviso Importante",
  "Subtitle-5": "Confirmar acción",
  "Paragraph-1": "Esta página ha sido creada con el propósito de divulgar un registro detallado de todos los secuestros que han sido producto de la persecución política ejecutada por el régimen tras las elecciones presidenciales del 28 de julio del 2024. Nuestro objetivo es que la información recolectada y expuesta sea precisa y personal, a fin de evitar las ambigüedades.",
  "Paragraph-2": "Cada persona en esta lista representa una vida: hijo/a, padre/madre, abuelo/a, nieto/a, primo/a, tío/a, sobrino/a, amigo/a, vecino/a. Los presos políticos no son un número a contabilizar, sino personas con allegados y seres queridos que los esperan y los recuerdan.",
  "Paragraph-3": "Esta iniciativa busca crear conciencia sobre la situación de los presos políticos en Venezuela. Nuestro objetivo es mantener viva la memoria de aquellos que han sido injustamente detenidos y presionar por su liberación.",
  "Paragraph-4": "Si tienes información sobre casos de secuestros políticos o deseas colaborar con nuestra causa, por favor rellena un <a href=\"/subir-informacion\" class=\"text-primary hover:underline\">formulario</a> o comunícate con nosotros en la red social X en nuestra cuenta <a href=\"https://x.com/NoMasSecuestr0s\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary hover:underline\">@NoMasSecuestr0s</a>.",
  "Paragraph-5": "ESTOS DATOS NO SERÁN REFLEJADOS DE FORMA INMEDIATA EN LA PÁGINA. ES POSIBLE QUE PASEN 72 HORAS HASTA QUE ESTA INFORMACIÓN SEA VERIFICADA Y PUBLICADA EN PRO DE LA RESPONSABILIDAD QUE EL PROCESO AMERITA. POR FAVOR, INTENTE RELLENAR EL MÁXIMO DE CAMPOS QUE SEAN POSIBLES Y DE FORMA RESPONSABLE. SI DESCONOCE CIERTA INFORMACIÓN, ES PREFERIBLE QUE SE ABSTENGA DE RELLENAR DICHO ESPACIO. EL APARTADO DE NOMBRE Y APELLIDO ES DE CARÁCTER OBLIGATORIO.",
  "Paragraph-6": "¿Estás seguro de que quieres aceptar esta información?",
  "Paragraph-7": "¿Estás seguro de que quieres rechazar esta información?",
  "Phrase-1": "¡No son solo números, son personas!",
  "Phrase-2": "¡Sus nombres jamás deben ser olvidados!",
  Hastaghs: Hastaghs$1,
  "Component-1": "Buscar Detenidos",
  "Component-2": "Listado de Personas Secuestradas",
  "Component-3": "Buscar...",
  "Component-S": "No se encontraron resultados para la búsqueda.",
  "Component-P": "No se encontraron solicitudes pendientes.",
  "Component-Page": "Página",
  "Component-Of": "de",
  "Form-Name": "Nombre Completo *",
  "Form-ID": "Cédula de Identidad",
  "Form-N": "Nacionalidad",
  "Form-NV": "Venezuelan",
  "Form-A": "Edad",
  "Form-G": "Sexo",
  "Form-GS": "Seleccionar sexo",
  "Form-GS-M": "Masculino",
  "Form-GS-F": "Femenino",
  "Form-L": "Ubicación del secuestro",
  "Form-LS": "Seleccionar estado",
  "Form-P": "Profesión",
  "Form-E": "Etnia",
  "Form-HC": "Condición de Salud",
  "Form-D": "Discapacidad",
  "Form-PlaceC": "Lugar de Confinamiento",
  "Form-LD": "Lugar de Desaparición",
  "Form-DD": "Fecha de Desaparición",
  "Date": "dd/mm/aaaa",
  "Form-DT": "Hora de Desaparición",
  "Form-I": "Imagen (máx. 6MB, formatos: JPEG o PNG)",
  "Form-IDrag": "Arrastra y suelta tu imagen aquí o haz clic para seleccionar",
  "Form-IClick": "Toca para seleccionar una imagen",
  Process1: Process1$1,
  Process2: Process2$1,
  "Error": "Error al cargar los datos",
  "Validation-Name1": "El nombre solo puede contener letras, espacios y puntos.",
  "Validation-Name2": "Debes ingresar al menos un nombre y un apellido.",
  "Validation-Name3": "El primer nombre debe tener al menos 3 letras.",
  "Validation-Name4": "El apellido debe tener al menos 3 letras.",
  "Validation-Name5": "Todas las palabras deben tener al menos 3 letras, excepto las iniciales (seguidas de un punto).",
  "Validation-ID1": "La cédula venezolana solo puede contener números.",
  "Validation-ID2": "El número de cédula venezolana no puede ser mayor a 60 millones.",
  "Validation-ID3": "La cédula extranjera solo puede contener letras, números y los caracteres especiales - _ .",
  "Validation-N1": "La nacionalidad solo puede contener letras y espacios.",
  "Validation-N2": "La nacionalidad debe tener al menos 3 letras.",
  "Validation-A1": "La edad solo puede contener números.",
  "Validation-A2": "La edad no puede ser negativa.",
  "Validation-A3": "La edad no puede ser mayor a 125 años.",
  "Validation-Text1": "solo puede contener letras, espacios, puntos y guiones.",
  "Validation-Text2": "debe tener al menos 3 caracteres.",
  "Validation-Time": "Formato de hora inválido. Use HH:MM en formato 24 horas.",
  "Validation-Image1": "Solo se permiten formatos de imagen (JPEG o PNG)",
  "Validation-Image2": "El tamaño máximo de la imagen es de 6MB",
  "List-Title-ID": "Cédula",
  "List-Title-Name": "Nombre y Apellido",
  "List-Title-Location": "Estado",
  "List-Info-Add": "Información Adicional",
  "List-Info-Gender": "Sexo:",
  "List-Info-G1": "Infante",
  "List-Info-G2": "Preadolescente",
  "List-Info-G3": "Adolescente",
  "List-Info-Age": "Edad:",
  "List-Info-Yo": "años",
  "List-Info-A1": "Menor de edad",
  "List-Info-A2": "Tercera edad",
  "List-Info-A3": "Mayor de edad",
  "List-Info-P": "Profesión:",
  "List-Info-N": "Nacionalidad:",
  "List-Info-H": "Condición de salud:",
  "List-Info-D": "Discapacidad:",
  "List-Info-PC": "Lugar de confinamiento:",
  "List-Info-Pd": "Lugar de desaparición:",
  "List-Info-Dd": "Fecha de desaparición:",
  "List-Info-Dt": "Hora de desaparición:",
  "List-Info-E": "Etnia:",
  "List-Info-I": "Imagen del secuestrado",
  "List-Info-Ierror": "No hay imagen disponible",
  "B-Search": "Buscar Por",
  "Component-4": "Buscar campo...",
  "Component-5": "Todos los campos",
  "List-Search-ID": "Cédula",
  "List-Search-Name": "Nombre",
  "List-Search-Location": "Estado",
  "List-Search-Gender": "Sexo",
  "List-Search-Age": "Edad",
  "List-Search-P": "Profesión",
  "List-Search-D": "Discapacidad",
  "List-Search-Pd": "Lugar de desaparición",
  "List-Search-Dd": "Fecha de desaparición",
  "List-Search-Dt": "Hora de desaparición",
  "List-Search-E": "Etnia",
  "List-Search-Ex": "Extranjero",
  "List-Search-H": "Condición de salud",
  "List-Search-N": "Nacionalidad",
  "List-Search-PC": "Lugar de confinamiento",
  "L-Login": "Iniciar Sesión",
  "L-Subtitle": "Ingresa tus credenciales para acceder",
  "L-User": "Usuario",
  "L-Password": "Contraseña",
  "L-Next": "Siguiente",
  "L-SecurityP": "Frase de Seguridad",
  "B-All": "Todos",
  "B-Blue": "Azul",
  "B-Green": "Verde",
  "B-Page": "por página",
  "B-Accept": "Aceptar",
  "B-Cancel": "Cancelar",
  "B-Delete": "Eliminar",
  "B-Save": "Guardar",
  "B-Confirm": "Confirmar",
  "B-Upload": "Subir información",
  "B-Previous": "Anterior",
  "B-Next": "Siguiente",
  "B-Logout": "Cerrar Sesión",
  "B-RequestRemoval": "Solicitar Retiro",
  Footer: Footer$1,
  "Info-Details": "Expandir detalles para",
  "Profanity-Error": "El texto contiene palabras inapropiadas. Por favor, utilice un lenguaje respetuoso.",
  "Move-Mouse": "Desplazar",
  "2FA-Title": "Verificación de Dos Factores",
  "2FA-Setup": "Configurar Autenticación",
  "2FA-Scan": "Escanea el código QR con tu aplicación de autenticación (Google Authenticator, Authy, etc.)",
  "2FA-Code": "Código de verificación",
  "2FA-Enter": "Ingresa el código de 6 dígitos",
  "2FA-Verify": "Verificar",
  "2FA-Error": "Código de verificación incorrecto",
  "Tweets-Title": "Últimas publicaciones",
  "Tweets-Loading": "Cargando tweets...",
  "Tweets-Error": "No se pudieron cargar los tweets",
  "Removal-Title": "Solicitud de Retiro de Información",
  "Removal-Reason": "Razón de la solicitud",
  "Removal-Evidence": "URL de evidencia (opcional)",
  "Removal-Submit": "Enviar Solicitud",
  "Removal-Success": "Solicitud enviada. Será procesada en un plazo de 7 días.",
  "Removal-Pending": "Solicitudes de Retiro Pendientes",
  "Removal-Status-Pending": "Pendiente",
  "Removal-Status-Approved": "Aprobada",
  "Removal-Status-Rejected": "Rechazada",
  "Removal-TwitterLogin": "Iniciar sesión con Twitter para continuar",
};

const Menu = "Menu";
const Hastaghs = "#NoMoreKidnappings    |    #NoMoreKidnapped    |    #FreePoliticalPrisoners";
const Process1 = "Loading data...";
const Process2 = "Loading details...";
const Footer = "© 2026 NoMásSecuestros. This community initiative seeks to raise awareness about the situation of political prisoners in Venezuela.";
const en = {
  "Navbar-1": "List of Kidnapped People",
  "Navbar-2": "Upload Information",
  "Navbar-3": "List of Deceased People",
  "Navbar-4": "Statistics",
  Menu,
  "Menu-Option1": "More Information",
  "Menu-Option2": "Dark Mode",
  "Menu-Option3": "Language",
  "Title-1": "NO MORE KIDNAPPINGS",
  "Title-1.1": "#NOMOREKIDNAPPINGS",
  "Title-1.2": "NO MORE KIDNAPPED PEOPLE",
  "Title-1.3": "#NOMOREKIDNAPPEDPEOPLE",
  "Title-1.4": "NO MORE POLITICAL PRISONERS",
  "Title-1.5": "#NOMOREPOLITICALPRISONERS",
  "Title-1.6": "NO MORE KIDNAPPINGS",
  "Title-2": "LIST OF DECEASED",
  "Title-3": "Upload Information about the kidnapped person",
  "Title-4": "Missing People Pending Requests Panel",
  "Subtitle-1": "Our Purpose",
  "Subtitle-2": "Value of each live",
  "Subtitle-3": "About this initiative",
  "Subtitle-4": "Important Notice",
  "Subtitle-5": "Confirm action",
  "Paragraph-1": "This page has been created to disclose a detailed record of every kidnapping that has been the outcome of the political persecution executed by the regime after the presidential elections carried out on 28th July 2024. To avoid ambiguities, we aim to ensure that the recollected and exposed information is individual and accurate.",
  "Paragraph-2": "Each person in this list represents a life: a child, a mother/father, a grandparent, a grandkid, a cousin, a niece/nephew, a friend, and a neighbor. Political prisoners are not a numbers to be counted but living people with families and friends who are waiting for them and remembering them.",
  "Paragraph-3": "This initiative seeks to raise awareness about the situation of political prisoners in Venezuela. Our goal is to keep alive the memory of those who have been unjustly abducted and to demand their release.",
  "Paragraph-4": "If you have information about political kidnapping cases or wish to collaborate with our cause, please fill out a <a href=\"/subir-informacion\" class=\"text-primary hover:underline\">form</a> or communicate with us on X at our account <a href=\"https://x.com/NoMasSecuestr0s\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-primary hover:underline\">@NoMasSecuestr0s</a>.",
  "Paragraph-5": "THIS DATA WILL NOT BE IMMEDIATELY REFLECTED ON THE PAGE. IT MAY TAKE UP TO 72 HOURS FOR THE INFORMATION TO BE VERIFIED AND UPLOADED IN THE INTEREST OF THE RESPONSIBILITY REQUIRED BY THE PROCESS. PLEASE TRY TO FILL IN AS MANY FIELDS AS POSSIBLE IN A RESPONSIBLE MANNER AND IF CERTAIN INFORMATION IS UNKNOWN, IT IS PREFERABLE THAT YOU REFRAIN FROM FILLING IN THAT SPACE. THE FIRST AND LAST NAME SECTION IS MANDATORY.",
  "Paragraph-6": "Are you sure to accept this information?",
  "Paragraph-7": "Are you sure to reject this information?",
  "Phrase-1": "They aren't just numbers, they're people!",
  "Phrase-2": "Their names must never be forgotten!",
  Hastaghs,
  "Component-1": "Search Detainees",
  "Component-2": "List of Abductees",
  "Component-3": "Search...",
  "Component-S": "No results were found for your search.",
  "Component-P": "No pending applications were found.",
  "Component-Page": "Page",
  "Component-Of": "of",
  "Form-Name": "Full Name *",
  "Form-ID": "ID",
  "Form-N": "Nationality",
  "Form-NV": "Venezuelan",
  "Form-A": "Age",
  "Form-G": "Gender",
  "Form-GS": "Select Gender",
  "Form-GS-M": "Male",
  "Form-GS-F": "Female",
  "Form-L": "Location of kidnapping",
  "Form-LS": "Select location",
  "Form-P": "Profession",
  "Form-E": "Ethnicity",
  "Form-HC": "Health conditions",
  "Form-D": "Disability",
  "Form-PlaceC": "Place of Confinement",
  "Form-LD": "Location of Disappearance",
  "Form-DD": "Date of Disappearance",
  "Date": "dd/mm/yyyy",
  "Form-DT": "Disappearance Time",
  "Form-I": "Image (max 6MB, formats: JPEG/PNG)",
  "Form-IDrag": "Drag and drop your image here or click to select",
  "Form-IClick": "Click to select an image",
  Process1,
  Process2,
  "Error": "Error loading data",
  "Validation-Name1": "The name must only contain letters, spaces and periods.",
  "Validation-Name2": "You must enter at least one name and a last name.",
  "Validation-Name3": "The first name must have at least 3 letters.",
  "Validation-Name4": "The last name must have at least 3 letters.",
  "Validation-Name5": "All words must have at least 3 letters, except for initials (followed by a period).",
  "Validation-ID1": "Venezuelan ID must only contain numbers.",
  "Validation-ID2": "The Venezuelan ID number cannot exceed 60 million.",
  "Validation-ID3": "A foreigner ID can only contain letters, numbers and special characters - _ .",
  "Validation-N1": "The nationality can only contain letters and spaces.",
  "Validation-N2": "The nationality must have at least 3 letters.",
  "Validation-A1": "Age must only contain numbers.",
  "Validation-A2": "Age cannot be a negative number.",
  "Validation-A3": "The age cannot exceed 125 years.",
  "Validation-Text1": "can only contain letters, spaces, periods and hyphens.",
  "Validation-Text2": "must have at least 3 characters.",
  "Validation-Time": "Invalid time format. Use HH:MM in 24 hours format.",
  "Validation-Image1": "Only image formats (JPEG or PNG) are allowed.",
  "Validation-Image2": "The maximum image size is 6MB.",
  "List-Title-ID": "ID",
  "List-Title-Name": "First name and Last name",
  "List-Title-Location": "Location",
  "List-Info-Add": "Additional information",
  "List-Info-Gender": "Gender:",
  "List-Info-G1": "Infant",
  "List-Info-G2": "Preteen",
  "List-Info-G3": "Adolescent",
  "List-Info-Age": "Age:",
  "List-Info-Yo": "years old",
  "List-Info-A1": "Underage",
  "List-Info-A2": "Elderly",
  "List-Info-A3": "Adult",
  "List-Info-P": "Profession:",
  "List-Info-N": "Nationality:",
  "List-Info-H": "Health conditions:",
  "List-Info-D": "Disability:",
  "List-Info-PC": "Place of confinement:",
  "List-Info-Pd": "Place of disappearance:",
  "List-Info-Dd": "Date of disappearance:",
  "List-Info-Dt": "Disappearance time:",
  "List-Info-E": "Ethnicity:",
  "List-Info-I": "Imagen del secuestrado",
  "List-Info-Ierror": "No image available",
  "B-Search": "Search By",
  "Component-4": "Search field...",
  "Component-5": "All fields",
  "List-Search-ID": "ID",
  "List-Search-Name": "Name",
  "List-Search-Location": "Location",
  "List-Search-Gender": "Gender",
  "List-Search-Age": "Age",
  "List-Search-P": "Profession",
  "List-Search-D": "Disability",
  "List-Search-Pd": "Place of disappearance",
  "List-Search-Dd": "Date of disappearance",
  "List-Search-Dt": "Disappearance time",
  "List-Search-E": "Ethnicity",
  "List-Search-Ex": "Foreigner",
  "List-Search-H": "Health conditions",
  "List-Search-N": "Nationality",
  "List-Search-PC": "Place of confinement",
  "L-Login": "Log in",
  "L-Subtitle": "Enter your username to log in",
  "L-User": "Username",
  "L-Password": "Password",
  "L-Next": "Next",
  "L-SecurityP": "Security phrase",
  "B-All": "All",
  "B-Blue": "Blue",
  "B-Green": "Green",
  "B-Page": "per page",
  "B-Cancel": "Cancel",
  "B-Delete": "Delete",
  "B-Save": "Save",
  "B-Accept": "Accept",
  "B-Confirm": "Confirm",
  "B-Upload": "Upload information",
  "B-Previous": "Previous",
  "B-Next": "Next",
  "B-Logout": "Log Out",
  "B-RequestRemoval": "Request Removal",
  Footer,
  "Info-Details": "Expand details to",
  "Profanity-Error": "The text contains inappropriate words. Please use respectful language.",
  "Move-Mouse": "Move",
  "2FA-Title": "Two-Factor Authentication",
  "2FA-Setup": "Setup Authentication",
  "2FA-Scan": "Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)",
  "2FA-Code": "Verification code",
  "2FA-Enter": "Enter the 6-digit code",
  "2FA-Verify": "Verify",
  "2FA-Error": "Incorrect verification code",
  "Tweets-Title": "Latest posts",
  "Tweets-Loading": "Loading tweets...",
  "Tweets-Error": "Could not load tweets",
  "Removal-Title": "Information Removal Request",
  "Removal-Reason": "Reason for request",
  "Removal-Evidence": "Evidence URL (optional)",
  "Removal-Submit": "Submit Request",
  "Removal-Success": "Request submitted. It will be processed within 7 days.",
  "Removal-Pending": "Pending Removal Requests",
  "Removal-Status-Pending": "Pending",
  "Removal-Status-Approved": "Approved",
  "Removal-Status-Rejected": "Rejected",
  "Removal-TwitterLogin": "Log in with Twitter to continue",
};

const translations = { es, en };
const LanguageContext = createContext({
  currentLang: "es",
  setLanguage: () => {
  },
  translate: (key) => key,
  forceUpdate: () => {
  }
});
const useLanguage = () => useContext(LanguageContext);
function isValidLanguage(lang) {
  return lang === "es" || lang === "en";
}
function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
function getPersistedLanguage() {
  if (typeof window === "undefined") return "es";
  const cookieLang = getCookie("NEXT_LOCALE");
  if (cookieLang && isValidLanguage(cookieLang)) return cookieLang;
  const storedLang = localStorage.getItem("language");
  if (storedLang && isValidLanguage(storedLang)) return storedLang;
  const htmlLang = document.documentElement.lang;
  if (htmlLang && isValidLanguage(htmlLang)) return htmlLang;
  return "es";
}
function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState("es");
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    const persistedLang = getPersistedLanguage();
    if (persistedLang !== currentLang) {
      setCurrentLang(persistedLang);
    }
    setIsHydrated(true);
    const handleAstroPageLoad = () => {
      const newLang = getPersistedLanguage();
      setCurrentLang(newLang);
    };
    document.addEventListener("astro:page-load", handleAstroPageLoad);
    return () => {
      document.removeEventListener("astro:page-load", handleAstroPageLoad);
    };
  }, []);
  useEffect(() => {
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail.language);
    };
    window.addEventListener("languagechange", handleLanguageChange);
    return () => {
      window.removeEventListener("languagechange", handleLanguageChange);
    };
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined" && isHydrated) {
      localStorage.setItem("language", currentLang);
      document.documentElement.lang = currentLang;
      document.cookie = `NEXT_LOCALE=${currentLang}; path=/; max-age=31536000; SameSite=Strict`;
      updateTranslations(currentLang);
    }
  }, [currentLang, isHydrated]);
  const setLanguageCallback = useCallback((lang) => {
    if (isValidLanguage(lang)) {
      setCurrentLang(lang);
    } else {
      console.error(`Invalid language: ${lang}`);
    }
  }, []);
  const translateCallback = useCallback(
    (key, vars) => translateWithVars(key, currentLang, vars),
    [currentLang]
  );
  const forceUpdateCallback = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: currentLang } }));
    }
  }, [currentLang]);
  const contextValue = useMemo(() => ({
    currentLang,
    setLanguage: setLanguageCallback,
    translate: translateCallback,
    forceUpdate: forceUpdateCallback
  }), [currentLang, setLanguageCallback, translateCallback, forceUpdateCallback]);
  return /* @__PURE__ */ jsx(LanguageContext.Provider, { value: contextValue, children });
}
function translate(key, lang) {
  return translations[lang][key] || key;
}
function translateWithVars(key, lang, vars) {
  let translation = translations[lang][key] || key;
  if (vars) {
    Object.entries(vars).forEach(([varKey, varValue]) => {
      translation = translation.replace(new RegExp(`\\{${varKey}\\}`, "g"), String(varValue));
    });
  }
  return translation;
}
function updateTranslations(lang) {
  if (typeof document !== "undefined") {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (key && key in translations[lang]) {
        element.innerHTML = translate(key, lang);
      }
    });
    const attributeElements = document.querySelectorAll("[data-i18n-attr]");
    attributeElements.forEach((element) => {
      const attr = element.getAttribute("data-i18n-attr");
      const key = element.getAttribute("data-i18n");
      if (attr && key && key in translations[lang]) {
        element.setAttribute(attr, translate(key, lang));
      }
    });
  }
}
function useTranslation() {
  const { translate: translate2, currentLang, forceUpdate } = useLanguage();
  return { t: translate2, lang: currentLang, forceUpdate };
}

export { LanguageProvider as L, useTranslation as a, useLanguage as u };
