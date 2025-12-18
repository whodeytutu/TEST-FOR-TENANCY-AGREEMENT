import React, { useState } from 'react';
import { DocumentType } from '@/types';
import { LandingPage } from '@/components/LandingPage';
import { TenancyForm } from '@/components/TenancyForm';
import { VehicleTransferForm } from '@/components/VehicleTransferForm';

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);

  if (selectedDocument === 'tenancy') {
    return <TenancyForm onBack={() => setSelectedDocument(null)} />;
  }

  if (selectedDocument === 'vehicle-transfer') {
    return <VehicleTransferForm onBack={() => setSelectedDocument(null)} />;
  }

  return <LandingPage onSelectDocument={setSelectedDocument} />;
};

export default Index;
