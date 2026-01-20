import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou erro:', error, errorInfo);
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Log para análise futura
    if (typeof window !== 'undefined') {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.toString(),
        stack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
      };
      
      // Salvar no localStorage para diagnóstico
      const existingErrors = JSON.parse(localStorage.getItem('fly_turismo_errors') || '[]');
      existingErrors.push(errorLog);
      
      // Manter apenas os últimos 10 erros
      const recentErrors = existingErrors.slice(-10);
      localStorage.setItem('fly_turismo_errors', JSON.stringify(recentErrors));
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Tentar recarregar a página se o erro persistir
    if (this.state.errorCount > 2) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = window.location.hostname === 'localhost';

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
          <Card className="max-w-2xl w-full shadow-2xl border-none">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <span className="text-red-900">Ops! Algo deu errado</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <p className="text-gray-700 text-lg">
                  O sistema Fly Turismo encontrou um erro inesperado. 
                  Nossa equipe foi notificada automaticamente.
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-900 font-medium mb-2">
                    ℹ️ O que você pode fazer:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Tente recarregar a página usando o botão abaixo</li>
                    <li>Se o erro persistir, volte para a página inicial</li>
                    <li>Entre em contato com o suporte se necessário</li>
                  </ul>
                </div>

                {isDevelopment && this.state.error && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      🔧 Detalhes técnicos (modo desenvolvimento)
                    </summary>
                    <div className="mt-3 p-4 bg-gray-100 rounded border border-gray-300 overflow-auto max-h-64">
                      <p className="text-sm font-mono text-red-600 mb-2">
                        {this.state.error.toString()}
                      </p>
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </div>
                  </details>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleReset}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  size="lg"
                >
                  <RefreshCcw className="w-5 h-5 mr-2" />
                  Tentar Novamente
                </Button>
                <Link to={createPageUrl('Dashboard')} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Voltar ao Início
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-center text-gray-500">
                Erro #{this.state.errorCount} • {new Date().toLocaleString('pt-BR')}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;