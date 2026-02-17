import { a as useTranslation } from './i18n_Bd6mPn--.mjs';
import { useCallback } from 'react';

const validateNombre = (value, translate) => {
  if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s.]+$/.test(value)) {
    return translate("Validation-Name1");
  }
  const words = value.trim().split(/\s+/);
  if (words.length < 2) return translate("Validation-Name2");
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (/^[A-Za-zÁáÉéÍíÓóÚúÑñ]\.$/.test(word)) {
      continue;
    }
    if ((i === 0 || i === words.length - 1) && word.length < 3) {
      return i === 0 ? translate("Validation-Name3") : translate("Validation-Name4");
    }
    if (word.length < 3) {
      return translate("Validation-Name5");
    }
  }
  return "";
};
const validateCedula = (value, extranjero, translate) => {
  if (value.length === 0) return "";
  if (extranjero === "V") {
    const numericValue = value.replace(/\./g, "");
    if (!/^\d+$/.test(numericValue)) {
      return translate("Validation-ID1");
    }
    if (parseInt(numericValue) > 6e7) {
      return translate("Validation-ID2");
    }
  } else {
    if (!/^[A-Za-z0-9\-_.]+$/.test(value)) {
      return translate("Validation-ID3");
    }
  }
  return "";
};
const validateNacionalidad = (value, translate) => {
  if (value.length === 0) return "";
  if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(value)) {
    return translate("Validation-N1");
  }
  if (value.length < 3) return translate("Validation-N2");
  return "";
};
const validateEdad = (value, translate) => {
  if (value.length === 0) return "";
  if (!/^\d+$/.test(value)) return translate("Validation-A1");
  const age = parseInt(value, 10);
  if (age < 0) return translate("Validation-A2");
  if (age > 125) return translate("Validation-A3");
  return "";
};
const validateTextField = (name, value, translate) => {
  if (value.length === 0) return "";
  if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s.-]+$/.test(value)) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} ${translate("Validation-Text1")}`;
  }
  if (value.length < 3) return `${name.charAt(0).toUpperCase() + name.slice(1)} ${translate("Validation-Text2")}`;
  return "";
};
const validateHora = (value, translate) => {
  if (value.length === 0) return "";
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) return translate("Validation-Time");
  return "";
};
function useFormValidation() {
  const { t, lang, forceUpdate } = useTranslation();
  const validateForm = useCallback((formData) => {
    const errors = {};
    errors.nombre = validateNombre(formData.nombre, t);
    errors.cedula = validateCedula(formData.cedula ?? "", formData.extranjero, t);
    if (formData.edad !== void 0) errors.edad = validateEdad(formData.edad.toString(), t);
    if (formData.nacionalidad) errors.nacionalidad = formData.extranjero === "E" ? validateNacionalidad(formData.nacionalidad, t) : "";
    if (formData.profesion) errors.profesion = validateTextField(`${t("Form-P")}`, formData.profesion, t);
    if (formData.etnia) errors.etnia = validateTextField(`${t("Form-E")}`, formData.etnia, t);
    if (formData.hora) errors.hora = validateHora(formData.hora, t);
    return Object.fromEntries(Object.entries(errors).filter(([_, value]) => value !== ""));
  }, [t]);
  return { validateForm, lang, forceUpdate };
}

export { useFormValidation as u };
