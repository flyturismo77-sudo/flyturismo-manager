import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Users, Clock } from "lucide-react";

export default function FinanceiroPorViagem({ viagem, clientes, parcelas }) {
  if (!viagem) {
    return (
      <Card className="shadow-lg border-none">
        <CardContent className="p-12 text-center text-gray-500">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Selecione uma viagem para ver o resumo financeiro</p>
        </CardContent>
      </Card>
    );
  }

  const clientesViagem = clientes.filter(c => c.id_viagem === viagem.id);
  const parcelasViagem = parcelas.filter(p => p.id_viagem === viagem.id);
  
  const totalEsperado = clientesViagem.reduce((sum, c) => sum + (c.valor_total_pacote || 0), 0);
  const totalRecebido = clientesViagem.reduce((sum, c) => sum + (c.valor_pago || 0), 0);
  const totalPendente = totalEsperado - totalRecebido;
  
  const parcelasPagas = parcelasViagem.filter(p => p.status === 'Paga').length;
  const totalParcelas = parcelasViagem.length;
  
  const clientesPagos = clientesViagem.filter(c => c.status_pagamento === 'Pago').length;
  const clientesPendentes = clientesViagem.filter(c => c.status_pagamento === 'Pendente').length;
  const clientesParciais = clientesViagem.filter(c => c.status_pagamento === 'Parcial').length;

  const percentualRecebido = totalEsperado > 0 ? (totalRecebido / totalEsperado) * 100 : 0;

  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardTitle className="text-2xl">{viagem.nome}</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          {viagem.destino} • {clientesViagem.length} cliente(s)
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="text-xs text-green-700 font-medium">Total Recebido</p>
                <p className="text-2xl font-bold text-green-900">
                  R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="text-xs text-amber-700 font-medium">Total Pendente</p>
                <p className="text-2xl font-bold text-amber-900">
                  R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="text-xs text-blue-700 font-medium">Total Esperado</p>
                <p className="text-2xl font-bold text-blue-900">
                  R$ {totalEsperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progresso de Recebimento */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Progresso de Recebimento</span>
            <span className="font-bold text-gray-900">{percentualRecebido.toFixed(1)}%</span>
          </div>
          <Progress value={percentualRecebido} className="h-4" />
        </div>

        {/* Status dos Clientes */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Status dos Clientes
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-700">{clientesPagos}</p>
              <p className="text-xs text-green-600 mt-1">Pagos</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-700">{clientesParciais}</p>
              <p className="text-xs text-amber-600 mt-1">Parciais</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-700">{clientesPendentes}</p>
              <p className="text-xs text-red-600 mt-1">Pendentes</p>
            </div>
          </div>
        </div>

        {/* Informações de Parcelas */}
        {totalParcelas > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-700 font-medium">Parcelas Pagas</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {parcelasPagas}/{totalParcelas}
                </p>
              </div>
              <Badge className="bg-purple-200 text-purple-900">
                {totalParcelas > 0 ? ((parcelasPagas / totalParcelas) * 100).toFixed(0) : 0}% concluído
              </Badge>
            </div>
          </div>
        )}

        {/* Lista Resumida de Clientes */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Clientes da Viagem</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {clientesViagem.map(cliente => (
              <div key={cliente.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{cliente.nome_completo}</p>
                  <p className="text-xs text-gray-600">
                    R$ {(cliente.valor_pago || 0).toFixed(2)} / R$ {(cliente.valor_total_pacote || 0).toFixed(2)}
                  </p>
                </div>
                <Badge className={
                  cliente.status_pagamento === 'Pago' ? 'bg-green-100 text-green-700' :
                  cliente.status_pagamento === 'Parcial' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }>
                  {cliente.status_pagamento}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}