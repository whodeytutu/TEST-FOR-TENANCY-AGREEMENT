import React from 'react';
import { Button } from '@/components/ui/button';
import { DocumentType } from '@/types';
import { Home, Car, FileText, Shield, Clock, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface LandingPageProps {
  onSelectDocument: (type: DocumentType) => void;
}

const documentTypes = [
  {
    type: 'tenancy' as DocumentType,
    title: 'Tenancy Agreement',
    description: 'Professional rental agreement compliant with Ghana\'s Rent Act 1963 (Act 220)',
    icon: Home,
    color: 'from-primary to-primary/80',
    features: ['Rent Act compliant', 'Custom clauses', 'Witness sections'],
  },
  {
    type: 'vehicle-transfer' as DocumentType,
    title: 'Vehicle Transfer Agreement',
    description: 'Legal vehicle sale/purchase agreement for Ghana',
    icon: Car,
    color: 'from-secondary to-secondary/80',
    features: ['Payment terms', 'Default clauses', 'Ownership transfer'],
  },
];

const features = [
  {
    icon: Shield,
    title: 'Legally Compliant',
    description: 'All documents follow Ghanaian law',
  },
  {
    icon: Clock,
    title: 'Quick & Easy',
    description: 'Generate documents in minutes',
  },
  {
    icon: Download,
    title: 'Word Export',
    description: 'Download as editable .docx files',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectDocument }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Ghana Legal Document Generator
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Professional Legal Documents,{' '}
              <span className="text-primary">Made Simple</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Generate legally compliant tenancy agreements and vehicle transfer documents tailored for Ghana. 
              Export as Word documents ready for signing.
            </p>
          </div>
        </div>
      </header>

      {/* Document Types */}
      <section className="container mx-auto px-4 py-12 -mt-8">
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {documentTypes.map((doc, index) => (
            <button
              key={doc.type}
              onClick={() => onSelectDocument(doc.type)}
              className={cn(
                "group relative bg-card rounded-2xl border border-border p-8 text-left transition-all duration-300",
                "hover:shadow-elevated hover:border-primary/30 hover:-translate-y-1",
                "animate-fade-up"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                doc.color
              )}>
                <doc.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                {doc.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {doc.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {doc.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-primary font-medium text-sm">Start →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Why Use Our Document Generator?
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Ghana Legal Document Generator</p>
            <p className="mt-1">Compliant with Ghana Rent Act 1963 (Act 220) and applicable laws</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
