import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from './astro/server_D0FKrmaD.mjs';
import { u as useTranslation, a as useLanguage, L as LanguageProvider, $ as $$Layout } from './i18n_BgOPVVWt.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React__default, { useState, useEffect, useCallback, Suspense } from 'react';
import { useQueryClient, useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, S as Select, f as SelectTrigger, g as SelectValue, h as SelectContent, i as SelectItem, D as Dialog, j as DialogContent, k as DialogHeader, l as DialogTitle, m as DialogDescription, n as DialogFooter, u as useFetchData, o as useFilteredData, p as SearchBar, q as SearchFieldSelector, E as ErrorBoundary, P as Pagination, r as getCondicionEstado, s as getAntiguedadStage, t as formatCodigo, v as renderValue } from './Pagination_Biy3-Yvx.mjs';
import { B as Button, I as Input } from './input_DaDLUbK_.mjs';
import { u as useToast } from './use-toast_DpGr9H6u.mjs';
import { Save, X, Edit, Check, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { u as useFormValidation } from './validation_BQIB1yMo.mjs';
import { motion, AnimatePresence } from 'framer-motion';
/* empty css                              */
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { U as UserRepository } from './user-repository_C06Cq5l3.mjs';
import { c as connectDB } from './mongodb_Kr9SiWRo.mjs';
import '../renderers.mjs';

async function updateObjeto(id, data) {
  const response = await fetch(`/api/inventario/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al actualizar la información");
  }
}
async function acceptObjeto(id) {
  const response = await fetch(`/api/inventario/${id}/accept`, {
    method: "POST"
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al aceptar la información");
  }
}
async function rejectObjeto(id) {
  const response = await fetch(`/api/inventario/${id}/reject`, {
    method: "POST"
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al rechazar la información");
  }
}
async function fetchObjetoDetails(id) {
  const response = await fetch(`/api/inventario/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch objeto details");
  }
  return response.json();
}
const updateDesaparecido = updateObjeto;
const acceptDesaparecido = acceptObjeto;
const rejectDesaparecido = rejectObjeto;
const fetchDesaparecidoDetails = fetchObjetoDetails;

const ExpandedRowPanel = React__default.lazy(() => import('./ExpandedRowPanel_CMfRKhYU.mjs'));
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
function PanelTable({
  data,
  renderValue,
  getAntiguedadStage,
  getCondicionEstado,
  refetch,
  onAccept,
  onReject,
  filterTag
}) {
  const { t } = useTranslation();
  const { validateForm } = useFormValidation();
  const [localData, setLocalData] = useState(data);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const { toast } = useToast();
  useEffect(() => {
    setLocalData(data);
  }, [data]);
  const handleEdit = useCallback((item) => {
    if (item.id) {
      setEditingId(item.id);
      setEditedData(item);
      setErrors({});
    }
  }, []);
  const handleSave = useCallback(async (e) => {
    e.stopPropagation();
    if (!editedData || !editedData._id) return;
    const formErrors = validateForm(editedData);
    if (!editedData.nombre || formErrors.nombre) {
      setErrors({ ...formErrors, nombre: formErrors.nombre || "El nombre es obligatorio" });
      toast({
        title: "Error",
        description: "El nombre es obligatorio y debe ser válido.",
        variant: "destructive"
      });
      return;
    }
    try {
      const dataToUpdate = { ...editedData };
      if (dataToUpdate.codigo === "") {
        delete dataToUpdate.codigo;
      }
      dataToUpdate.origen = dataToUpdate.origen || "N";
      await updateDesaparecido(editedData._id, { ...dataToUpdate, origen: dataToUpdate.origen || "N" });
      for (const imageUrl of imagesToDelete) {
        await deleteImageFromR2(imageUrl);
      }
      toast({ title: "Éxito", description: "Información actualizada correctamente" });
      setLocalData(
        (prevData) => prevData.map((item) => item.id === editedData._id ? { ...item, ...dataToUpdate } : item)
      );
      setEditingId(null);
      setEditedData(null);
      setErrors({});
      setImagesToDelete([]);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema al actualizar la información",
        variant: "destructive"
      });
    }
  }, [editedData, refetch, toast, t, validateForm, imagesToDelete]);
  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditedData(null);
    setErrors({});
  }, []);
  const handleImageDelete = useCallback((imageUrl) => {
    setImagesToDelete((prev) => [...prev, imageUrl]);
  }, []);
  const deleteImageFromR2 = async (imageUrl) => {
    try {
      const response = await fetch("/api/delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ imageUrl })
      });
      if (!response.ok) {
        throw new Error("Failed to delete image from R2");
      }
    } catch (error) {
      console.error("Error deleting image from R2:", error);
    }
  };
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedData((prev) => {
      if (!prev) return null;
      const updatedData = { ...prev, [name]: value };
      return updatedData;
    });
    if (name === "nombre") {
      const newErrors = validateForm({ ...editedData, [name]: value });
      setErrors((prev) => ({ ...prev, nombre: newErrors.nombre || "" }));
    }
  }, [editedData, validateForm]);
  const handleSelectChange = useCallback((name, value) => {
    setEditedData((prev) => {
      if (!prev) return null;
      const updatedData = {
        ...prev,
        [name]: value,
        ...name === "origen" ? { pais_origen: value === "N" ? t("Form-NV") : "" } : {}
      };
      return updatedData;
    });
  }, [t]);
  const handleRemoveCodigo = useCallback(() => {
    setEditedData((prev) => {
      if (!prev) return null;
      const { codigo, ...rest } = prev;
      return rest;
    });
  }, []);
  const toggleRow = (id) => {
    if (id) {
      setExpandedRow((prev) => prev === id ? null : id);
    }
  };
  const renderEditableField = (item, name, value) => {
    if (editingId === item.id) {
      if (name === "origen") {
        return /* @__PURE__ */ jsxs(Select, { name, onValueChange: (value2) => handleSelectChange(name, value2), value: editedData?.[name], children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[50px]", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "N", children: "N" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "I", children: "I" })
          ] })
        ] });
      } else if (name === "estado") {
        return /* @__PURE__ */ jsxs(Select, { name, onValueChange: (value2) => handleSelectChange(name, value2), value: editedData?.[name], children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("Form-LS") }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: estadosVenezuela.map((estado) => /* @__PURE__ */ jsx(SelectItem, { value: estado, children: estado }, estado)) })
        ] });
      } else if (name === "codigo") {
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              name,
              value: editedData?.[name] || "",
              onChange: handleInputChange,
              className: errors[name] ? "border-red-500" : "",
              onClick: (e) => e.stopPropagation()
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: (e) => {
                e.stopPropagation();
                handleRemoveCodigo();
              },
              className: "bg-red-500 hover:bg-red-600 text-white p-2",
              title: "Eliminar código",
              children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] });
      } else {
        return /* @__PURE__ */ jsx(
          Input,
          {
            name,
            value: editedData?.[name] || "",
            onChange: handleInputChange,
            className: errors[name] ? "border-red-500" : "",
            onClick: (e) => e.stopPropagation()
          }
        );
      }
    }
    return renderValue(value);
  };
  const filteredData = filterTag ? localData.filter((item) => item.estado_registro === "pendiente" && item.etiqueta === filterTag) : localData;
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg shadow dark:bg-gray-900", children: /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-gray-100 dark:bg-gray-800", children: [
      /* @__PURE__ */ jsx(TableHead, { className: "w-[1%]" }),
      /* @__PURE__ */ jsx(TableHead, { className: "w-[20%] text-center font-bold dark:text-gray-200", children: t("List-Title-ID") }),
      /* @__PURE__ */ jsx(TableHead, { className: "w-[29%] text-center font-bold dark:text-gray-200", children: t("List-Title-Name") }),
      /* @__PURE__ */ jsx(TableHead, { className: "w-[20%] text-center font-bold dark:text-gray-200", children: t("List-Title-Location") }),
      /* @__PURE__ */ jsx(TableHead, { className: "w-[25%] text-center font-bold dark:text-gray-200", children: t("List-Info-Add") }),
      /* @__PURE__ */ jsx(TableHead, { className: "w-[5%]" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { children: filteredData.map((item, index) => {
      const key = item.id && typeof item.id === "string" && item.id.trim() !== "" ? item.id : `row-fallback-${index}`;
      if (key === "" || key === null || key === void 0) {
        console.error("CRITICAL: Generated empty/null key at index:", index, "item:", item);
      }
      return /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
        /* @__PURE__ */ jsxs(
          motion.tr,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.3 },
            className: `cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${editingId === item.id ? "bg-blue-50 dark:bg-gray-900" : ""} dark:text-gray-200`,
            onClick: () => toggleRow(item.id),
            children: [
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: item.estado_registro === "pendiente" && item.etiqueta && /* @__PURE__ */ jsx("span", { className: `ml-2 px-2 py-1 text-xs font-semibold rounded-full ${item.etiqueta === "blue" ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100" : "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"}`, children: item.etiqueta === "blue" ? t("B-Blue") : t("B-Green") }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-2", children: [
                renderEditableField(item, "origen", item.origen),
                renderEditableField(item, "codigo", item.codigo)
              ] }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: renderEditableField(item, "nombre", item.nombre) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: renderEditableField(item, "estado", item.estado) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: editingId === item.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(Button, { onClick: handleSave, className: "bg-green-500 hover:bg-green-600 text-white mr-2", children: [
                  /* @__PURE__ */ jsx(Save, { className: "w-4 h-4 mr-1 text-center" }),
                  t("B-Save")
                ] }),
                /* @__PURE__ */ jsxs(Button, { onClick: (e) => {
                  handleCancelEdit();
                  e.stopPropagation();
                }, className: "bg-red-500 hover:bg-red-600 text-white", children: [
                  /* @__PURE__ */ jsx(X, { className: "w-4 h-4 mr-1 text-center" }),
                  t("B-Cancel")
                ] })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Button, { onClick: (e) => {
                  e.stopPropagation();
                  handleEdit(item);
                }, className: "bg-blue-500 hover:bg-blue-600 text-white mr-2", children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) }),
                item.id && item.estado_registro === "pendiente" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        if (item.id) onAccept(item.id);
                      },
                      className: "bg-green-500 hover:bg-green-600 text-white mr-2",
                      children: /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        if (item.id) onReject(item.id);
                      },
                      className: "bg-red-500 hover:bg-red-600 text-white",
                      children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: (e) => {
                    e.stopPropagation();
                    toggleRow(item.id);
                  },
                  "aria-controls": `row-${item.id}`,
                  "aria-expanded": expandedRow === item.id,
                  "aria-label": t("Info-Details", { name: item.nombre }),
                  children: expandedRow === item.id ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(AnimatePresence, { children: expandedRow === item.id && /* @__PURE__ */ jsx(
          motion.tr,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            transition: { duration: 0.3 },
            children: /* @__PURE__ */ jsx(TableCell, { colSpan: 6, className: "p-0", children: /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                transition: { duration: 0.3, delay: 0.1 },
                className: "bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner m-2 p-4",
                children: /* @__PURE__ */ jsx(React__default.Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "p-4 text-center dark:text-gray-200", children: t("Process2") }), children: /* @__PURE__ */ jsx(
                  ExpandedRowPanel,
                  {
                    item,
                    getAntiguedadStage,
                    getCondicionEstado,
                    renderValue,
                    refetch,
                    isEditing: editingId === item.id,
                    editedData,
                    onInputChange: handleInputChange,
                    errors,
                    setErrors,
                    onImageDelete: handleImageDelete
                  }
                ) })
              }
            ) })
          },
          "expanded-row"
        ) })
      ] }, key);
    }) })
  ] }) });
}

const RemovalRequestsPanel = () => {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("approve");
  const [adminNotes, setAdminNotes] = useState("");
  const { data: requests, isLoading, isError } = useQuery({
    queryKey: ["removalRequests"],
    queryFn: async () => {
      const response = await fetch("/api/removal-requests?admin=true&status=pending");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      return data.requests || [];
    },
    staleTime: 3e4
  });
  const updateMutation = useMutation({
    mutationFn: async ({ requestId, status, admin_notes }) => {
      const response = await fetch("/api/removal-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status, admin_notes })
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "Éxito", description: data.message });
      queryClient.invalidateQueries({ queryKey: ["removalRequests"] });
      setActionDialogOpen(false);
      setSelectedRequest(null);
      setAdminNotes("");
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo procesar la solicitud", variant: "destructive" });
    }
  });
  const handleAction = useCallback((request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setActionDialogOpen(true);
  }, []);
  const confirmAction = useCallback(() => {
    if (!selectedRequest) return;
    updateMutation.mutate({
      requestId: selectedRequest._id,
      status: actionType === "approve" ? "approved" : "rejected",
      admin_notes: adminNotes
    });
  }, [selectedRequest, actionType, adminNotes, updateMutation]);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  const getDaysRemaining = (deadline) => {
    const now = /* @__PURE__ */ new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    return diffDays;
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-gray-500", children: "Cargando solicitudes..." });
  }
  if (isError) {
    return /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-red-500", children: "Error al cargar las solicitudes" });
  }
  if (!requests || requests.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-gray-500 dark:text-gray-400", children: "No hay solicitudes de retiro pendientes" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: translate("Removal-Pending") }),
    /* @__PURE__ */ jsx("div", { className: "rounded-md border overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Solicitante" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Persona" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Razón" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Fecha" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Plazo" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: requests.map((request) => {
        const daysRemaining = getDaysRemaining(request.deadline);
        return /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: `https://twitter.com/${request.twitter_username}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-blue-500 hover:underline",
              children: [
                "@",
                request.twitter_username
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            request.objeto_id?.imagen && /* @__PURE__ */ jsx(
              "img",
              {
                src: request.objeto_id.imagen,
                alt: "",
                className: "w-8 h-8 rounded-full object-cover"
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: request.objeto_id?.nombre }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: request.objeto_id?.cedula })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(TableCell, { className: "max-w-xs", children: [
            /* @__PURE__ */ jsx("p", { className: "truncate", title: request.reason, children: request.reason }),
            request.evidence_url && /* @__PURE__ */ jsx(
              "a",
              {
                href: request.evidence_url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-xs text-blue-500 hover:underline",
                children: "Ver evidencia"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: formatDate(request.createdAt) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded text-xs ${daysRemaining <= 2 ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`, children: daysRemaining > 0 ? `${daysRemaining} días` : "Vencido" }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "bg-green-100 hover:bg-green-200 text-green-700",
                onClick: () => handleAction(request, "approve"),
                children: "Aprobar"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "bg-red-100 hover:bg-red-200 text-red-700",
                onClick: () => handleAction(request, "reject"),
                children: "Rechazar"
              }
            )
          ] }) })
        ] }, request._id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: actionDialogOpen, onOpenChange: setActionDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: actionType === "approve" ? "Aprobar solicitud" : "Rechazar solicitud" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: actionType === "approve" ? "Al aprobar, el registro del objeto será eliminado permanentemente." : "La solicitud será rechazada y el registro permanecerá visible." })
      ] }),
      selectedRequest && /* @__PURE__ */ jsxs("div", { className: "py-4", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Solicitante:" }),
          " @",
          selectedRequest.twitter_username
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Objeto:" }),
          " ",
          selectedRequest.objeto_id?.nombre
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Razón:" }),
          " ",
          selectedRequest.reason
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Notas del admin (opcional)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600",
              rows: 3,
              value: adminNotes,
              onChange: (e) => setAdminNotes(e.target.value),
              placeholder: "Añadir notas sobre la decisión..."
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setActionDialogOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: confirmAction,
            className: actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700",
            disabled: updateMutation.isPending,
            children: updateMutation.isPending ? "Procesando..." : "Confirmar"
          }
        )
      ] })
    ] }) })
  ] });
};

const queryClient = new QueryClient();
function PanelEngineContent({ initialSearchTerm = "", focusSearchInput = false }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchField, setSearchField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const { toast } = useToast();
  const {
    data: allPendingObjetos,
    isLoading,
    isError,
    refetch
  } = useFetchData("pendiente");
  const filteredObjetos = useFilteredData(allPendingObjetos, searchTerm, searchField);
  const totalPages = Math.ceil((filteredObjetos?.length || 0) / itemsPerPage);
  const paginatedObjetos = filteredObjetos?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];
  const handleSearchTermChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);
  const handleSearchFieldSelect = useCallback((value) => {
    setSearchField(value);
    setCurrentPage(1);
  }, []);
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);
  const handleItemsPerPageChange = useCallback((items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);
  const handleConfirmAction = useCallback(async () => {
    if (actionToConfirm) {
      try {
        if (actionToConfirm.type === "accept") {
          await acceptDesaparecido(actionToConfirm.id);
          toast({ title: "Éxito", description: "Información aceptada y aprobada" });
        } else {
          await rejectDesaparecido(actionToConfirm.id);
          toast({ title: "Éxito", description: "Información rechazada y eliminada" });
        }
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Hubo un problema al procesar la acción",
          variant: "destructive"
        });
      }
    }
    setConfirmDialogOpen(false);
    setActionToConfirm(null);
  }, [actionToConfirm, refetch, toast, t]);
  const handleAccept = useCallback((id) => {
    setActionToConfirm({ type: "accept", id });
    setConfirmDialogOpen(true);
  }, []);
  const handleReject = useCallback((id) => {
    setActionToConfirm({ type: "reject", id });
    setConfirmDialogOpen(true);
  }, []);
  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch("/auth/logout", { method: "POST" });
      if (response.ok) {
        window.location.href = "/login";
      } else {
        toast({ title: "Error", description: "No se pudo cerrar la sesión", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Error al cerrar sesión", variant: "destructive" });
    }
  }, [toast]);
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-center flex-1", children: t("Title-4") }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: handleLogout,
          variant: "outline",
          className: "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-100",
          children: t("B-Logout") || "Cerrar Sesión"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-4 mb-8", children: /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 flex flex-col md:flex-row gap-4", children: [
      /* @__PURE__ */ jsx(
        SearchBar,
        {
          initialSearchTerm: searchTerm,
          onSearchTermChange: handleSearchTermChange,
          focusSearchInput
        }
      ),
      /* @__PURE__ */ jsx(
        SearchFieldSelector,
        {
          searchField,
          onSearchFieldSelect: handleSearchFieldSelect
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "text-center", children: t("Process1") }), children: isLoading ? /* @__PURE__ */ jsx("div", { className: "text-center", children: t("Process1") }) : isError ? /* @__PURE__ */ jsx("div", { className: "text-red-500 text-center", children: t("Error") }) : filteredObjetos && filteredObjetos.length > 0 ? /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center mb-4 gap-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => setFilterTag(null),
            variant: filterTag === null ? "default" : "outline",
            className: "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 dark:bg-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:active:bg-slate-700",
            children: t("B-All")
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => setFilterTag("blue"),
            variant: filterTag === "blue" ? "default" : "outline",
            className: "bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-800 dark:bg-blue-700 dark:hover:bg-blue-800 dark:active:bg-blue-900 dark:text-blue-100",
            children: t("B-Blue")
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => setFilterTag("green"),
            variant: filterTag === "green" ? "default" : "outline",
            className: "bg-green-100 hover:bg-green-200 active:bg-green-300 text-green-800 dark:bg-green-700 dark:hover:bg-green-800 dark:active:bg-green-900 dark:text-green-100",
            children: t("B-Green")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-full md:max-w-[90%] mx-auto", children: [
        /* @__PURE__ */ jsx(
          Pagination,
          {
            itemsPerPage,
            onItemsPerPageChange: handleItemsPerPageChange
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto mt-6", children: /* @__PURE__ */ jsx(
          PanelTable,
          {
            data: paginatedObjetos,
            renderValue,
            formatCodigo,
            getAntiguedadStage,
            getCondicionEstado,
            refetch,
            onAccept: handleAccept,
            onReject: handleReject,
            filterTag
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full md:max-w-[85%] mx-auto mt-6", children: /* @__PURE__ */ jsx(
        Pagination,
        {
          currentPage,
          totalPages,
          onPageChange: handlePageChange
        }
      ) })
    ] }) : /* @__PURE__ */ jsx("div", { className: "text-center py-4", children: t("Component-P") }) }) }),
    /* @__PURE__ */ jsx(RemovalRequestsPanel, {}),
    /* @__PURE__ */ jsx(Dialog, { open: confirmDialogOpen, onOpenChange: setConfirmDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: t("Subtitle-5") }),
        /* @__PURE__ */ jsx(DialogDescription, { children: actionToConfirm?.type === "accept" ? t("Paragraph-6") : t("Paragraph-7") })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setConfirmDialogOpen(false), children: t("B-Cancel") }),
        /* @__PURE__ */ jsx(Button, { className: "bg-blue-600", onClick: handleConfirmAction, children: t("B-Confirm") })
      ] })
    ] }) })
  ] });
}
function PanelEngine(props) {
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(LanguageProvider, { children: /* @__PURE__ */ jsx(PanelEngineContent, { ...props }) }) });
}

const $$Astro = createAstro();
const $$PanelAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PanelAdmin;
  await connectDB();
  const userRepository = new UserRepository();
  const cookies = parse(Astro2.request.headers.get("cookie") || "");
  const token = cookies.token;
  let isAuthenticated = false;
  if (token) {
    try {
      const decoded = jwt.verify(token, "ラAシつd^$ñDツ가ь中ヘqユ!дхヨпヒヨムgHふ67LцC$んノlsуMやロしх0ヲエWすリkjяぬR4бテホえ");
      if (typeof decoded === "object" && decoded.userId) {
        const user = await userRepository.findById(decoded.userId);
        if (user) {
          isAuthenticated = true;
        }
      }
    } catch (error) {
      console.error("Token inválido:", error);
    }
  }
  if (!isAuthenticated) {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "DataTracker - Admin" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="height: 60px;"></div> ${renderComponent($$result2, "PanelEngine", PanelEngine, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/PanelEngine.tsx", "client:component-export": "default" })} <div style="height: 60px;"></div> ` })}`;
}, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/pages/panel-admin.astro", void 0);
const $$file = "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/pages/panel-admin.astro";
const $$url = "/panel-admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PanelAdmin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { fetchDesaparecidoDetails as f, page as p };
