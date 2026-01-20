import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Download,
  Loader2,
  Database,
  FileText,
  HardDrive,
  CheckCircle,
  AlertCircle,
  Clock,
  Archive,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export default function GerenciamentoArquivos() {
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: viagens = [] } = useQuery({
    queryKey: ['viagens'],
    queryFn: () => base44.entities.Viagem.list("-created_date"),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => base44.entities.Cliente.list("-created_date"),
  });

  const { data: pagamentos = [] } = useQuery({
    queryKey: ['pagamentos'],
    queryFn: () => base44.entities.Pagamento.list("-data_pagamento"),
  });

  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const configs = await base44.entities.ConfiguracaoEmpresa.list();
      return configs[0];
    },
  });

  const getLastBackupDate = () => {
    const lastBackup = localStorage.getItem('fly_turismo_last_backup');
    return lastBackup ? new Date(lastBackup) : null;
  };

  const getDaysSinceLastBackup = () => {
    const lastBackup = getLastBackupDate();
    if (!lastBackup) return null;
    const now = new Date();
    const diffTime = Math.abs(now - lastBackup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const generateFullBackup = async () => {
    setBackupLoading(true);
    setShowBackupDialog(true);

    try {
      // Simular tempo de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const agora = new Date();
      const timestamp = format(agora, "dd-MM-yyyy_HH-mm", { locale: ptBR });
      const nomeArquivo = `Backup_FlyTurismo_${timestamp}.json`;

      // Coletar todos os dados do sistema
      const backupData = {
        metadata: {
          backup_date: agora.toISOString(),
          system_version: "1.0.0",
          empresa: config?.nome_empresa || "Fly Turismo",
          total_viagens: viagens.length,
          total_clientes: clientes.length,
          total_pagamentos: pagamentos.length,
        },
        viagens: viagens,
        clientes: clientes,
        pagamentos: pagamentos,
        configuracao: config,
      };

      // Converter para JSON formatado
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Criar link de download
      const link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Salvar data do último backup
      localStorage.setItem('fly_turismo_last_backup', agora.toISOString());

      setBackupSuccess(true);
      setTimeout(() => {
        setBackupSuccess(false);
        setShowBackupDialog(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao gerar backup:", error);
      alert("Erro ao gerar backup. Por favor, tente novamente.");
    } finally {
      setBackupLoading(false);
    }
  };

  const exportarRelatorioViagem = (viagem) => {
    const clientesDaViagem = clientes.filter(c => c.id_viagem === viagem.id);
    const pagamentosDaViagem = pagamentos.filter(p => {
      const cliente = clientes.find(c => c.id === p.id_cliente);
      return cliente?.id_viagem === viagem.id;
    });

    const relatorio = {
      viagem: {
        nome: viagem.nome,
        destino: viagem.destino,
        data_saida: viagem.data_saida,
        data_retorno: viagem.data_retorno,
        vagas_totais: viagem.vagas_totais,
        vagas_ocupadas: viagem.vagas_ocupadas,
      },
      clientes: clientesDaViagem,
      pagamentos: pagamentosDaViagem,
      estatisticas: {
        total_clientes: clientesDaViagem.length,
        total_pagamentos: pagamentosDaViagem.length,
        valor_total_recebido: pagamentosDaViagem.reduce((sum, p) => sum + p.valor, 0),
        taxa_ocupacao: Math.round((viagem.vagas_ocupadas / viagem.vagas_totais) * 100),
      },
      gerado_em: new Date().toISOString(),
    };

    const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: ptBR });
    const nomeArquivo = `Relatorio_${viagem.nome.replace(/\s+/g, '_')}_${timestamp}.json`;

    const jsonString = JSON.stringify(relatorio, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportarDadosFinanceiros = () => {
    const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: ptBR });
    const nomeArquivo = `Financeiro_FlyTurismo_${timestamp}.json`;

    const dadosFinanceiros = {
      pagamentos: pagamentos,
      clientes_financeiro: clientes.map(c => ({
        nome: c.nome_completo,
        cpf: c.cpf,
        viagem: viagens.find(v => v.id === c.id_viagem)?.nome,
        valor_total_pacote: c.valor_total_pacote,
        valor_pago: c.valor_pago,
        status_pagamento: c.status_pagamento,
        forma_pagamento: c.forma_pagamento,
      })),
      resumo: {
        total_recebido: pagamentos.reduce((sum, p) => sum + p.valor, 0),
        total_a_receber: clientes.reduce((sum, c) => sum + ((c.valor_total_pacote || 0) - (c.valor_pago || 0)), 0),
        total_clientes: clientes.length,
        clientes_pagos: clientes.filter(c => c.status_pagamento === 'Pago').length,
        clientes_pendentes: clientes.filter(c => c.status_pagamento === 'Pendente').length,
      },
      gerado_em: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(dadosFinanceiros, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lastBackupDate = getLastBackupDate();
  const daysSinceBackup = getDaysSinceLastBackup();

  const filteredViagens = viagens.filter(v =>
    v.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.destino?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Arquivos e Backup</h1>
        <p className="text-gray-500 mt-1">Sistema profissional de backup e exportação de dados</p>
      </div>

      {/* Status do último backup */}
      {daysSinceBackup !== null && (
        <Alert className={daysSinceBackup > 30 ? "border-red-500 bg-red-50" : daysSinceBackup > 15 ? "border-yellow-500 bg-yellow-50" : "border-green-500 bg-green-50"}>
          {daysSinceBackup > 30 ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : daysSinceBackup > 15 ? (
            <Clock className="h-4 w-4 text-yellow-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertTitle className={daysSinceBackup > 30 ? "text-red-900" : daysSinceBackup > 15 ? "text-yellow-900" : "text-green-900"}>
            {daysSinceBackup > 30 ? "⚠️ Atenção: Backup Desatualizado!" : daysSinceBackup > 15 ? "🔔 Lembrete: Faça um novo backup" : "✅ Backup Atualizado"}
          </AlertTitle>
          <AlertDescription className={daysSinceBackup > 30 ? "text-red-700" : daysSinceBackup > 15 ? "text-yellow-700" : "text-green-700"}>
            Último backup realizado em: <strong>{format(lastBackupDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</strong> ({daysSinceBackup} dia(s) atrás)
            {daysSinceBackup > 15 && " - Recomendamos realizar um novo backup."}
          </AlertDescription>
        </Alert>
      )}

      {!lastBackupDate && (
        <Alert className="border-orange-500 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-900">⚠️ Nenhum backup registrado</AlertTitle>
          <AlertDescription className="text-orange-700">
            Nenhum backup foi realizado ainda. Recomendamos fazer o primeiro backup do sistema agora.
          </AlertDescription>
        </Alert>
      )}

      {/* Backup Completo do Sistema */}
      <Card className="shadow-xl border-none bg-gradient-to-br from-blue-50 to-sky-100">
        <CardHeader className="border-b border-blue-200">
          <CardTitle className="text-2xl flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            Backup Completo do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              Gere uma cópia completa de todos os dados do sistema para armazenamento seguro.
              O backup inclui: viagens, clientes, pagamentos, configurações e relatórios.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-1">Total de Viagens</p>
                <p className="text-3xl font-bold text-blue-600">{viagens.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-1">Total de Clientes</p>
                <p className="text-3xl font-bold text-purple-600">{clientes.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-1">Total de Pagamentos</p>
                <p className="text-3xl font-bold text-green-600">{pagamentos.length}</p>
              </div>
            </div>

            <Button
              onClick={generateFullBackup}
              disabled={backupLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg text-lg py-6"
            >
              {backupLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Gerando Backup Completo...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Gerar Backup Completo Agora
                </>
              )}
            </Button>

            <p className="text-xs text-gray-600 text-center">
              ⚠️ O arquivo será baixado automaticamente no formato JSON. Guarde-o em local seguro.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Exportação de Dados Financeiros */}
      <Card className="shadow-xl border-none">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-xl flex items-center gap-3">
            <HardDrive className="w-6 h-6 text-green-600" />
            Exportação de Dados Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 mb-4">
            Exporte todos os dados financeiros do sistema, incluindo pagamentos, valores pendentes e resumos.
          </p>
          <Button
            onClick={exportarDadosFinanceiros}
            variant="outline"
            className="w-full border-green-500 text-green-700 hover:bg-green-50"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exportar Relatório Financeiro Completo
          </Button>
        </CardContent>
      </Card>

      {/* Exportação por Viagem */}
      <Card className="shadow-xl border-none">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-xl flex items-center gap-3">
            <Archive className="w-6 h-6 text-amber-600" />
            Exportação por Viagem
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 mb-4">
            Exporte dados detalhados de cada viagem individualmente para arquivamento mensal.
          </p>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar viagens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredViagens.map((viagem) => {
              const clientesDaViagem = clientes.filter(c => c.id_viagem === viagem.id);
              return (
                <div key={viagem.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{viagem.nome}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {viagem.destino} • {format(new Date(viagem.data_saida), "dd/MM/yyyy")}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {clientesDaViagem.length} cliente(s)
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {viagem.vagas_ocupadas}/{viagem.vagas_totais} vagas
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => exportarRelatorioViagem(viagem)}
                      variant="outline"
                      size="sm"
                      className="ml-4"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              );
            })}
            {filteredViagens.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma viagem encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de progresso de backup */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {backupSuccess ? "✅ Backup Concluído!" : "Gerando Backup..."}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            {backupLoading && (
              <>
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 text-center">
                  Coletando e compactando dados do sistema...
                  <br />
                  <span className="text-sm text-gray-500">Por favor, aguarde.</span>
                </p>
              </>
            )}
            {backupSuccess && (
              <>
                <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                <p className="text-gray-900 font-semibold text-center mb-2">
                  Backup gerado com sucesso!
                </p>
                <p className="text-sm text-gray-600 text-center">
                  O arquivo foi baixado automaticamente.
                  <br />
                  Guarde-o em local seguro.
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Informações de segurança */}
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">ℹ️ Recomendações de Segurança</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Realize backups mensais e guarde em local seguro (HD externo, nuvem)</li>
                <li>Mantenha pelo menos 3 cópias de backup de períodos diferentes</li>
                <li>Teste a restauração dos backups periodicamente</li>
                <li>Não compartilhe os arquivos de backup publicamente</li>
                <li>Use nomes descritivos com data para facilitar identificação</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}