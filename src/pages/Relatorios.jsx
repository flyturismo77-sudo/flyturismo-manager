import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, TrendingUp, Users, DollarSign, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Relatorios() {
  const [selectedViagem, setSelectedViagem] = useState("all");

  const { data: viagens = [] } = useQuery({
    queryKey: ['viagens'],
    queryFn: () => base44.entities.Viagem.list("-created_date"),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => base44.entities.Cliente.list(),
  });

  const { data: pagamentos = [] } = useQuery({
    queryKey: ['pagamentos'],
    queryFn: () => base44.entities.Pagamento.list(),
  });

  const filteredClientes = selectedViagem === "all" 
    ? clientes 
    : clientes.filter(c => c.id_viagem === selectedViagem);

  const filteredPagamentos = selectedViagem === "all"
    ? pagamentos
    : pagamentos.filter(p => {
        const cliente = clientes.find(c => c.id === p.id_cliente);
        return cliente?.id_viagem === selectedViagem;
      });

  const viagemSelecionada = viagens.find(v => v.id === selectedViagem);

  const totalRecebido = filteredPagamentos.reduce((sum, p) => sum + (p.valor || 0), 0);

  const totalAPagar = filteredClientes.reduce((sum, c) => 
    sum + ((c.valor_total_pacote || 0) - (c.valor_pago || 0)), 0
  );

  const totalGeral = filteredClientes.reduce((sum, c) => sum + (c.valor_total_pacote || 0), 0);

  const clientesPagos = filteredClientes.filter(c => c.status_pagamento === 'Pago').length;
  const clientesPendentes = filteredClientes.filter(c => c.status_pagamento === 'Pendente').length;
  const clientesParciais = filteredClientes.filter(c => c.status_pagamento === 'Parcial').length;

  const exportToCSV = () => {
    const headers = ['Cliente', 'CPF', 'Telefone', 'Email', 'Viagem', 'Local Embarque', 'Poltrona', 'Valor Total', 'Valor Pago', 'Saldo', 'Status'];
    
    const data = filteredClientes.map(c => {
      const viagem = viagens.find(v => v.id === c.id_viagem);
      return [
        c.nome_completo,
        c.cpf,
        c.telefone,
        c.email || '',
        viagem?.nome || 'N/A',
        c.local_embarque || '-',
        c.poltrona || '-',
        c.valor_total_pacote?.toFixed(2) || '0.00',
        c.valor_pago?.toFixed(2) || '0.00',
        ((c.valor_total_pacote || 0) - (c.valor_pago || 0)).toFixed(2),
        c.status_pagamento
      ];
    });

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${selectedViagem === "all" ? "geral" : viagemSelecionada?.nome}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-500 mt-1">Análises e exportação de dados</p>
      </div>

      <Card className="shadow-lg border-none">
        <CardHeader className="border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Filtrar Relatório</CardTitle>
            <div className="flex gap-3 w-full md:w-auto">
              <Select value={selectedViagem} onValueChange={setSelectedViagem}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Selecione uma viagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Viagens</SelectItem>
                  {viagens.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={exportToCSV} className="bg-gradient-to-r from-green-500 to-green-600">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-none bg-gradient-to-br from-sky-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-sky-700 font-medium">Total de Clientes</p>
                <h3 className="text-4xl font-bold text-sky-900 mt-1">{filteredClientes.length}</h3>
              </div>
              <Users className="w-10 h-10 text-sky-600" />
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-green-600">{clientesPagos} pagos</span>
              <span className="text-yellow-600">{clientesParciais} parciais</span>
              <span className="text-red-600">{clientesPendentes} pendentes</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-green-700 font-medium">Total Recebido</p>
                <h3 className="text-3xl font-bold text-green-900 mt-1">
                  R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-xs text-green-600">{filteredPagamentos.length} pagamento(s)</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-orange-700 font-medium">A Receber</p>
                <h3 className="text-3xl font-bold text-orange-900 mt-1">
                  R$ {totalAPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-600 rotate-180" />
            </div>
            <p className="text-xs text-orange-600">Saldo pendente</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-purple-700 font-medium">Total Geral</p>
                <h3 className="text-3xl font-bold text-purple-900 mt-1">
                  R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <DollarSign className="w-10 h-10 text-purple-600" />
            </div>
            <p className="text-xs text-purple-600">Receita total esperada</p>
          </CardContent>
        </Card>
      </div>

      {selectedViagem !== "all" && viagemSelecionada && (
        <Card className="shadow-lg border-none">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Detalhes da Viagem</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nome</p>
                <p className="font-semibold text-gray-900">{viagemSelecionada.nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Destino</p>
                <p className="font-semibold text-gray-900">{viagemSelecionada.destino}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Data Saída</p>
                <p className="font-semibold text-gray-900">
                  {format(new Date(viagemSelecionada.data_saida), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ocupação</p>
                <p className="font-semibold text-gray-900">
                  {viagemSelecionada.vagas_ocupadas}/{viagemSelecionada.vagas_totais} vagas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg border-none">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Lista Detalhada de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {filteredClientes.map((cliente) => {
              const saldo = (cliente.valor_total_pacote || 0) - (cliente.valor_pago || 0);
              const viagem = viagens.find(v => v.id === cliente.id_viagem);
              return (
                <div key={cliente.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{cliente.nome_completo}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          cliente.status_pagamento === 'Pago' ? 'bg-green-100 text-green-700' :
                          cliente.status_pagamento === 'Parcial' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {cliente.status_pagamento}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{cliente.telefone} • {cliente.email}</p>
                      {cliente.local_embarque && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {cliente.local_embarque}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Saldo</p>
                      <p className={`font-bold text-lg ${saldo > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Pago: R$ {(cliente.valor_pago || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 pt-2 border-t">
                    <div>
                      <span className="font-medium">Viagem:</span> {viagem?.nome || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Poltrona:</span> {cliente.poltrona || '-'}
                    </div>
                    <div>
                      <span className="font-medium">Pagamento:</span> {cliente.forma_pagamento}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span> R$ {(cliente.valor_total_pacote || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredClientes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Nenhum cliente encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}