import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { SearchFieldSelectorProps } from '../type/types'
import { useLanguage } from '../additionals/scripts/i18n';

const SearchFieldSelector: React.FC<SearchFieldSelectorProps> = ({ searchField, onSearchFieldSelect }) => {
  const [open, setOpen] = React.useState(false);
  const { translate } = useLanguage();

  const searchFields = [
    { value: "", label: translate('Component-5') },
    { value: "codigo", label: translate('List-Search-ID') },
    { value: "nombre", label: translate('List-Search-Name') },
    { value: "estado", label: translate('List-Search-Location') },
    { value: "categoria", label: translate('List-Search-Gender') },
    { value: "antiguedad", label: translate('List-Search-Age') },
    { value: "tipo_objeto", label: translate('List-Search-P') },
    { value: "estado_conservacion", label: translate('List-Search-D') },
    { value: "ultimo_lugar_conocido", label: translate('List-Search-Pd') },
    { value: "fecha_registro", label: translate('List-Search-Dd') },
    { value: "hora_registro", label: translate('List-Search-Dt') },
    { value: "clasificacion", label: translate('List-Search-E') },
    { value: "origen", label: translate('List-Search-Ex') },
    { value: "condicion", label: translate('List-Search-H') },
    { value: "pais_origen", label: translate('List-Search-N') },
    { value: "ubicacion_actual", label: translate('List-Search-PC') },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={translate('B-Search')}
          className="w-full md:w-[200px] justify-between"
        >
          {searchField
            ? searchFields.find((field) => field.value === searchField)?.label
            : translate('B-Search')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={translate('Component-4')} />
          <CommandList>
            <CommandEmpty>{translate('Component-S')}</CommandEmpty>
            <CommandGroup>
              {searchFields.map((field) => (
                <CommandItem
                  key={field.value}
                  value={field.value}
                  onSelect={() => {
                    onSearchFieldSelect(field.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      searchField === field.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {field.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchFieldSelector;