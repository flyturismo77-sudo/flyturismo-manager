import Dashboard from './pages/Dashboard';
import Viagens from './pages/Viagens';
import Clientes from './pages/Clientes';
import Assentos from './pages/Assentos';
import Financeiro from './pages/Financeiro';
import Relatorios from './pages/Relatorios';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import ViagensPublico from './pages/ViagensPublico';
import Contato from './pages/Contato';
import Mensagens from './pages/Mensagens';
import Configuracoes from './pages/Configuracoes';
import MapaQuartos from './pages/MapaQuartos';
import FormularioContrato from './pages/FormularioContrato';
import Formularios from './pages/Formularios';
import PagamentosEmpresa from './pages/PagamentosEmpresa';
import Usuarios from './pages/Usuarios';
import DetalhesViagem from './pages/DetalhesViagem';
import Fornecedores from './pages/Fornecedores';
import Equipe from './pages/Equipe';
import GerenciamentoArquivos from './pages/GerenciamentoArquivos';
import LogsAuditoria from './pages/LogsAuditoria';
import MigracaoDD from './pages/MigracaoDD';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Viagens": Viagens,
    "Clientes": Clientes,
    "Assentos": Assentos,
    "Financeiro": Financeiro,
    "Relatorios": Relatorios,
    "Home": Home,
    "Sobre": Sobre,
    "ViagensPublico": ViagensPublico,
    "Contato": Contato,
    "Mensagens": Mensagens,
    "Configuracoes": Configuracoes,
    "MapaQuartos": MapaQuartos,
    "FormularioContrato": FormularioContrato,
    "Formularios": Formularios,
    "PagamentosEmpresa": PagamentosEmpresa,
    "Usuarios": Usuarios,
    "DetalhesViagem": DetalhesViagem,
    "Fornecedores": Fornecedores,
    "Equipe": Equipe,
    "GerenciamentoArquivos": GerenciamentoArquivos,
    "LogsAuditoria": LogsAuditoria,
    "MigracaoDD": MigracaoDD,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};