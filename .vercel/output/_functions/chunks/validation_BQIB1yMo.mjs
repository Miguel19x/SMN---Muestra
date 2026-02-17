import { u as useTranslation } from './i18n_BgOPVVWt.mjs';
import { useCallback } from 'react';

const validateNombre = (value, translate) => {
  if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ0-9\s.\-]+$/.test(value)) {
    return translate("Validation-Name1");
  }
  if (value.trim().length < 2) return translate("Validation-Name2");
  return "";
};
const validateCodigo = (value, origen, translate) => {
  if (value.length === 0) return "";
  if (origen === "N") {
    if (!/^[A-Za-z0-9\-]+$/.test(value)) {
      return translate("Validation-ID1");
    }
  } else {
    if (!/^[A-Za-z0-9\-_.]+$/.test(value)) {
      return translate("Validation-ID3");
    }
  }
  return "";
};
const validatePaisOrigen = (value, translate) => {
  if (value.length === 0) return "";
  if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(value)) {
    return translate("Validation-N1");
  }
  if (value.length < 3) return translate("Validation-N2");
  return "";
};
const validateAntiguedad = (value, translate) => {
  if (value.length === 0) return "";
  if (!/^\d+$/.test(value)) return translate("Validation-A1");
  const age = parseInt(value, 10);
  if (age < 0) return translate("Validation-A2");
  if (age > 200) return translate("Validation-A3");
  return "";
};
const validateTextField = (name, value, translate) => {
  if (value.length === 0) return "";
  if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ0-9\s.\-,]+$/.test(value)) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} ${translate("Validation-Text1")}`;
  }
  if (value.length < 2) return `${name.charAt(0).toUpperCase() + name.slice(1)} ${translate("Validation-Text2")}`;
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
    errors.codigo = validateCodigo(formData.codigo ?? "", formData.origen, t);
    if (formData.antiguedad !== void 0) errors.antiguedad = validateAntiguedad(formData.antiguedad.toString(), t);
    if (formData.pais_origen) errors.pais_origen = formData.origen === "I" ? validatePaisOrigen(formData.pais_origen, t) : "";
    if (formData.tipo_objeto) errors.tipo_objeto = validateTextField(`${t("Form-P")}`, formData.tipo_objeto, t);
    if (formData.hora_registro) errors.hora_registro = validateHora(formData.hora_registro, t);
    return Object.fromEntries(Object.entries(errors).filter(([_, value]) => value !== ""));
  }, [t]);
  return { validateForm, lang, forceUpdate };
}

export { useFormValidation as u };
