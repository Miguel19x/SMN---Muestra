import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { f as fetchDesaparecidoDetails } from './panel-admin_wuY-xICF.mjs';
import { B as Button, I as Input, c as cn } from './input_DaDLUbK_.mjs';
import { L as Label, I as ImageUpload } from './ImageUpload_D2axDyxI.mjs';
import { S as Select, f as SelectTrigger, g as SelectValue, h as SelectContent, i as SelectItem } from './Pagination_Dzmz6ytF.mjs';
import { u as useFormValidation } from './validation_BR3u-NN6.mjs';
import { a as useTranslation } from './i18n_Bd6mPn--.mjs';

function Component({
  item,
  getAgeStage,
  getLegalCondition,
  renderValue,
  isEditing,
  editedData,
  onInputChange,
  errors,
  setErrors,
  onImageDelete
}) {
  const { t } = useTranslation();
  const { validateForm } = useFormValidation();
  const [localDetails, setLocalDetails] = useState(null);
  const [resetImage, setResetImage] = useState(false);
  const { data: details, isLoading, error } = useQuery({
    queryKey: ["desaparecido", item._id],
    queryFn: () => fetchDesaparecidoDetails(item._id),
    enabled: !!item._id,
    staleTime: 0
  });
  useEffect(() => {
    if (details) {
      setLocalDetails(details);
    }
  }, [details]);
  useEffect(() => {
    if (editedData) {
      setLocalDetails((prevDetails) => ({ ...prevDetails, ...editedData }));
    }
  }, [editedData]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onInputChange(e);
    const newErrors = validateForm({ ...localDetails, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] || "" }));
  };
  const handleSelectChange = (name, value) => {
    onInputChange({ target: { name, value } });
  };
  const handleImageChange = async (name, value) => {
    if (value) {
      try {
        const response = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: value })
        });
        if (!response.ok) {
          throw new Error("Failed to upload image to R2");
        }
        const { url } = await response.json();
        onInputChange({ target: { name, value: url } });
      } catch (error2) {
        console.error("Error uploading image:", error2);
      }
    } else {
      onInputChange({ target: { name, value } });
    }
  };
  const handleRemoveImage = () => {
    if (editedData?.imagen) {
      onImageDelete(editedData.imagen);
    }
    handleImageChange("imagen", null);
    setResetImage(true);
  };
  const renderEditableField = (name, label, type = "text", value, additionalInfo) => {
    if (isEditing) {
      if (name === "sexo") {
        return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: name, className: "dark:text-gray-200", children: [
            t(label),
            " ",
            additionalInfo && `(${additionalInfo})`
          ] }),
          /* @__PURE__ */ jsxs(Select, { name, onValueChange: (value2) => handleSelectChange(name, value2), value: editedData?.[name], children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: name, className: "w-full dark:bg-gray-700 dark:text-gray-200", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("Form-GS") }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "Masculino", children: t("Form-GS-M") }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Femenino", children: t("Form-GS-F") })
            ] })
          ] })
        ] });
      } else if (name === "imagen") {
        return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: name, className: "dark:text-gray-200", children: t(label) }),
          editedData?.imagen ? /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("img", { src: editedData.imagen, alt: "Imagen actual", className: "w-20 h-20 object-cover rounded" }),
            /* @__PURE__ */ jsx(Button, { onClick: handleRemoveImage, variant: "destructive", children: t("B-Delete") })
          ] }) : /* @__PURE__ */ jsx(ImageUpload, { onChange: handleImageChange, resetImage })
        ] });
      } else {
        return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: name, className: "dark:text-gray-200", children: [
            t(label),
            " ",
            additionalInfo && `(${additionalInfo})`
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type,
              id: name,
              name,
              value: editedData?.[name] || "",
              onChange: handleInputChange,
              className: cn(errors[name] && "border-red-500", "dark:bg-gray-700 dark:text-gray-200"),
              "aria-invalid": errors[name] ? "true" : "false",
              "aria-describedby": `${name}-error`,
              max: type === "date" ? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : void 0
            }
          ),
          errors[name] && /* @__PURE__ */ jsx("p", { id: `${name}-error`, className: "text-red-500 text-sm mt-1", role: "alert", children: errors[name] })
        ] });
      }
    }
    return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("span", { className: "font-medium dark:text-gray-200", children: [
        t(label),
        ":"
      ] }),
      name === "imagen" && value ? /* @__PURE__ */ jsx("img", { src: value, alt: t(label), className: "w-300 h-300 object-cover rounded" }) : /* @__PURE__ */ jsxs("p", { className: "text-gray-700 dark:text-gray-300", children: [
        renderValue(value?.toString()),
        " ",
        additionalInfo && `(${additionalInfo})`
      ] })
    ] });
  };
  const ageStage = localDetails?.edad !== void 0 ? getAgeStage(localDetails.edad) : "N/A";
  const legalCondition = localDetails?.edad !== void 0 ? getLegalCondition(localDetails.edad) : "N/A";
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "p-4 text-center", children: t("Process2") });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-red-500", children: t("Error") });
  }
  if (!localDetails) {
    return /* @__PURE__ */ jsx("div", { className: "p-4 text-center", children: t("Error") });
  }
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 dark:bg-gray-800 dark:text-gray-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      renderEditableField("sexo", "Form-G", "text", editedData?.sexo || localDetails.sexo, t(ageStage)),
      renderEditableField("edad", "Form-A", "number", editedData?.edad || localDetails.edad, t(legalCondition)),
      renderEditableField("profesion", "Form-P", "text", editedData?.profesion || localDetails.profesion),
      renderEditableField("nacionalidad", "Form-N", "text", editedData?.nacionalidad || localDetails.nacionalidad || (localDetails.extranjero === "V" ? t("Form-NV") : "N/A")),
      renderEditableField("condicion_de_salud", "Form-HC", "text", editedData?.condicion_de_salud || localDetails.condicion_de_salud),
      renderEditableField("discapacidad", "Form-D", "text", editedData?.discapacidad || localDetails.discapacidad)
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      renderEditableField("lugar_de_confinamiento", "Form-PlaceC", "text", editedData?.lugar_de_confinamiento || localDetails.lugar_de_confinamiento),
      renderEditableField("lugar_de_desaparicion", "Form-LD", "text", editedData?.lugar_de_desaparicion || localDetails.lugar_de_desaparicion),
      renderEditableField("fecha", "Form-DD", "date", editedData?.fecha || localDetails.fecha),
      renderEditableField("hora", "Form-DT", "time", editedData?.hora || localDetails.hora),
      renderEditableField("etnia", "Form-E", "text", editedData?.etnia || localDetails.etnia)
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center", children: renderEditableField("imagen", "List-Info-I", "text", editedData?.imagen || localDetails.imagen) })
  ] });
}

export { Component as default };
