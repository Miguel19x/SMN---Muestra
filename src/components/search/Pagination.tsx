import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PaginationProps } from '../type/types'
import { useLanguage } from '../additionals/scripts/i18n';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange
}: PaginationProps) {
  const showItemsPerPage = itemsPerPage !== undefined && onItemsPerPageChange !== undefined;
  const showPageNavigation = currentPage !== undefined && totalPages !== undefined && onPageChange !== undefined;
  const { translate } = useLanguage();

  return (
    <div className="flex flex-col items-center space-y-4">
      {showItemsPerPage && (
        <div className="w-full flex justify-end mb-4">
          <Select 
            value={itemsPerPage.toString()} 
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={translate('B-Page')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20 {translate('B-Page')}</SelectItem>
              <SelectItem value="50">50 {translate('B-Page')}</SelectItem>
              <SelectItem value="100">100 {translate('B-Page')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {showPageNavigation && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            className="bg-blue-600 text-white"
          >
            {translate('B-Previous')}
          </Button>
          <span>{`${translate('Component-Page')} ${currentPage} ${translate('Component-Of')} ${totalPages}`}</span>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            className="bg-blue-600 text-white"
          >
            {translate('B-Next')}
          </Button>
        </div>
      )}
    </div>
  );
}