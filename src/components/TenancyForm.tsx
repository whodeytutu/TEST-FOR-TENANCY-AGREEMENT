import React, { useState } from 'react';
import { TenancyData, PropertyType, PaymentStatus } from '@/types';
import { INITIAL_TENANCY_DATA, TENANCY_STEPS } from '@/constants';
import { generateTenancyDocument } from '@/utils/documentGenerators';
import { generateTenancyHTML, generatePDF, printDocument } from '@/utils/pdfGenerator';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepProgress } from '@/components/ui/StepProgress';
import { ClauseSelector } from '@/components/ClauseSelector';
import { ExportDropdown, ExportFormat } from '@/components/ui/ExportDropdown';
import { DocumentPreview } from '@/components/DocumentPreview';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ArrowLeft, ArrowRight, Home, User, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useDraft } from '@/hooks/use-draft';

interface TenancyFormProps {
  onBack: () => void;
}

export const TenancyForm: React.FC<TenancyFormProps> = ({ onBack }) => {
  const { data, updateData, saveDraft, clearDraft, hasDraft } = useDraft<TenancyData>('tenancy', INITIAL_TENANCY_DATA);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingFormat, setLoadingFormat] = useState<ExportFormat>();
  const [showPreview, setShowPreview] = useState(false);

  const nextStep = () => setCurrentStep(p => Math.min(TENANCY_STEPS.length - 1, p + 1));
  const prevStep = () => setCurrentStep(p => Math.max(0, p - 1));

  const handleExport = async (format: ExportFormat) => {
    setIsGenerating(true);
    setLoadingFormat(format);
    try {
      const filename = `Tenancy_Agreement_${data.tenantName || 'Draft'}`;
      
      if (format === 'docx') {
        await generateTenancyDocument(data);
        toast({
          title: "Document Generated!",
          description: "Your tenancy agreement has been downloaded as Word document.",
        });
      } else if (format === 'pdf') {
        const html = generateTenancyHTML(data);
        await generatePDF(html, filename);
        toast({
          title: "PDF Generated!",
          description: "Your tenancy agreement has been downloaded as PDF.",
        });
      } else if (format === 'print') {
        const html = generateTenancyHTML(data);
        printDocument(html);
        toast({
          title: "Print Dialog Opened",
          description: "Your tenancy agreement is ready to print.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setLoadingFormat(undefined);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Parties
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-end">
              <label className="flex items-center gap-2 cursor-pointer bg-muted px-3 py-1.5 rounded-lg hover:bg-muted/80 transition-colors">
                <input
                  type="checkbox"
                  checked={data.includePhoneNumbers}
                  onChange={(e) => updateData('includePhoneNumbers', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm text-foreground">Include phone numbers in document</span>
              </label>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Landlord Details</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Select value={data.landlordTitle} onValueChange={(v) => updateData('landlordTitle', v as 'Landlord' | 'Landlady')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Landlord">Landlord</SelectItem>
                      <SelectItem value="Landlady">Landlady</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={data.landlordName}
                    onChange={(e) => updateData('landlordName', e.target.value)}
                    placeholder="Enter landlord's name"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={data.landlordPhone}
                    onChange={(e) => updateData('landlordPhone', e.target.value)}
                    placeholder="e.g., 0244123456"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Tenant Details</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={data.tenantName}
                    onChange={(e) => updateData('tenantName', e.target.value)}
                    placeholder="Enter tenant's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={data.tenantPhone}
                    onChange={(e) => updateData('tenantPhone', e.target.value)}
                    placeholder="e.g., 0244123456"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Property
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Property Information</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select value={data.propertyType} onValueChange={(v) => updateData('propertyType', v as PropertyType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PropertyType).map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Property Location</Label>
                  <Input
                    value={data.propertyLocation}
                    onChange={(e) => updateData('propertyLocation', e.target.value)}
                    placeholder="e.g., Accra, East Legon"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Terms
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Tenancy Duration</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={data.startDate}
                    onChange={(e) => updateData('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    type="number"
                    min={1}
                    value={data.durationValue}
                    onChange={(e) => updateData('durationValue', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={data.durationUnit} onValueChange={(v) => updateData('durationUnit', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Months">Months</SelectItem>
                      <SelectItem value="Years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Rent Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Rent Amount (GH₵)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={data.rentAmount}
                    onChange={(e) => updateData('rentAmount', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Frequency</Label>
                  <Select value={data.rentFrequency} onValueChange={(v) => updateData('rentFrequency', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Month">Per Month</SelectItem>
                      <SelectItem value="Year">Per Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Caution Fee (GH₵)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={data.cautionFee}
                    onChange={(e) => updateData('cautionFee', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Status</Label>
                  <Select value={data.paymentStatus} onValueChange={(v) => updateData('paymentStatus', v as PaymentStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PaymentStatus).map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Clauses
        return (
          <ClauseSelector
            clauses={data.customClauses}
            onAddClause={(clause) => updateData('customClauses', [...data.customClauses, clause])}
            onRemoveClause={(index) => updateData('customClauses', data.customClauses.filter((_, i) => i !== index))}
          />
        );

      case 4: // Witnesses
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-2">Witness Details</h3>
              <p className="text-xs text-muted-foreground mb-4 italic">
                Tip: Enter "N/A" to generate a blank line for manual filling later.
              </p>
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Witness 1 Name</Label>
                    <Input
                      value={data.witness1Name}
                      onChange={(e) => updateData('witness1Name', e.target.value)}
                      placeholder="Enter witness name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Witness 1 Phone</Label>
                    <Input
                      value={data.witness1Phone}
                      onChange={(e) => updateData('witness1Phone', e.target.value)}
                      placeholder="e.g., 0244123456"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Witness 2 Name</Label>
                    <Input
                      value={data.witness2Name}
                      onChange={(e) => updateData('witness2Name', e.target.value)}
                      placeholder="Enter witness name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Witness 2 Phone</Label>
                    <Input
                      value={data.witness2Phone}
                      onChange={(e) => updateData('witness2Phone', e.target.value)}
                      placeholder="e.g., 0244123456"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Agreement Date</h3>
              <div className="space-y-2">
                <Label>Date of Agreement</Label>
                <Input
                  type="date"
                  value={data.dateOfAgreement}
                  onChange={(e) => updateData('dateOfAgreement', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="font-display text-xl font-bold text-foreground">Tenancy Agreement</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPreview(!showPreview)} 
              title={showPreview ? "Hide Preview" : "Show Preview"}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={saveDraft} title="Save Draft">
              <Save className="w-4 h-4" />
            </Button>
            {hasDraft && (
              <Button variant="ghost" size="sm" onClick={clearDraft} title="Clear Draft" className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'}`}>
          <div>
            <StepProgress steps={TENANCY_STEPS} currentStep={currentStep} />

            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < TENANCY_STEPS.length - 1 ? (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <ExportDropdown 
                  onExport={handleExport} 
                  isLoading={isGenerating} 
                  loadingFormat={loadingFormat}
                />
              )}
            </div>
          </div>

          {showPreview && (
            <div className="hidden lg:block sticky top-24">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Live Preview</h3>
              <DocumentPreview type="tenancy" data={data} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
