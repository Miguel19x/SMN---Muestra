import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CJfq-tyP.mjs';
import { $ as $$Layout } from '../chunks/Layout_BnVrAAn4.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { u as useToast } from '../chunks/use-toast_DpGr9H6u.mjs';
import { c as cn, I as Input, B as Button } from '../chunks/input_DaDLUbK_.mjs';
import { L as Label, I as ImageUpload } from '../chunks/ImageUpload_D2axDyxI.mjs';
import { u as useLanguage, L as LanguageProvider, a as useTranslation } from '../chunks/i18n_Bd6mPn--.mjs';
import { u as useFormValidation } from '../chunks/validation_BR3u-NN6.mjs';
import Cookies from 'js-cookie';
/* empty css                                        */
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
  const [cedulaInput, setCedulaInput] = useState(formData.cedula || "");
  useEffect(() => {
    if (formData.extranjero === "V") {
      onChange("nacionalidad", "Venezolana");
    } else if (formData.extranjero === "E" && formData.nacionalidad === "Venezolana") {
      onChange("nacionalidad", "");
    }
  }, [formData.extranjero]);
  const handleCedulaChange = (e) => {
    let value = e.target.value.replace(/\./g, "");
    if (formData.extranjero === "V") {
      value = value.replace(/\D/g, "");
      if (value.length > 8) value = value.slice(0, 8);
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    setCedulaInput(value);
    onChange("cedula", value);
  };
  const handleCedulaKeyDown = (e) => {
    if (formData.extranjero === "V" && e.key === ".") {
      e.preventDefault();
    }
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
        /* @__PURE__ */ jsx(Label, { htmlFor: "cedula", children: translate("Form-ID") }),
        /* @__PURE__ */ jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsxs(
            NativeSelect,
            {
              name: "extranjero",
              id: "extranjero",
              value: formData.extranjero,
              onChange: (e) => onChange("extranjero", e.target.value),
              className: "w-[60px]",
              children: [
                /* @__PURE__ */ jsx("option", { value: "V", children: "V" }),
                /* @__PURE__ */ jsx("option", { value: "E", children: "E" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              name: "cedula",
              value: cedulaInput,
              onChange: handleCedulaChange,
              onKeyDown: handleCedulaKeyDown,
              className: cn("flex-grow ml-2", errors.cedula && "border-red-500"),
              "aria-invalid": errors.cedula ? "true" : "false",
              "aria-describedby": "cedula-error"
            }
          )
        ] }),
        errors.cedula && /* @__PURE__ */ jsx("p", { id: "cedula-error", className: "text-red-500 text-sm mt-1", role: "alert", children: errors.cedula })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "nacionalidad", children: translate("Form-N") }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            id: "nacionalidad",
            name: "nacionalidad",
            value: formData.nacionalidad || "",
            onChange: (e) => onChange("nacionalidad", e.target.value),
            className: cn(errors.nacionalidad && "border-red-500"),
            "aria-invalid": errors.nacionalidad ? "true" : "false",
            "aria-describedby": "nacionalidad-error",
            disabled: formData.extranjero === "V"
          }
        ),
        errors.nacionalidad && /* @__PURE__ */ jsx("p", { id: "nacionalidad-error", className: "text-red-500 text-sm mt-1", role: "alert", children: errors.nacionalidad })
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
          if (name === "edad") {
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
      /* @__PURE__ */ jsx("div", { className: "sm:col-span-1", children: renderInput("edad", "Form-A", "text", "0", "125") }),
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-1 md:col-span-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "sexo", children: translate("Form-G") }),
        /* @__PURE__ */ jsxs(
          NativeSelect,
          {
            name: "sexo",
            id: "sexo",
            onChange: (e) => onChange("sexo", e.target.value),
            placeholder: translate("Form-GS"),
            className: "w-full",
            defaultValue: "",
            children: [
              /* @__PURE__ */ jsx("option", { value: "Masculino", children: translate("Form-GS-M") }),
              /* @__PURE__ */ jsx("option", { value: "Femenino", children: translate("Form-GS-F") })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 md:col-span-3", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "estado", children: translate("Form-L") }),
        /* @__PURE__ */ jsx(
          NativeSelect,
          {
            name: "estado",
            id: "estado",
            onChange: (e) => onChange("estado", e.target.value),
            placeholder: translate("Form-LS"),
            className: "w-full",
            defaultValue: "",
            children: estadosVenezuela.map((estado) => /* @__PURE__ */ jsx("option", { value: estado, children: estado }, estado))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
      renderInput("profesion", "Form-P"),
      renderInput("etnia", "Form-E")
    ] }),
    renderInput("condicion_de_salud", "Form-HC"),
    renderInput("discapacidad", "Form-D"),
    renderInput("lugar_de_confinamiento", "Form-PlaceC"),
    renderInput("lugar_de_desaparicion", "Form-LD"),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
      renderInput("fecha", "Form-DD", "date", "2010-01-01", currentDate),
      renderInput("hora", "Form-DT", "time")
    ] })
  ] });
}

function UploadEngineContent() {
  const { t: translate} = useTranslation();
  const { validateForm } = useFormValidation();
  const [formData, setFormData] = useState({
    extranjero: "V",
    cedula: "",
    nombre: "",
    nacionalidad: "Venezolana",
    estado_registro: "pendiente",
    etiqueta: "blue",
    imagen: ""
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
      if (name === "extranjero") {
        newData.nacionalidad = value === "V" ? "Venezolana" : "";
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
      const response = await fetch("/api/desaparecidos", {
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
        extranjero: "V",
        cedula: "",
        nombre: "",
        nacionalidad: "Venezolana",
        etiqueta: "blue",
        estado_registro: "pendiente",
        imagen: ""
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Subir Informaci\xF3n" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ConsentModal", ConsentModal, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/components/additionals/ConsentModal.tsx", "client:component-export": "default" })} ${maybeRenderHead()}<div style="height: 60px;"></div> ${renderComponent($$result2, "UploadEngine", UploadEngine, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/components/UploadEngine.tsx", "client:component-export": "default" })} <div style="height: 60px;"></div> ` })}`;
}, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/pages/subir-informacion.astro", void 0);

const $$file = "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/pages/subir-informacion.astro";
const $$url = "/subir-informacion";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$SubirInformacion,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
