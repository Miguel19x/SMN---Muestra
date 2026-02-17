import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { c as cn, I as Input } from './input_DaDLUbK_.mjs';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import { u as useToast } from './use-toast_DpGr9H6u.mjs';
import { X } from 'lucide-react';
import { u as useLanguage } from './i18n_Bd6mPn--.mjs';

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png"
];
function ImageUpload({ onChange, resetImage }) {
  const { translate } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const MAX_FILE_SIZE = 6 * 1024 * 1024;
  const handleFile = useCallback(async (file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Error",
        description: "Solo se permiten formatos de imagen (JPEG o PNG)",
        variant: "destructive"
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "El tamaño máximo de la imagen es de 6MB",
        variant: "destructive"
      });
      return;
    }
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        const response = await fetch("/api/cache-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            file: {
              name: file.name,
              type: file.type,
              size: file.size,
              data: base64Data
            }
          })
        });
        if (!response.ok) {
          throw new Error("Failed to cache image");
        }
        const { key } = await response.json();
        setPreviewUrl(base64Data);
        onChange("imagen", key);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error caching image:", error);
      toast({
        title: "Error",
        description: "Failed to cache image.",
        variant: "destructive"
      });
    }
  }, [onChange, toast]);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);
  const handleInputChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  const handleRemoveFile = useCallback(() => {
    setFileName(null);
    setPreviewUrl(null);
    onChange("imagen", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange]);
  useEffect(() => {
    if (resetImage) {
      handleRemoveFile();
    }
  }, [resetImage, handleRemoveFile]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: "imagen", children: translate("Form-I") }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `flex items-center justify-center border-2 border-dashed rounded-lg h-32 cursor-pointer ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        onClick: handleClick,
        children: previewUrl ? /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("img", { src: previewUrl, alt: "Vista previa", className: "w-20 h-20 object-cover rounded mr-2" }),
          /* @__PURE__ */ jsx("span", { className: "mr-2", children: fileName }),
          /* @__PURE__ */ jsx("button", { onClick: (e) => {
            e.stopPropagation();
            handleRemoveFile();
          }, className: "text-red-500", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
        ] }) : /* @__PURE__ */ jsxs("p", { className: "text-gray-500 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: translate("Form-IDrag") }),
          /* @__PURE__ */ jsx("span", { className: "md:hidden", children: translate("Form-IClick") })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "file",
        id: "imagen",
        name: "imagen",
        onChange: handleInputChange,
        accept: ALLOWED_IMAGE_TYPES.join(","),
        className: "hidden",
        ref: fileInputRef
      }
    )
  ] });
}

export { ImageUpload as I, Label as L };
