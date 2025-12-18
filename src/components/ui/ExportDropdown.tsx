import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileDown, FileText, Printer, Loader2, ChevronDown } from 'lucide-react';

export type ExportFormat = 'docx' | 'pdf' | 'print';

interface ExportDropdownProps {
  onExport: (format: ExportFormat) => void;
  isLoading: boolean;
  loadingFormat?: ExportFormat;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  onExport,
  isLoading,
  loadingFormat,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {loadingFormat === 'print' ? 'Preparing...' : 'Generating...'}
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4 mr-2" />
              Export Document
              <ChevronDown className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onExport('docx')} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          Download as Word (.docx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('pdf')} className="cursor-pointer">
          <FileDown className="w-4 h-4 mr-2" />
          Download as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('print')} className="cursor-pointer">
          <Printer className="w-4 h-4 mr-2" />
          Print Agreement
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
