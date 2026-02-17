import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import React__default, { useRef, useCallback, useEffect, Component, useMemo } from 'react';
import { I as Input, c as cn, B as Button } from './input_DaDLUbK_.mjs';
import debounce from 'lodash/debounce.js';
import { u as useLanguage } from './i18n_Bd6mPn--.mjs';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Cross2Icon, MagnifyingGlassIcon, CaretSortIcon, ChevronUpIcon, ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { Command as Command$1 } from 'cmdk';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronsUpDown, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { a as getAgeStage, g as getLegalCondition } from './utils_CdDBA7zL.mjs';
import { m as matchesProfessionKeyword } from './professionCategorizer_Bsh3D5TZ.mjs';
import * as SelectPrimitive from '@radix-ui/react-select';

const SearchBar = ({ initialSearchTerm, onSearchTermChange, focusSearchInput }) => {
  const searchInputRef = useRef(null);
  const { translate } = useLanguage();
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => {
      onSearchTermChange(value);
    }, 300),
    [onSearchTermChange]
  );
  useEffect(() => {
    if (focusSearchInput && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [focusSearchInput, debouncedSetSearchTerm]);
  const handleInputChange = (e) => {
    debouncedSetSearchTerm(e.target.value);
  };
  return /* @__PURE__ */ jsx(
    Input,
    {
      ref: searchInputRef,
      id: "search-input",
      name: "search",
      type: "text",
      placeholder: translate("Component-3"),
      "aria-label": translate("Component-3"),
      defaultValue: initialSearchTerm,
      onChange: handleInputChange,
      className: "flex-grow"
    }
  );
};
const SearchBar$1 = React__default.memo(SearchBar);

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Cross2Icon, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const Command = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = Command$1.displayName;
const CommandInput = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsx(MagnifyingGlassIcon, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsx(
    Command$1.Input,
    {
      ref,
      id: "command-search-input",
      name: "command-search",
      className: cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
] }));
CommandInput.displayName = Command$1.Input.displayName;
const CommandList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = Command$1.List.displayName;
const CommandEmpty = React.forwardRef((props, ref) => /* @__PURE__ */ jsx(
  Command$1.Empty,
  {
    ref,
    className: "py-6 text-center text-sm",
    ...props
  }
));
CommandEmpty.displayName = Command$1.Empty.displayName;
const CommandGroup = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = Command$1.Group.displayName;
const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = Command$1.Separator.displayName;
const CommandItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  Command$1.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      className
    ),
    ...props
  }
));
CommandItem.displayName = Command$1.Item.displayName;

const SearchFieldSelector = ({ searchField, onSearchFieldSelect }) => {
  const [open, setOpen] = React__default.useState(false);
  const { translate } = useLanguage();
  const searchFields = [
    { value: "", label: translate("Component-5") },
    { value: "cedula", label: translate("List-Search-ID") },
    { value: "nombre", label: translate("List-Search-Name") },
    { value: "estado", label: translate("List-Search-Location") },
    { value: "sexo", label: translate("List-Search-Gender") },
    { value: "edad", label: translate("List-Search-Age") },
    { value: "profesion", label: translate("List-Search-P") },
    { value: "discapacidad", label: translate("List-Search-D") },
    { value: "lugar_de_desaparicion", label: translate("List-Search-Pd") },
    { value: "fecha", label: translate("List-Search-Dd") },
    { value: "hora", label: translate("List-Search-Dt") },
    { value: "etnia", label: translate("List-Search-E") },
    { value: "extranjero", label: translate("List-Search-Ex") },
    { value: "condicion_de_salud", label: translate("List-Search-H") },
    { value: "nacionalidad", label: translate("List-Search-N") },
    { value: "lugar_de_confinamiento", label: translate("List-Search-PC") }
  ];
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        role: "combobox",
        "aria-expanded": open,
        "aria-label": translate("B-Search"),
        className: "w-full md:w-[200px] justify-between",
        children: [
          searchField ? searchFields.find((field) => field.value === searchField)?.label : translate("B-Search"),
          /* @__PURE__ */ jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(PopoverContent, { className: "w-[200px] p-0", children: /* @__PURE__ */ jsxs(Command, { children: [
      /* @__PURE__ */ jsx(CommandInput, { placeholder: translate("Component-4") }),
      /* @__PURE__ */ jsxs(CommandList, { children: [
        /* @__PURE__ */ jsx(CommandEmpty, { children: translate("Component-S") }),
        /* @__PURE__ */ jsx(CommandGroup, { children: searchFields.map((field) => /* @__PURE__ */ jsxs(
          CommandItem,
          {
            value: field.value,
            onSelect: () => {
              onSearchFieldSelect(field.value);
              setOpen(false);
            },
            children: [
              /* @__PURE__ */ jsx(
                Check,
                {
                  className: cn(
                    "mr-2 h-4 w-4",
                    searchField === field.value ? "opacity-100" : "opacity-0"
                  )
                }
              ),
              field.label
            ]
          },
          field.value
        )) })
      ] })
    ] }) })
  ] });
};

const Table = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx(
  "table",
  {
    ref,
    className: cn("w-full caption-bottom text-sm", className),
    ...props
  }
) }));
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tr",
  {
    ref,
    className: cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "caption",
  {
    ref,
    className: cn("mt-4 text-sm text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(CaretSortIcon, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUpIcon, {})
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDownIcon, {})
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

class ErrorBoundary extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      hasError: false
    };
  }
  static getDerivedStateFromError(_) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || /* @__PURE__ */ jsx("h1", { children: "Lo sentimos, ha ocurrido un error." });
    }
    return this.props.children;
  }
}

function useFetchData(estado_registro = "aprobado") {
  const fetchData = useCallback(async () => {
    const url = `/api/desaparecidos?estado_registro=${estado_registro}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data2 = await response.json();
    return data2.desaparecidos;
  }, [estado_registro]);
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["desaparecidos", estado_registro],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    refetchOnWindowFocus: false
  });
  return {
    data,
    isLoading,
    isError,
    refetch
  };
}

function useFilteredData(allDesaparecidos, searchTerm, searchField) {
  return useMemo(() => {
    if (!allDesaparecidos || allDesaparecidos.length === 0) return [];
    const searchRegex = searchTerm ? new RegExp(searchTerm, "i") : null;
    return allDesaparecidos.filter((item) => {
      if (searchField && !searchRegex) {
        const fieldValue = item[searchField];
        if (searchField === "cedula") {
          const numericCedula = item.cedula?.replace(/\D/g, "") || "";
          return numericCedula.length > 0;
        }
        return fieldValue !== void 0 && fieldValue !== null && fieldValue !== "";
      }
      if (!searchRegex) return true;
      if (searchField) {
        switch (searchField) {
          case "cedula":
            return searchRegex.test(item.cedula?.replace(/\D/g, "") || "");
          case "edad":
            return item.edad === parseInt(searchTerm);
          case "legalCondition":
            const legalCondition = getLegalCondition(item.edad);
            return searchRegex.test(legalCondition);
          case "ageStage":
            const ageStage = getAgeStage(item.edad);
            return searchRegex.test(ageStage);
          case "profesion":
            if (!item.profesion) return false;
            return matchesProfessionKeyword(item.profesion, searchTerm);
          default:
            return searchRegex.test(String(item[searchField] || ""));
        }
      } else {
        const basicMatch = Object.values(item).some(
          (value) => typeof value === "string" && searchRegex.test(value)
        );
        if (!basicMatch && item.profesion) {
          return matchesProfessionKeyword(item.profesion, searchTerm);
        }
        return basicMatch;
      }
    });
  }, [allDesaparecidos, searchTerm, searchField]);
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange
}) {
  const showItemsPerPage = itemsPerPage !== void 0 && onItemsPerPageChange !== void 0;
  const showPageNavigation = currentPage !== void 0 && totalPages !== void 0 && onPageChange !== void 0;
  const { translate } = useLanguage();
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center space-y-4", children: [
    showItemsPerPage && /* @__PURE__ */ jsx("div", { className: "w-full flex justify-end mb-4", children: /* @__PURE__ */ jsxs(
      Select,
      {
        value: itemsPerPage.toString(),
        onValueChange: (value) => onItemsPerPageChange(Number(value)),
        children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: translate("B-Page") }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxs(SelectItem, { value: "20", children: [
              "20 ",
              translate("B-Page")
            ] }),
            /* @__PURE__ */ jsxs(SelectItem, { value: "50", children: [
              "50 ",
              translate("B-Page")
            ] }),
            /* @__PURE__ */ jsxs(SelectItem, { value: "100", children: [
              "100 ",
              translate("B-Page")
            ] })
          ] })
        ]
      }
    ) }),
    showPageNavigation && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-2", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => onPageChange(currentPage - 1),
          disabled: currentPage === 1,
          variant: "outline",
          className: "bg-blue-600 text-white",
          children: translate("B-Previous")
        }
      ),
      /* @__PURE__ */ jsx("span", { children: `${translate("Component-Page")} ${currentPage} ${translate("Component-Of")} ${totalPages}` }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => onPageChange(currentPage + 1),
          disabled: currentPage === totalPages,
          variant: "outline",
          className: "bg-blue-600 text-white",
          children: translate("B-Next")
        }
      )
    ] })
  ] });
}

export { Dialog as D, ErrorBoundary as E, Pagination as P, Select as S, Table as T, TableHeader as a, TableRow as b, TableHead as c, TableBody as d, TableCell as e, SelectTrigger as f, SelectValue as g, SelectContent as h, SelectItem as i, DialogContent as j, DialogHeader as k, DialogTitle as l, DialogDescription as m, DialogFooter as n, useFilteredData as o, SearchBar$1 as p, SearchFieldSelector as q, useFetchData as u };
