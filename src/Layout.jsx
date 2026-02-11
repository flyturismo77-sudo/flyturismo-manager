import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Plane, 
  Users, 
  Armchair, 
  DollarSign, 
  FileText,
  LogOut,
  Menu,
  Settings,
  Globe,
  MessageSquare,
  Hotel,
  CreditCard,
  UserCog,
  Building2,
  UsersRound,
  HardDrive,
  Activity,
  RefreshCw,
  Database
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import ErrorBoundary from "@/components/ErrorBoundary";

const adminPages = ["Dashboard", "Viagens", "Clientes", "Assentos", "MapaQuartos", "Financeiro", "PagamentosEmpresa", "Fornecedores", "Equipe", "Relatorios", "Formularios", "Configuracoes", "Mensagens", "Usuarios", "GerenciamentoArquivos", "LogsAuditoria", "MigracaoDD", "Exportacao", "WhatsApp"];
const publicPages = ["Home", "Sobre", "ViagensPublico", "Contato", "FormularioContrato"];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [connectionError, setConnectionError] = React.useState(false);
  const [migrationNeeded, setMigrationNeeded] = React.useState(false);
  const isAdminPage = adminPages.includes(currentPageName);
  const isPublicPage = publicPages.includes(currentPageName);

  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      try {
        const configs = await base44.entities.ConfiguracaoEmpresa.list();
        setConnectionError(false);
        return configs[0];
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        setConnectionError(true);
        return null;
      }
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });

  // Verificar se há viagens DD que precisam de migração
  useEffect(() => {
    const checkMigration = async () => {
      try {
        const viagens = await base44.entities.Viagem.list();
        const viagensDD = viagens.filter(v => v.modelo_onibus === 'DD' && v.vagas_totais !== 57);
        setMigrationNeeded(viagensDD.length > 0);
      } catch (error) {
        console.error("Erro ao verificar migração:", error);
      }
    };

    if (isAdminPage && currentUser) {
      checkMigration();
    }
  }, [isAdminPage, currentUser]);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAdminPage) {
        try {
          const user = await base44.auth.me();
          setCurrentUser(user);
          setLoading(false);
          setConnectionError(false);
        } catch (error) {
          console.error("Erro de autenticação:", error);
          setConnectionError(true);
          base44.auth.redirectToLogin(window.location.pathname);
        }
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [isAdminPage, currentPageName]);

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  if (isPublicPage) {
    return (
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    );
  }

  if (isAdminPage && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Conexão Perdida</h2>
          <p className="text-gray-600 mb-6">
            Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (isAdminPage && !currentUser) {
    return null;
  }

  const isAdminByEmail = currentUser?.email?.toLowerCase().includes('flyturadm');
  const isAdmin = isAdminByEmail || currentUser?.cargo === 'Administrador' || currentUser?.role === 'admin';

  const navigationItems = [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: LayoutDashboard,
    },
    ...(isAdmin ? [{
      title: "Viagens",
      url: createPageUrl("Viagens"),
      icon: Plane,
    }] : []),
    {
      title: "Clientes",
      url: createPageUrl("Clientes"),
      icon: Users,
    },
    {
      title: "Assentos",
      url: createPageUrl("Assentos"),
      icon: Armchair,
    },
    {
      title: "Quartos",
      url: createPageUrl("MapaQuartos"),
      icon: Hotel,
    },
    {
      title: "WhatsApp",
      url: createPageUrl("WhatsApp"),
      icon: MessageSquare,
    },
    ...(isAdmin ? [
      {
        title: "Financeiro",
        url: createPageUrl("Financeiro"),
        icon: DollarSign,
      },
      {
        title: "Despesas",
        url: createPageUrl("PagamentosEmpresa"),
        icon: CreditCard,
      },
      {
        title: "Fornecedores",
        url: createPageUrl("Fornecedores"),
        icon: Building2,
      },
      {
        title: "Equipe",
        url: createPageUrl("Equipe"),
        icon: UsersRound,
      },
      {
        title: "Relatórios",
        url: createPageUrl("Relatorios"),
        icon: FileText,
      },
    ] : []),
    {
      title: "Formulários",
      url: createPageUrl("Formularios"),
      icon: FileText,
    },
    {
      title: "Mensagens",
      url: createPageUrl("Mensagens"),
      icon: MessageSquare,
    },
    ...(isAdmin ? [
      {
        title: "Usuários",
        url: createPageUrl("Usuarios"),
        icon: UserCog,
      },
      {
        title: "Backup",
        url: createPageUrl("GerenciamentoArquivos"),
        icon: HardDrive,
      },
      {
        title: "Logs",
        url: createPageUrl("LogsAuditoria"),
        icon: Activity,
      },
      {
        title: "Exportação",
        url: createPageUrl("Exportacao"),
        icon: Database,
      },
      ...(migrationNeeded ? [{
        title: "⚠️ Migração DD",
        url: createPageUrl("MigracaoDD"),
        icon: RefreshCw,
        highlight: true
      }] : [])
    ] : []),
    {
      title: "Configurações",
      url: createPageUrl("Configuracoes"),
      icon: Settings,
    },
  ];

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50">
          <style>{`
            :root {
              --primary: 214 88% 48%;
              --primary-foreground: 0 0% 100%;
              --secondary: 38 92% 50%;
              --secondary-foreground: 0 0% 100%;
            }
          `}</style>
          
          <Sidebar className="border-r border-gray-200 bg-white">
            <SidebarHeader className="border-b border-gray-100 p-6">
              <div className="flex items-center gap-3">
                {config?.logo_url ? (
                  <img src={config.logo_url} alt="Logo" className="w-10 h-10 object-contain" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-sky-400 via-blue-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-lg text-gray-900">
                    {config?.nome_empresa || "Fly Turismo"}
                  </h2>
                  <p className="text-xs text-gray-500">Sistema Corporativo</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  Menu Principal
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-sky-50 hover:text-sky-700 transition-all duration-200 rounded-xl mb-1 ${
                            location.pathname === item.url ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg' : ''
                          } ${item.highlight ? 'bg-amber-50 border-2 border-amber-300 animate-pulse' : ''}`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="hover:bg-amber-50 hover:text-amber-700 transition-all duration-200 rounded-xl">
                        <Link to={createPageUrl("Home")} className="flex items-center gap-3 px-4 py-3">
                          <Globe className="w-5 h-5" />
                          <span className="font-medium">Ver Site</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {currentUser?.full_name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {currentUser?.full_name || 'Usuário'}
                  </p>
                  <Badge className={`text-xs mt-1 ${isAdmin ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {isAdmin ? 'Administrador' : 'Funcionário'}
                  </Badge>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>
                <h1 className="text-xl font-semibold text-gray-900">
                  {config?.nome_empresa || "Fly Turismo"}
                </h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
}