import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Database, 
  Plane, 
  Users, 
  DollarSign, 
  FileText,
  Hotel,
  Armchair,
  Settings,
  Building2,
  UsersRound,
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function Exportacao() {
  const [exportando, setExportando] = useState({});

  const { data: viagens = [] } = useQuery({
    queryKey: ['viagens'],
    queryFn: () => base44.entities.Viagem.list(),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => base44.entities.Cliente.list(),
  });

  const { data: assentos = [] } = useQuery({
    queryKey: ['assentos'],
    queryFn: () => base44.entities.Assento.list(),
  });

  const { data: quartos = [] } = useQuery({
    queryKey: ['quartos'],
    queryFn: () => base44.entities.Quarto.list(),
  });

  const { data: pagamentos = [] } = useQuery({
    queryKey: ['pagamentos'],
    queryFn: () => base44.entities.Pagamento.list(),
  });

  const { data: parcelas = [] } = useQuery({
    queryKey: ['parcelas'],
    queryFn: () => base44.entities.Parcela.list(),
  });

  const { data: documentos = [] } = useQuery({
    queryKey: ['documentos'],
    queryFn: () => base44.entities.DocumentoViagem.list(),
  });

  const { data: config = [] } = useQuery({
    queryKey: ['config'],
    queryFn: () => base44.entities.ConfiguracaoEmpresa.list(),
  });

  const { data: fornecedores = [] } = useQuery({
    queryKey: ['fornecedores'],
    queryFn: () => base44.entities.Fornecedor.list(),
  });

  const { data: equipe = [] } = useQuery({
    queryKey: ['equipe'],
    queryFn: () => base44.entities.Equipe.list(),
  });

  const { data: pagamentosEmpresa = [] } = useQuery({
    queryKey: ['pagamentosEmpresa'],
    queryFn: () => base44.entities.PagamentoEmpresa.list(),
  });

  const { data: despesasFixas = [] } = useQuery({
    queryKey: ['despesasFixas'],
    queryFn: () => base44.entities.DespesaFixa.list(),
  });

  const { data: formularios = [] } = useQuery({
    queryKey: ['formularios'],
    queryFn: () => base44.entities.FormularioContrato.list(),
  });

  const { data: contatos = [] } = useQuery({
    queryKey: ['contatos'],
    queryFn: () => base44.entities.Contato.list(),
  });

  const { data: comentarios = [] } = useQuery({
    queryKey: ['comentarios'],
    queryFn: () => base44.entities.Comentario.list(),
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.AuditLog.list(),
  });

  const exportarJSON = async (nomeEntidade, dados, icone) => {
    setExportando(prev => ({ ...prev, [nomeEntidade]: true }));
    
    try {
      const dataStr = JSON.stringify(dados, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${nomeEntidade}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setTimeout(() => {
        setExportando(prev => ({ ...prev, [nomeEntidade]: false }));
      }, 1000);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      setExportando(prev => ({ ...prev, [nomeEntidade]: false }));
      alert('Erro ao exportar dados!');
    }
  };

  const exportarTudo = async () => {
    setExportando({ todos: true });
    
    try {
      const backup = {
        exportado_em: new Date().toISOString(),
        versao: "1.0",
        dados: {
          viagens,
          clientes,
          assentos,
          quartos,
          pagamentos,
          parcelas,
          documentos,
          configuracoes: config,
          fornecedores,
          equipe,
          pagamentosEmpresa,
          despesasFixas,
          formularios,
          contatos,
          comentarios,
          auditLogs
        }
      };
      
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_completo_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setTimeout(() => {
        setExportando({});
      }, 1500);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      setExportando({});
      alert('Erro ao exportar backup completo!');
    }
  };

  const entidades = [
    { nome: 'Viagens', dados: viagens, icon: Plane, cor: 'blue' },
    { nome: 'Clientes', dados: clientes, icon: Users, cor: 'green' },
    { nome: 'Assentos', dados: assentos, icon: Armchair, cor: 'purple' },
    { nome: 'Quartos', dados: quartos, icon: Hotel, cor: 'orange' },
    { nome: 'Pagamentos', dados: pagamentos, icon: DollarSign, cor: 'emerald' },
    { nome: 'Parcelas', dados: parcelas, icon: FileText, cor: 'yellow' },
    { nome: 'Documentos', dados: documentos, icon: FileText, cor: 'pink' },
    { nome: 'Configuracoes', dados: config, icon: Settings, cor: 'gray' },
    { nome: 'Fornecedores', dados: fornecedores, icon: Building2, cor: 'indigo' },
    { nome: 'Equipe', dados: equipe, icon: UsersRound, cor: 'teal' },
    { nome: 'PagamentosEmpresa', dados: pagamentosEmpresa, icon: DollarSign, cor: 'red' },
    { nome: 'DespesasFixas', dados: despesasFixas, icon: FileText, cor: 'amber' },
    { nome: 'Formularios', dados: formularios, icon: FileText, cor: 'cyan' },
    { nome: 'Contatos', dados: contatos, icon: Users, cor: 'lime' },
    { nome: 'Comentarios', dados: comentarios, icon: FileText, cor: 'fuchsia' },
    { nome: 'AuditLogs', dados: auditLogs, icon: Database, cor: 'slate' },
  ];

  const totalRegistros = entidades.reduce((acc, e) => acc + e.dados.length, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-600" />
          Exportação de Dados
        </h1>
        <p className="text-gray-600">
          Faça backup completo ou parcial dos dados do sistema para importar em outro ambiente
        </p>
      </div>

      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-600" />
              Backup Completo
            </span>
            <Badge className="bg-blue-600 text-white text-lg px-4 py-2">
              {totalRegistros} registros
            </Badge>
          </CardTitle>
          <CardDescription>
            Exporta todos os dados do sistema em um único arquivo JSON
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={exportarTudo}
            disabled={exportando.todos}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {exportando.todos ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Exportar Backup Completo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Exportação Individual</h2>
        <p className="text-sm text-gray-600">Escolha qual entidade deseja exportar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entidades.map((entidade) => {
          const Icon = entidade.icon;
          return (
            <Card key={entidade.nome} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className={`w-8 h-8 bg-${entidade.cor}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 text-${entidade.cor}-600`} />
                    </div>
                    {entidade.nome}
                  </span>
                  <Badge variant="outline">{entidade.dados.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => exportarJSON(entidade.nome, entidade.dados, entidade.icon)}
                  disabled={exportando[entidade.nome] || entidade.dados.length === 0}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  {exportando[entidade.nome] ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                      Exportado!
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Exportar JSON
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            ⚠️ Instruções de Uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-amber-900">
            <p>• <strong>Backup Completo:</strong> Baixa todos os dados em um único arquivo JSON</p>
            <p>• <strong>Exportação Individual:</strong> Baixa apenas os dados de uma entidade específica</p>
            <p>• Os arquivos são salvos em formato JSON e podem ser importados em outro sistema</p>
            <p>• Recomendamos fazer backup completo regularmente para garantir a segurança dos dados</p>
            <p>• Para importar no Lovable ou outro sistema, use os arquivos JSON exportados</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}