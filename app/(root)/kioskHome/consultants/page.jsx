import React, { Suspense } from 'react';
import ConsultantsClient from './ConsultantsClient';

export default function ConsultantsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConsultantsClient />
    </Suspense>
  );
}
