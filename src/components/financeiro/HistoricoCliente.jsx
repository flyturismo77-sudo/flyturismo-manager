import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function HistoricoCliente({ cliente, parcelas, onMarcarPaga }) {
  if (!cliente) {
    return (
      <Card className="shadow-lg border-none">
        <CardContent className="p-12 text-center text-gray-500">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Selecione um cliente para ver o histórico financeiro</p>
        </CardContent>
      </Card>
    );
  }

  const parcelasCliente = parcelas.filter(p => p.id_cliente === cliente.id);
  const parcelasPagas = parcelasCliente.filter(p => p.status === 'Paga');
  const parcelasPendentes = parcelasCliente.filter(p => p.status === 'Pendente');
  const parcelasAtrasadas = parcelasCliente.filter(p => {
    if (p.status === 'Paga') return false;
    return new Date(p.data_vencimento) < new Date();
  });

  const totalPago = parcelasPagas.reduce((sum, p) => sum + p.valor_parcela, 0);
  const totalPendente = (cliente.valor_total_pacote || 0) - totalPago;
  const percentualPago = cliente.valor_total_pacote > 0 
    ? (totalPago / cliente.valor_total_pacote) * 100 
    : 0;

  const getStatusIcon = (parcela) => {
    if (parcela.status === 'Paga') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (new Date(parcela.data_vencimento) < new Date()) {
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
    return <Clock className="w-5 h-5 text-amber-600" />;
  };

  const getStatusBadge = (parcela) => {
    if (parcela.status === 'Paga') {
      return <Badge className="bg-green-100 text-green-700">Paga</Badge>;
    }
    if (new Date(parcela.data_vencimento) < new Date()) {
      return <Badge variant="destructive">Atrasada</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-700">Pendente</Badge>;
  };

  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-sky-50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl mb-2">{cliente.nome_completo}</CardTitle>
            <div className="space-y-1 text-sm text-gray-600">
              <p>📱 {cliente.telefone}</p>
              <p>💳 {cliente.forma_pagamento}</p>
            </div>
          </div>
          <Badge className={
            cliente.status_pagamento === 'Pago' ? 'bg-green-100 text-green-700' :
            cliente.status_pagamento === 'Parcial' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }>
            {cliente.status_pagamento}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Resumo Financeiro */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-1">Valor Total</p>
            <p className="text-2xl font-bold text-blue-900">
              R$ {(cliente.valor_total_pacote || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-700 mb-1">Total Pago</p>
            <p className="text-2xl font-bold text-green-900">
              R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-orange-700 mb-1">Total Pendente</p>
            <p className="text-2xl font-bold text-orange-900">
              R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-700 mb-1">Parcelas</p>
            <p className="text-2xl font-bold text-purple-900">
              {parcelasPagas.length}/{parcelasCliente.length}
            </p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progresso do Pagamento</span>
            <span className="font-semibold text-gray-900">{percentualPago.toFixed(1)}%</span>
          </div>
          <Progress value={percentualPago} className="h-3" />
        </div>

        {/* Resumo de Parcelas */}
        {parcelasCliente.length > 0 && (
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>{parcelasPagas.length} paga(s)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{parcelasPendentes.length} pendente(s)</span>
            </div>
            {parcelasAtrasadas.length > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-700 font-semibold">{parcelasAtrasadas.length} atrasada(s)</span>
              </div>
            )}
          </div>
        )}

        {/* Lista de Parcelas */}
        {parcelasCliente.length > 0 ? (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Histórico de Parcelas
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {parcelasCliente
                .sort((a, b) => a.numero_parcela - b.numero_parcela)
                .map(parcela => (
                  <div 
                    key={parcela.id} 
                    className={`border rounded-lg p-3 ${
                      parcela.status === 'Paga' ? 'bg-green-50 border-green-200' : 
                      new Date(parcela.data_vencimento) < new Date() ? 'bg-red-50 border-red-200' :
                      'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(parcela)}
                        <div>
                          <p className="font-semibold text-gray-900">
                            Parcela {parcela.numero_parcela}/{parcela.total_parcelas}
                          </p>
                          <p className="text-sm text-gray-600">
                            Vencimento: {format(new Date(parcela.data_vencimento), "dd/MM/yyyy")}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(parcela)}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-lg text-gray-900">
                        R$ {parcela.valor_parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      {parcela.status !== 'Paga' && (
                        <Button
                          size="sm"
                          onClick={() => onMarcarPaga(parcela)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Marcar como Paga
                        </Button>
                      )}
                      {parcela.status === 'Paga' && parcela.data_pagamento && (
                        <p className="text-sm text-green-700">
                          Pago em: {format(new Date(parcela.data_pagamento), "dd/MM/yyyy")}
                        </p>
                      )}
                    </div>
                    {parcela.forma_pagamento && (
                      <p className="text-xs text-gray-500 mt-2">
                        Forma: {parcela.forma_pagamento}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma parcela cadastrada para este cliente</p>
            <p className="text-sm mt-1">
              {cliente.forma_pagamento === 'À Vista' 
                ? 'Cliente optou por pagamento à vista' 
                : 'As parcelas serão geradas automaticamente'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}