import React from 'react';
import { Shield, Database, Wifi, User, Trash2, Info } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const points = [
  { icon: Wifi, title: 'Works Fully Offline', desc: 'HireReady CV Engine is an offline-first app. It does not require an internet connection to build or save your CV.' },
  { icon: Database, title: 'Data Stored Locally on Your Device', desc: 'All CV drafts, cover letters, and settings are stored in your browser\'s local storage. Your data never leaves your device.' },
  { icon: User, title: 'No Account Required', desc: 'This app does not require you to create an account, sign in, or provide any personal identification to use it.' },
  { icon: Shield, title: 'No Data Uploaded to a Server', desc: 'We do not collect, transmit, or store your CV content, personal details, or usage data on any server. There is no backend database.' },
  { icon: Trash2, title: 'You Can Delete Your Data Anytime', desc: 'All saved CV drafts can be deleted at any time from the Saved CVs screen. Clearing your browser storage will also remove all app data.' },
  { icon: Info, title: 'Future Updates', desc: 'If analytics, advertising, or cloud sync are added in a future update, this privacy policy and the app\'s Data Safety declaration will be updated before those features are enabled. You will be notified.' },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Shield size={20} className="text-primary" />
          <div>
            <h1 className="text-base font-bold text-foreground">Privacy Policy</h1>
            <p className="text-xs text-muted-foreground">Last updated: May 2026</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 max-w-lg mx-auto space-y-4">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
          <p className="text-sm font-bold text-foreground mb-1">Your privacy is built in by design.</p>
          <p className="text-xs text-muted-foreground leading-relaxed">HireReady CV Engine is designed to work entirely on your device. We do not have access to anything you type into this app.</p>
        </div>

        {points.map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-4 flex gap-4 shadow-sm">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}

        <div className="bg-muted rounded-2xl p-4 space-y-2">
          <p className="text-xs font-semibold text-foreground">Third-Party Services</p>
          <p className="text-xs text-muted-foreground leading-relaxed">This version of the app does not use any third-party analytics, advertising SDKs, or tracking libraries. No data is shared with any third party.</p>
        </div>

        <div className="bg-muted rounded-2xl p-4 space-y-2">
          <p className="text-xs font-semibold text-foreground">Contact</p>
          <p className="text-xs text-muted-foreground leading-relaxed">If you have any questions about this privacy policy or the app's data practices, please contact us at the address listed on the app's store page.</p>
        </div>

        <p className="text-xs text-muted-foreground text-center pb-4">HireReady CV Engine · Privacy Policy · v1.0</p>
      </div>

      <BottomNav />
    </div>
  );
}