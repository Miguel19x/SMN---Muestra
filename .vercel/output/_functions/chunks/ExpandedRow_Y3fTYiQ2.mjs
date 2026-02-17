import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React__default, { useState, useCallback } from 'react';
import { b as TableRow, e as TableCell } from './Pagination_Biy3-Yvx.mjs';
import { B as Button } from './input_DaDLUbK_.mjs';
import { useQuery, useMutation } from '@tanstack/react-query';
import { a as useLanguage } from './i18n_BgOPVVWt.mjs';

function sanitizeImageUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return null;
  }
  try {
    const lowerUrl = trimmedUrl.toLowerCase();
    if (lowerUrl.startsWith("javascript:")) {
      console.warn("Blocked javascript: protocol in image URL");
      return null;
    }
    if (lowerUrl.startsWith("vbscript:")) {
      console.warn("Blocked vbscript: protocol in image URL");
      return null;
    }
    if (lowerUrl.startsWith("data:")) {
      if (!lowerUrl.startsWith("data:image/")) {
        console.warn("Blocked non-image data URL");
        return null;
      }
      return trimmedUrl;
    }
    const dangerousProtocols = ["file:", "about:"];
    if (dangerousProtocols.some((protocol) => lowerUrl.startsWith(protocol))) {
      console.warn("Blocked dangerous protocol in image URL");
      return null;
    }
    const urlObj = new URL(trimmedUrl, window.location.origin);
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      console.warn(`Blocked unsupported protocol: ${urlObj.protocol}`);
      return null;
    }
    return trimmedUrl;
  } catch (error) {
    if (!trimmedUrl.includes(":")) {
      if (trimmedUrl.includes("<script") || trimmedUrl.includes("javascript:")) {
        console.warn("Blocked potential XSS in relative URL");
        return null;
      }
      return trimmedUrl;
    }
    console.warn("Invalid URL format:", error);
    return null;
  }
}

const ExpandedRow = ({ item, getAntiguedadStage, getCondicionEstado, renderValue }) => {
  const { translate } = useLanguage();
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [removalReason, setRemovalReason] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { data: details, isLoading, error } = useQuery({
    queryKey: ["objeto", item.id],
    queryFn: () => fetch(`/api/inventario/${item.id}`).then((res) => res.json()),
    enabled: !!item.id,
    staleTime: Infinity
  });
  const removalMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/removal-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al enviar solicitud");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitSuccess(true);
      setRemovalReason("");
      setEvidenceUrl("");
      setTimeout(() => {
        setShowRemovalModal(false);
        setSubmitSuccess(false);
      }, 3e3);
    }
  });
  const handleSubmitRemoval = useCallback((e) => {
    e.preventDefault();
    if (!removalReason.trim()) return;
    removalMutation.mutate({
      objeto_id: item.id || "",
      reason: removalReason,
      evidence_url: evidenceUrl || void 0
    });
  }, [removalReason, evidenceUrl, item.id, removalMutation]);
  if (isLoading) {
    return /* @__PURE__ */ jsx(TableRow, { className: "bg-muted", children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, children: /* @__PURE__ */ jsx("div", { className: "p-4 text-center", children: translate("Process2") }) }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx(TableRow, { className: "bg-muted", children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, children: /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-red-500", children: translate("Error") }) }) });
  }
  if (!details) {
    return /* @__PURE__ */ jsx(TableRow, { className: "bg-muted", children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, children: /* @__PURE__ */ jsx("div", { className: "p-4 text-center", children: translate("Error") }) }) });
  }
  const antiguedadStage = getAntiguedadStage(details.antiguedad);
  const condicionEstado = getCondicionEstado(details.antiguedad);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(TableRow, { className: "bg-muted", children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4 text-center", children: translate("List-Info-Add") }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: translate("List-Info-Gender") }),
            " ",
            renderValue(details.categoria),
            " ",
            antiguedadStage && `(${antiguedadStage})`
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: translate("List-Info-Age") }),
            " ",
            details.antiguedad ? `${details.antiguedad} ${translate("List-Info-Yo")}` : "N/A",
            " (",
            condicionEstado,
            ")"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: translate("List-Info-P") }),
            " ",
            renderValue(details.tipo_objeto)
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: translate("List-Info-N") }),
            " ",
            renderValue(details.pais_origen || (details.origen === "N" ? translate("Form-NV") : "N/A"))
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: translate("List-Info-H") }),
            " ",
            renderValue(details.condicion)
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: translate("List-Info-D") }),
            " ",
            renderValue(details.estado_conservacion)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: translate("List-Info-PC") }),
            " ",
            renderValue(details.ubicacion_actual)
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: translate("List-Info-Pd") }),
            " ",
            renderValue(details.ultimo_lugar_conocido)
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: translate("List-Info-Dd") }),
            " ",
            renderValue(details.fecha_registro)
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: translate("List-Info-Dt") }),
            " ",
            details.hora_registro ? `${details.hora_registro}hs` : "N/A"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: translate("List-Info-E") }),
            " ",
            renderValue(details.clasificacion)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center items-center space-y-2", children: [
          /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs("strong", { children: [
            translate("List-Info-I"),
            ":"
          ] }) }),
          details.imagen ? (() => {
            const sanitizedUrl = sanitizeImageUrl(details.imagen);
            return sanitizedUrl ? /* @__PURE__ */ jsx(
              "img",
              {
                src: sanitizedUrl,
                alt: translate("List-Info-I"),
                width: 300,
                height: 300,
                className: "max-w-full h-auto rounded-lg shadow-md"
              }
            ) : /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: translate("List-Info-Ierror") });
          })() : /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: translate("List-Info-Ierror") }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setShowRemovalModal(true),
              className: "mt-4 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
              children: translate("B-RequestRemoval")
            }
          )
        ] })
      ] })
    ] }) }) }),
    showRemovalModal && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", onClick: () => setShowRemovalModal(false), children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl",
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-4", children: translate("Removal-Title") }),
          submitSuccess ? /* @__PURE__ */ jsxs("div", { className: "text-green-600 dark:text-green-400 text-center py-4", children: [
            "✓ ",
            translate("Removal-Success")
          ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmitRemoval, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium mb-1", children: [
                translate("Removal-Reason"),
                " *"
              ] }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: removalReason,
                  onChange: (e) => setRemovalReason(e.target.value),
                  className: "w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600",
                  rows: 4,
                  required: true,
                  placeholder: translate("Removal-Reason")
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: translate("Removal-Evidence") }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "url",
                  value: evidenceUrl,
                  onChange: (e) => setEvidenceUrl(e.target.value),
                  className: "w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600",
                  placeholder: "https://..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setShowRemovalModal(false),
                  children: "Cancelar"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "submit",
                  disabled: removalMutation.isPending || !removalReason.trim(),
                  className: "bg-red-600 hover:bg-red-700 text-white",
                  children: removalMutation.isPending ? "..." : translate("Removal-Submit")
                }
              )
            ] }),
            removalMutation.isError && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm", children: removalMutation.error?.message || "Error al enviar" })
          ] })
        ]
      }
    ) }) }) })
  ] });
};
const ExpandedRow_default = React__default.memo(ExpandedRow);

export { ExpandedRow_default as default };
