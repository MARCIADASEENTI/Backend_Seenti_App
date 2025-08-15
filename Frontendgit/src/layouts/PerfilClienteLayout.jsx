// src/layouts/PerfilClienteLayout.jsx
import React from 'react';

export default function PerfilClienteLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 bg-green-50 p-6 border-r border-green-200">
        <nav aria-label="Menu do perfil">
          <ul className="space-y-4">
          
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-8 max-w-2xl mx-auto mt-12 border rounded-lg shadow">
        {children}
      </main>
    </div>
  );
}
