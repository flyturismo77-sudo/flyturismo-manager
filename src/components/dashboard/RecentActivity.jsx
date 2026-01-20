import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plane, User, DollarSign } from "lucide-react";

export default function RecentActivity({ viagens, clientes, pagamentos }) {
  const activities = [
    ...viagens.slice(0, 2).map(v => ({
      type: 'viagem',
      icon: Plane,
      color: 'text-sky-500',
      bg: 'bg-sky-50',
      title: `Nova viagem: ${v.nome}`,
      date: v.created_date,
    })),
    ...clientes.slice(0, 2).map(c => ({
      type: 'cliente',
      icon: User,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      title: `Cliente cadastrado: ${c.nome_completo}`,
      date: c.created_date,
    })),
    ...pagamentos.slice(0, 2).map(p => ({
      type: 'pagamento',
      icon: DollarSign,
      color: 'text-green-500',
      bg: 'bg-green-50',
      title: `Pagamento recebido: R$ ${p.valor.toFixed(2)}`,
      date: p.created_date,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-lg font-bold">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {activities.map((activity, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${activity.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(activity.date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}