import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://dbciokfvdyaxbryvjmfz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiY2lva2Z2ZHlheGJyeXZqbWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTgxNDQsImV4cCI6MjA0OTIzNDE0NH0.ORSomgnmDNE-1IEE7yp4mLnn9QDRNIf6iTRHwi1-LHU");

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);


reportWebVitals();
