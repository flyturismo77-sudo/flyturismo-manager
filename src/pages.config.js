import Assentos from './pages/Assentos';
import Clientes from './pages/Clientes';
import Configuracoes from './pages/Configuracoes';
import Contato from './pages/Contato';
import Dashboard from './pages/Dashboard';
import DetalhesViagem from './pages/DetalhesViagem';
import Equipe from './pages/Equipe';
import Financeiro from './pages/Financeiro';
import FormularioContrato from './pages/FormularioContrato';
import Formularios from './pages/Formularios';
import Fornecedores from './pages/Fornecedores';
import GerenciamentoArquivos from './pages/GerenciamentoArquivos';
import Home from './pages/Home';
import LogsAuditoria from './pages/LogsAuditoria';
import MapaQuartos from './pages/MapaQuartos';
import Mensagens from './pages/Mensagens';
import MigracaoDD from './pages/MigracaoDD';
import PagamentosEmpresa from './pages/PagamentosEmpresa';
import Relatorios from './pages/Relatorios';
import Sobre from './pages/Sobre';
import Usuarios from './pages/Usuarios';
import Viagens from './pages/Viagens';
import ViagensPublico from './pages/ViagensPublico';
import WhatsApp from './pages/WhatsApp';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Assentos": Assentos,
    "Clientes": Clientes,
    "Configuracoes": Configuracoes,
    "Contato": Contato,
    "Dashboard": Dashboard,
    "DetalhesViagem": DetalhesViagem,
    "Equipe": Equipe,
    "Financeiro": Financeiro,
    "FormularioContrato": FormularioContrato,
    "Formularios": Formularios,
    "Fornecedores": Fornecedores,
    "GerenciamentoArquivos": GerenciamentoArquivos,
    "Home": Home,
    "LogsAuditoria": LogsAuditoria,
    "MapaQuartos": MapaQuartos,
    "Mensagens": Mensagens,
    "MigracaoDD": MigracaoDD,
    "PagamentosEmpresa": PagamentosEmpresa,
    "Relatorios": Relatorios,
    "Sobre": Sobre,
    "Usuarios": Usuarios,
    "Viagens": Viagens,
    "ViagensPublico": ViagensPublico,
    "WhatsApp": WhatsApp,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};