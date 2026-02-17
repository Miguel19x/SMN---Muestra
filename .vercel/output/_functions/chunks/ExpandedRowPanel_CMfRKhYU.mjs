import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { f as fetchDesaparecidoDetails } from './panel-admin_DIpdP6ik.mjs';
import { B as Button, I as Input, c as cn } from './input_DaDLUbK_.mjs';
import { L as Label, I as ImageUpload } from './ImageUpload_DzIqdJ8q.mjs';
import { S as Select, f as SelectTrigger, g as SelectValue, h as SelectContent, i as SelectItem } from './Pagination_Biy3-Yvx.mjs';
import { u as useFormValidation } from './validation_BQIB1yMo.mjs';
import { u as useTranslation } from './i18n_BgOPVVWt.mjs';

function Component({
  item,
  getAntiguedadStage,
  getCondicionEstado,
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
    queryKey: ["objeto", item.id],
    queryFn: () => fetchDesaparecidoDetails(item.id),
    enabled: !!item.id,
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
      if (name === "categoria") {
        return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: name, className: "dark:text-gray-200", children: [
            t(label),
            " ",
            additionalInfo && `(${additionalInfo})`
          ] }),
          /* @__PURE__ */ jsxs(Select, { name, onValueChange: (value2) => handleSelectChange(name, value2), value: editedData?.[name], children: [
            /* @__PURE__ */ jsx(SelectTrigger, { id: name, className: "w-full dark:bg-gray-700 dark:text-gray-200", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("Form-GS") }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "Tipo A", children: "Tipo A" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Tipo B", children: "Tipo B" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Tipo C", children: "Tipo C" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "Tipo D", children: "Tipo D" })
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
  const antiguedadStage = localDetails?.antiguedad !== void 0 ? getAntiguedadStage(localDetails.antiguedad) : "N/A";
  const condicionEstado = localDetails?.antiguedad !== void 0 ? getCondicionEstado(localDetails.antiguedad) : "N/A";
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
      renderEditableField("categoria", "Form-G", "text", editedData?.categoria || localDetails.categoria, t(antiguedadStage)),
      renderEditableField("antiguedad", "Form-A", "number", editedData?.antiguedad || localDetails.antiguedad, t(condicionEstado)),
      renderEditableField("tipo_objeto", "Form-P", "text", editedData?.tipo_objeto || localDetails.tipo_objeto),
      renderEditableField("pais_origen", "Form-N", "text", editedData?.pais_origen || localDetails.pais_origen || (localDetails.origen === "N" ? t("Form-NV") : "N/A")),
      renderEditableField("condicion", "Form-HC", "text", editedData?.condicion || localDetails.condicion),
      renderEditableField("estado_conservacion", "Form-D", "text", editedData?.estado_conservacion || localDetails.estado_conservacion)
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      renderEditableField("ubicacion_actual", "Form-PlaceC", "text", editedData?.ubicacion_actual || localDetails.ubicacion_actual),
      renderEditableField("ultimo_lugar_conocido", "Form-LD", "text", editedData?.ultimo_lugar_conocido || localDetails.ultimo_lugar_conocido),
      renderEditableField("fecha_registro", "Form-DD", "date", editedData?.fecha_registro || localDetails.fecha_registro),
      renderEditableField("hora_registro", "Form-DT", "time", editedData?.hora_registro || localDetails.hora_registro),
      renderEditableField("clasificacion", "Form-E", "text", editedData?.clasificacion || localDetails.clasificacion)
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center", children: renderEditableField("imagen", "List-Info-I", "text", editedData?.imagen || localDetails.imagen) })
  ] });
}

export { Component as default };
