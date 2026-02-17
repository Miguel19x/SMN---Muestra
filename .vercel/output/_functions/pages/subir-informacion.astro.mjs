import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D0FKrmaD.mjs';
import { a as useLanguage, L as LanguageProvider, u as useTranslation, $ as $$Layout } from '../chunks/i18n_BgOPVVWt.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { u as useToast } from '../chunks/use-toast_DpGr9H6u.mjs';
import { c as cn, I as Input, B as Button } from '../chunks/input_DaDLUbK_.mjs';
import { L as Label, I as ImageUpload } from '../chunks/ImageUpload_DzIqdJ8q.mjs';
import { u as useFormValidation } from '../chunks/validation_BQIB1yMo.mjs';
import Cookies from 'js-cookie';
/* empty css                                      */
export { renderers } from '../renderers.mjs';

const NativeSelect = React.forwardRef(
  ({ className, children, placeholder, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "select",
      {
        className: cn(
          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-background [&>option]:text-foreground",
          className
        ),
        ref,
        ...props,
        children: [
          placeholder && /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: placeholder }),
          children
        ]
      }
    );
  }
);
NativeSelect.displayName = "NativeSelect";

function PersonalInfoForm({ formData, errors, onChange }) {
  const { translate } = useLanguage();
  const [codigoInput, setCodigoInput] = useState(formData.codigo || "");
  useEffect(() => {
    setCodigoInput(formData.codigo || "");
  }, [formData.codigo]);
  useEffect(() => {
    if (formData.origen === "N") {
      onChange("pais_origen", "Nacional");
    } else if (formData.origen === "I" && formData.pais_origen === "Nacional") {
      onChange("pais_origen", "");
    }
  }, [formData.origen]);
  const handleCodigoChange = (e) => {
    let value = e.target.value;
    if (formData.origen === "N") {
      value = value.replace(/[^A-Za-z0-9\-]/g, "").toUpperCase();
      if (value.length > 20) value = value.slice(0, 20);
    } else {
      value = value.replace(/[^A-Za-z0-9\-_.]/g, "");
    }
    setCodigoInput(value);
    onChange("codigo", value);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "nombre", children: translate("Form-Name") }),
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "text",
          id: "nombre",
          name: "nombre",
          value: formData.nombre,
          onChange: (e) => onChange("nombre", e.target.value),
          required: true,
          className: cn(errors.nombre && "border-red-500"),
          "aria-invalid": errors.nombre ? "true" : "false",
          "aria-describedby": "nombre-error"
        }
      ),
      errors.nombre && /* @__PURE__ */ jsx("p", { id: "nombre-error", className: "text-red-500 text-sm mt-1", role: "alert", children: errors.nombre })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "codigo", children: translate("Form-ID") }),
        /* @__PURE__ */ jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsxs(
            NativeSelect,
            {
              name: "origen",
              id: "origen",
              value: formData.origen,
              onChange: (e) => onChange("origen", e.target.value),
              className: "w-[60px]",
              children: [
                /* @__PURE__ */ jsx("option", { value: "N", children: "N" }),
                /* @__PURE__ */ jsx("option", { value: "I", children: "I" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              name: "codigo",
              value: codigoInput,
              onChange: handleCodigoChange,
              className: cn("flex-grow ml-2", errors.codigo && "border-red-500"),
              "aria-invalid": errors.codigo ? "true" : "false",
              "aria-describedby": "codigo-error",
              placeholder: "ABC-12345"
            }
          )
        ] }),
        errors.codigo && /* @__PURE__ */ jsx("p", { id: "codigo-error", className: "text-red-500 text-sm mt-1", role: "alert", children: errors.codigo })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "pais_origen", children: translate("Form-N") }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            id: "pais_origen",
            name: "pais_origen",
            value: formData.pais_origen || "",
            onChange: (e) => onChange("pais_origen", e.target.value),
            className: cn(errors.pais_origen && "border-red-500"),
            "aria-invalid": errors.pais_origen ? "true" : "false",
            "aria-describedby": "pais_origen-error",
            disabled: formData.origen === "N"
          }
        ),
        errors.pais_origen && /* @__PURE__ */ jsx("p", { id: "pais_origen-error", className: "text-red-500 text-sm mt-1", role: "alert", children: errors.pais_origen })
      ] })
    ] })
  ] });
}

const estadosVenezuela = [
  "Distrito Capital",
  "Amazonas",
  "Anzoátegui",
  "Apure",
  "Aragua",
  "Barinas",
  "Bolívar",
  "Carabobo",
  "Cojedes",
  "Delta Amacuro",
  "Falcón",
  "Guárico",
  "Lara",
  "Mérida",
  "Miranda",
  "Monagas",
  "Nueva Esparta",
  "Portuguesa",
  "Sucre",
  "Táchira",
  "Trujillo",
  "Vargas",
  "Yaracuy",
  "Zulia"
];
const CATEGORIAS = ["Tipo A", "Tipo B", "Tipo C", "Tipo D"];
const CLASIFICACIONES = ["Clase A", "Clase B", "Clase C", "Clase D"];
function TagPills({ options, selected, onChange, label }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Label, { children: label }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-1.5", children: options.map((option) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(option),
        className: cn(
          "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
          "hover:scale-105 active:scale-95",
          selected === option ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25" : "bg-gray-800/50 text-gray-300 border-gray-600/50 hover:border-blue-400/50 hover:text-white"
        ),
        children: option
      },
      option
    )) })
  ] });
}
function AdditionalInfoForm({ formData, errors, onChange }) {
  const { translate } = useLanguage();
  const renderInput = (name, translationKey, type = "text", min, max) => /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: name, children: translate(translationKey) }),
    /* @__PURE__ */ jsx(
      Input,
      {
        type,
        id: name,
        name,
        value: formData[name] || "",
        onChange: (e) => {
          if (name === "antiguedad") {
            const value = e.target.value.replace(/\D/g, "");
            onChange(name, value);
          } else {
            onChange(name, e.target.value);
          }
        },
        className: cn(errors[name] && "border-red-500"),
        "aria-invalid": errors[name] ? "true" : "false",
        "aria-describedby": `${name}-error`,
        min,
        max
      }
    ),
    errors[name] && /* @__PURE__ */ jsx("p", { id: `${name}-error`, className: "text-red-500 text-sm mt-1", role: "alert", children: errors[name] })
  ] }, name);
  const currentDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "sm:col-span-1", children: renderInput("antiguedad", "Form-A", "text", "0", "200") }),
      /* @__PURE__ */ jsx("div", { className: "sm:col-span-1 md:col-span-2", children: /* @__PURE__ */ jsx(
        TagPills,
        {
          options: CATEGORIAS,
          selected: formData.categoria || "",
          onChange: (val) => onChange("categoria", val),
          label: translate("Form-G")
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 md:col-span-3", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "estado", children: translate("Form-L") }),
        /* @__PURE__ */ jsxs(
          NativeSelect,
          {
            name: "estado",
            id: "estado",
            value: formData.estado || "",
            onChange: (e) => onChange("estado", e.target.value),
            placeholder: translate("Form-LS"),
            className: "w-full",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un estado" }),
              estadosVenezuela.map((estado) => /* @__PURE__ */ jsx("option", { value: estado, children: estado }, estado))
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
      renderInput("tipo_objeto", "Form-P"),
      /* @__PURE__ */ jsx(
        TagPills,
        {
          options: CLASIFICACIONES,
          selected: formData.clasificacion || "",
          onChange: (val) => onChange("clasificacion", val),
          label: translate("Form-E")
        }
      )
    ] }),
    renderInput("condicion", "Form-HC"),
    renderInput("estado_conservacion", "Form-D"),
    renderInput("ubicacion_actual", "Form-PlaceC"),
    renderInput("ultimo_lugar_conocido", "Form-LD"),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
      renderInput("fecha_registro", "Form-DD", "date", "2010-01-01", currentDate),
      renderInput("hora_registro", "Form-DT", "time")
    ] })
  ] });
}

function UploadEngineContent() {
  const { t: translate} = useTranslation();
  const { validateForm } = useFormValidation();
  const [formData, setFormData] = useState({
    origen: "N",
    codigo: "",
    nombre: "",
    pais_origen: "Nacional",
    estado_registro: "pendiente",
    etiqueta: "blue",
    imagen: "",
    estado: "",
    categoria: "",
    antiguedad: void 0,
    fecha_registro: "",
    hora_registro: "",
    tipo_objeto: "",
    clasificacion: "",
    condicion: "",
    estado_conservacion: "",
    ubicacion_actual: "",
    ultimo_lugar_conocido: ""
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetImage, setResetImage] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const { toast } = useToast();
  const turnstileRef = useRef(null);
  const turnstileWidgetId = useRef(null);
  const handleChange = useCallback((name, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "origen") {
        newData.pais_origen = value === "N" ? "Nacional" : "";
      }
      return newData;
    });
  }, []);
  const onCaptchaVerify = useCallback((token) => {
    setCaptchaToken(token);
  }, []);
  useEffect(() => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0 && formData.nombre.trim() !== "");
  }, [formData, validateForm]);
  useEffect(() => {
    let intervalId;
    const initTurnstile = () => {
      if (typeof window !== "undefined" && window.turnstile && turnstileRef.current) {
        if (turnstileWidgetId.current) {
          window.turnstile.remove(turnstileWidgetId.current);
        }
        turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: "0x4AAAAAAAzKBhv-4rkZ0cjz",
          callback: onCaptchaVerify
        });
        clearInterval(intervalId);
      }
    };
    initTurnstile();
    if (!turnstileWidgetId.current) {
      intervalId = setInterval(initTurnstile, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
      }
    };
  }, [onCaptchaVerify]);
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting || !captchaToken) return;
    setIsSubmitting(true);
    try {
      let finalImageUrl = "";
      if (formData.imagen) {
        const uploadResponse = await fetch("/api/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-App-Token": undefined                                
          },
          body: JSON.stringify({ key: formData.imagen })
        });
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image to R2");
        }
        const { url } = await uploadResponse.json();
        finalImageUrl = url;
      }
      const dataToSubmit = {
        ...formData,
        imagen: finalImageUrl,
        captchaToken
      };
      const response = await fetch("/api/inventario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Token": undefined                                
        },
        body: JSON.stringify(dataToSubmit)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error desconocido");
      }
      const result = await response.json();
      toast({ title: "Éxito", description: result.message || "Información subida correctamente" });
      setFormData({
        origen: "N",
        codigo: "",
        nombre: "",
        pais_origen: "Nacional",
        etiqueta: "blue",
        estado_registro: "pendiente",
        imagen: "",
        estado: "",
        categoria: "",
        antiguedad: void 0,
        fecha_registro: "",
        hora_registro: "",
        tipo_objeto: "",
        clasificacion: "",
        condicion: "",
        estado_conservacion: "",
        ubicacion_actual: "",
        ultimo_lugar_conocido: ""
      });
      setErrors({});
      setResetImage((prev) => !prev);
      setCaptchaToken(null);
      if (formData.imagen) {
        await fetch("/api/delete-cached-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: formData.imagen })
        });
      }
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
    } catch (error) {
      console.error("Error al subir la información:", error);
      const errorMessage = error instanceof Error ? error.message : "Hubo un problema al subir la información. Por favor, intente de nuevo.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isFormValid, captchaToken, toast]);
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 w-full max-w-xl mx-auto px-4 sm:px-6 md:px-8", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4 text-center", children: translate("Title-3") }),
    /* @__PURE__ */ jsx(PersonalInfoForm, { formData, errors, onChange: handleChange }),
    /* @__PURE__ */ jsx(AdditionalInfoForm, { formData, errors, onChange: handleChange }),
    /* @__PURE__ */ jsx(ImageUpload, { onChange: handleChange, resetImage }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-4 mt-6", children: [
      /* @__PURE__ */ jsx("div", { ref: turnstileRef, className: "w-full h-[50px]" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          className: "bg-blue-800 hover:bg-blue-700 w-full sm:w-auto text-white mt-4",
          disabled: !isFormValid || isSubmitting || !captchaToken,
          children: isSubmitting ? translate("Process1") : translate("B-Upload")
        }
      )
    ] })
  ] });
}
function UploadEngine() {
  return /* @__PURE__ */ jsx(LanguageProvider, { children: /* @__PURE__ */ jsx(UploadEngineContent, {}) });
}

function ConsentModalContent() {
  const [isOpen, setIsOpen] = useState(false);
  const { translate } = useLanguage();
  useEffect(() => {
    const hasConsented = Cookies.get("userConsent");
    if (!hasConsented) {
      setIsOpen(true);
    }
  }, []);
  const handleAccept = () => {
    Cookies.set("userConsent", "true");
    setIsOpen(false);
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-5 text-center text-gray-600 dark:text-gray-300", children: translate("Subtitle-4") }),
    /* @__PURE__ */ jsx("p", { className: "mb-5 text-sm text-justify text-gray-600 dark:text-gray-300", children: translate("Paragraph-5") }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleAccept,
        className: "w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors",
        children: translate("B-Accept")
      }
    )
  ] }) });
}
function ConsentModal() {
  return /* @__PURE__ */ jsx(LanguageProvider, { children: /* @__PURE__ */ jsx(ConsentModalContent, {}) });
}

const $$SubirInformacion = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "DataTracker - Registrar" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ConsentModal", ConsentModal, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/additionals/ConsentModal.tsx", "client:component-export": "default" })} ${maybeRenderHead()}<div style="height: 60px;"></div> ${renderComponent($$result2, "UploadEngine", UploadEngine, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/UploadEngine.tsx", "client:component-export": "default" })} <div style="height: 60px;"></div> ` })}`;
}, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/pages/subir-informacion.astro", void 0);

const $$file = "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/pages/subir-informacion.astro";
const $$url = "/subir-informacion";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$SubirInformacion,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
