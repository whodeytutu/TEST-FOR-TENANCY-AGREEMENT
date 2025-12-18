import React, { useState, useEffect } from 'react';
import { VehicleTransferData } from '@/types';
import { INITIAL_VEHICLE_DATA, VEHICLE_STEPS } from '@/constants';
import { generateVehicleTransferDocument } from '@/utils/documentGenerators';
import { generateVehicleTransferHTML, generatePDF, printDocument } from '@/utils/pdfGenerator';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepProgress } from '@/components/ui/StepProgress';
import { ExportDropdown, ExportFormat } from '@/components/ui/ExportDropdown';
import { DocumentPreview } from '@/components/DocumentPreview';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ArrowLeft, ArrowRight, Car, User, Users, CreditCard, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useDraft } from '@/hooks/use-draft';

interface VehicleTransferFormProps {
  onBack: () => void;
}

export const VehicleTransferForm: React.FC<VehicleTransferFormProps> = ({ onBack }) => {
  const { data, updateData, saveDraft, clearDraft, hasDraft } = useDraft<VehicleTransferData>('vehicle', INITIAL_VEHICLE_DATA);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingFormat, setLoadingFormat] = useState<ExportFormat>();
  const [showPreview, setShowPreview] = useState(false);

  // Auto-calculate outstanding balance
  useEffect(() => {
    const balance = Math.max(0, data.totalPrice - data.amountPaid);
    updateData('outstandingBalance', balance);
  }, [data.totalPrice, data.amountPaid, updateData]);

  const nextStep = () => setCurrentStep(p => Math.min(VEHICLE_STEPS.length - 1, p + 1));
  const prevStep = () => setCurrentStep(p => Math.max(0, p - 1));

  const handleExport = async (format: ExportFormat) => {
    setIsGenerating(true);
    setLoadingFormat(format);
    try {
      const filename = `Vehicle_Transfer_Agreement_${data.buyerName || 'Draft'}`;
      
      if (format === 'docx') {
        await generateVehicleTransferDocument(data);
        toast({
          title: "Document Generated!",
          description: "Your vehicle transfer agreement has been downloaded as Word document.",
        });
      } else if (format === 'pdf') {
        const html = generateVehicleTransferHTML(data);
        await generatePDF(html, filename);
        toast({
          title: "PDF Generated!",
          description: "Your vehicle transfer agreement has been downloaded as PDF.",
        });
      } else if (format === 'print') {
        const html = generateVehicleTransferHTML(data);
        printDocument(html);
        toast({
          title: "Print Dialog Opened",
          description: "Your vehicle transfer agreement is ready to print.",
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
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Seller Details</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={data.sellerName}
                    onChange={(e) => updateData('sellerName', e.target.value)}
                    placeholder="Enter seller's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={data.sellerPhone}
                    onChange={(e) => updateData('sellerPhone', e.target.value)}
                    placeholder="e.g., 0244123456"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Location/Address</Label>
                  <Input
                    value={data.sellerLocation}
                    onChange={(e) => updateData('sellerLocation', e.target.value)}
                    placeholder="e.g., Kasoa, Central Region"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Buyer Details</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={data.buyerName}
                    onChange={(e) => updateData('buyerName', e.target.value)}
                    placeholder="Enter buyer's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={data.buyerPhone}
                    onChange={(e) => updateData('buyerPhone', e.target.value)}
                    placeholder="e.g., 0244123456"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Location/Address</Label>
                  <Input
                    value={data.buyerLocation}
                    onChange={(e) => updateData('buyerLocation', e.target.value)}
                    placeholder="e.g., Asonomaso Nkwanta"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Vehicle
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Car className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Vehicle Information</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Vehicle Make</Label>
                  <Input
                    value={data.vehicleMake}
                    onChange={(e) => updateData('vehicleMake', e.target.value)}
                    placeholder="e.g., Toyota"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Model</Label>
                  <Input
                    value={data.vehicleModel}
                    onChange={(e) => updateData('vehicleModel', e.target.value)}
                    placeholder="e.g., Vitz"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Color</Label>
                  <Input
                    value={data.vehicleColor}
                    onChange={(e) => updateData('vehicleColor', e.target.value)}
                    placeholder="e.g., Blue-Black"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input
                    value={data.registrationNumber}
                    onChange={(e) => updateData('registrationNumber', e.target.value)}
                    placeholder="e.g., AS 4873-23"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Payment
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Payment Details</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Total Purchase Price (GH₵)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={data.totalPrice}
                    onChange={(e) => updateData('totalPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Amount Paid (GH₵)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={data.totalPrice}
                    value={data.amountPaid}
                    onChange={(e) => updateData('amountPaid', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Outstanding Balance</Label>
                  <div className="px-4 py-2 bg-muted rounded-lg font-semibold text-foreground">
                    {formatCurrency(data.outstandingBalance)}
                  </div>
                </div>
                {data.outstandingBalance > 0 && (
                  <div className="space-y-2">
                    <Label>Payment Deadline</Label>
                    <Input
                      type="date"
                      value={data.paymentDeadline}
                      onChange={(e) => updateData('paymentDeadline', e.target.value)}
                    />
                  </div>
                )}
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

      case 3: // Witnesses
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Witnesses</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Witness 1</h4>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={data.witness1Name}
                      onChange={(e) => updateData('witness1Name', e.target.value)}
                      placeholder="Enter witness name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={data.witness1Phone}
                      onChange={(e) => updateData('witness1Phone', e.target.value)}
                      placeholder="e.g., 0244123456"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Witness 2</h4>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={data.witness2Name}
                      onChange={(e) => updateData('witness2Name', e.target.value)}
                      placeholder="Enter witness name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={data.witness2Phone}
                      onChange={(e) => updateData('witness2Phone', e.target.value)}
                      placeholder="e.g., 0244123456"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Review
        return (
          <div className="space-y-6 animate-fade-up">
            <div className="bg-card p-6 rounded-xl border border-border shadow-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Summary</h3>
              
              <div className="space-y-4">
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Seller</p>
                    <p className="font-medium text-foreground">{data.sellerName || 'Not specified'}</p>
                    <p className="text-sm text-muted-foreground">{data.sellerLocation}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Buyer</p>
                    <p className="font-medium text-foreground">{data.buyerName || 'Not specified'}</p>
                    <p className="text-sm text-muted-foreground">{data.buyerLocation}</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-medium text-foreground">
                    {data.vehicleColor} {data.vehicleMake} {data.vehicleModel}
                  </p>
                  <p className="text-sm text-muted-foreground">Registration: {data.registrationNumber || 'Not specified'}</p>
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-bold text-foreground">{formatCurrency(data.totalPrice)}</p>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="font-bold text-foreground">{formatCurrency(data.amountPaid)}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${data.outstandingBalance > 0 ? 'bg-accent/10' : 'bg-primary/10'}`}>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="font-bold text-foreground">{formatCurrency(data.outstandingBalance)}</p>
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Witness 1</p>
                    <p className="font-medium text-foreground">{data.witness1Name || 'Not specified'}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Witness 2</p>
                    <p className="font-medium text-foreground">{data.witness2Name || 'Not specified'}</p>
                  </div>
                </div>
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
          <h1 className="font-display text-xl font-bold text-foreground">Vehicle Transfer Agreement</h1>
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
            <StepProgress steps={VEHICLE_STEPS} currentStep={currentStep} />

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

              {currentStep < VEHICLE_STEPS.length - 1 ? (
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
              <DocumentPreview type="vehicle" data={data} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
