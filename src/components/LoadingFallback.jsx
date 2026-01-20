import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingFallback({ message = "Carregando..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center">
        <div className="relative">
          {/* Logo animado */}
          <div className="w-24 h-24 bg-gradient-to-br from-sky-400 via-blue-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl mb-6 mx-auto animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12 text-white"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
          </div>

          {/* Spinner */}
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
        </div>

        {/* Mensagem */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Fly Turismo</h2>
        <p className="text-gray-600">{message}</p>
        
        {/* Indicador de progresso */}
        <div className="mt-6 w-64 mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}