"use client";

import { getBackendUrl } from '@/lib/backendUrl';

export function EnvDebug() {
  const backendUrl = getBackendUrl();
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: '#f0f0f0', 
      padding: '10px', 
      border: '1px solid #ccc',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <strong>Debug Info:</strong><br/>
      <code>NEXT_PUBLIC_BACKEND_URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'undefined'}</code><br/>
      <code>getBackendUrl(): {backendUrl}</code>
    </div>
  );
}