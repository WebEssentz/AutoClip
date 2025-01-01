// app/account/page.jsx
'use client';

import React from 'react';
import { ProfileSection } from './_components/ProfileSection';
import { BillingSection } from './_components/BillingSection';
import { AnalyticsSection } from './_components/AnalyticsSection';
import { PreferencesSection } from './_components/PreferencesSection';

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <ProfileSection />
      {/* <BillingSection />
      <AnalyticsSection />
      <PreferencesSection /> */}
    </div>
  );
}