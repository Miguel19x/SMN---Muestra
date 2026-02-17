const getAgeStage = (edad, translate) => {
  if (edad === void 0) return "";
  if (edad <= 9) return translate ? translate("List-Info-G1") : "Infant";
  if (edad <= 12) return translate ? translate("List-Info-G2") : "Preteen";
  if (edad <= 19) return translate ? translate("List-Info-G3") : "Adolescent";
  return "";
};
const getLegalCondition = (edad, translate) => {
  if (edad === void 0) return "N/A";
  if (edad < 18) return translate ? translate("List-Info-A1") : "Underage";
  if (edad >= 65) return translate ? translate("List-Info-A2") : "Elderly";
  return translate ? translate("List-Info-A3") : "Adult";
};
const renderValue = (value) => {
  if (value === void 0 || value === null || value === "") {
    return "N/A";
  }
  return String(value);
};
const formatCedula = (item) => {
  return `${item.extranjero}-${item.cedula}`;
};

export { getAgeStage as a, formatCedula as f, getLegalCondition as g, renderValue as r };
