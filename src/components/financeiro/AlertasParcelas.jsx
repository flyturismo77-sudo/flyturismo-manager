import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, DollarSign } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function AlertasParcelas({ parcelas, clientes, onMarcarPaga }) {
  const hoje = new Date();
  
  // Parcelas atrasadas
  const atrasadas = parcelas.filter(p => {
    if (p.status === 'Paga') return false;
    const vencimento = new Date(p.data_vencimento);
    return vencimento < hoje;
  });

  // Parcelas próximas do vencimento (5 dias)
  const proximasVencer = parcelas.filter(p => {
    if (p.status === 'Paga') return false;
    const vencimento = new Date(p.data_vencimento);
    const dias = differenceInDays(vencimento, hoje);
    return dias >= 0 && dias <= 5;
  });

  const getClienteNome = (id) => {
    const cliente = clientes.find(c => c.id === id);
    return cliente ? cliente.nome_completo : 'N/A';
  };

  if (atrasadas.length === 0 && proximasVencer.length === 0) {
    return (
      <Card className="shadow-lg border-none bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-8 h-8 text-green-700" />
            </div>
            <h3 className="text-lg font-bold text-green-900 mb-2">
              ✅ Tudo em dia!
            </h3>
            <p className="text-sm text-green-700">
              Nenhuma parcela atrasada ou próxima do vencimento
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {atrasadas.length > 0 && (
        <Card className="shadow-lg border-2 border-red-300 bg-gradient-to-br from-red-50 to-rose-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5" />
              Parcelas Atrasadas ({atrasadas.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {atrasadas.slice(0, 5).map(parcela => {
              const diasAtrasados = Math.abs(differenceInDays(new Date(parcela.data_vencimento), hoje));
              return (
                <div key={parcela.id} className="bg-white rounded-lg p-3 border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {getClienteNome(parcela.id_cliente)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Parcela {parcela.numero_parcela}/{parcela.total_parcelas}
                      </p>
                    </div>
                    <Badge variant="destructive">
                      {diasAtrasados} dia(s) atrasado
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-bold text-red-700">
                        R$ {parcela.valor_parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-gray-500 ml-2">
                        Venc: {format(new Date(parcela.data_vencimento), "dd/MM/yyyy")}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarcarPaga(parcela)}
                      className="text-green-600 hover:bg-green-50"
                    >
                      Marcar como Paga
                    </Button>
                  </div>
                </div>
              );
            })}
            {atrasadas.length > 5 && (
              <p className="text-center text-sm text-red-600 mt-2">
                + {atrasadas.length - 5} parcela(s) atrasada(s)
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {proximasVencer.length > 0 && (
        <Card className="shadow-lg border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Clock className="w-5 h-5" />
              Próximas a Vencer ({proximasVencer.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {proximasVencer.slice(0, 5).map(parcela => {
              const diasRestantes = differenceInDays(new Date(parcela.data_vencimento), hoje);
              return (
                <div key={parcela.id} className="bg-white rounded-lg p-3 border-l-4 border-amber-500">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {getClienteNome(parcela.id_cliente)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Parcela {parcela.numero_parcela}/{parcela.total_parcelas}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-amber-200 text-amber-900">
                      Vence em {diasRestantes} dia(s)
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-bold text-amber-700">
                        R$ {parcela.valor_parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-gray-500 ml-2">
                        Venc: {format(new Date(parcela.data_vencimento), "dd/MM/yyyy")}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarcarPaga(parcela)}
                      className="text-green-600 hover:bg-green-50"
                    >
                      Marcar como Paga
                    </Button>
                  </div>
                </div>
              );
            })}
            {proximasVencer.length > 5 && (
              <p className="text-center text-sm text-amber-600 mt-2">
                + {proximasVencer.length - 5} parcela(s) próxima(s)
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}