import React, { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Plane, Users, DollarSign, TrendingUp, AlertCircle, Calendar, Bell, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { startOfMonth, endOfMonth, differenceInDays } from "date-fns";
import { createPageUrl } from "@/utils";
import StatCard from "../components/dashboard/StatCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [selectedViagem, setSelectedViagem] = React.useState("all");

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
        const isAdminByEmail = user?.email?.toLowerCase().includes('flyturadm');
        setIsAdmin(isAdminByEmail || user.cargo === 'Administrador' || user.role === 'admin');
      } catch (error) {
        base44.auth.redirectToLogin(createPageUrl('Dashboard'));
      }
    };
    getUser();
  }, []);

  const { data: viagens = [] } = useQuery({
    queryKey: ['viagens'],
    queryFn: () => base44.entities.Viagem.filter({ arquivada: false }, "-created_date"),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => base44.entities.Cliente.filter({ arquivado: false }, "-created_date"),
  });

  const { data: pagamentos = [] } = useQuery({
    queryKey: ['pagamentos'],
    queryFn: () => base44.entities.Pagamento.list("-data_pagamento"),
    enabled: isAdmin,
  });

  const viagensFiltradas = selectedViagem === "all" ? viagens : viagens.filter(v => v.id === selectedViagem);
  const clientesFiltrados = selectedViagem === "all" ? clientes : clientes.filter(c => c.id_viagem === selectedViagem);
  const pagamentosFiltrados = selectedViagem === "all" 
    ? pagamentos 
    : pagamentos.filter(p => {
        const cliente = clientes.find(c => c.id === p.id_cliente);
        return cliente?.id_viagem === selectedViagem;
      });

  const totalReceita = isAdmin ? pagamentosFiltrados.reduce((sum, p) => sum + (p.valor || 0), 0) : 0;
  const clientesPendentes = clientesFiltrados.filter(c => c.status_pagamento !== "Pago").length;
  
  const viagensAtivas = viagensFiltradas.filter(v => 
    v.status === "Aberta" || v.status === "Em Andamento"
  );

  const now = new Date();
  const mesAtual = startOfMonth(now);
  const fimMes = endOfMonth(now);
  const pagamentosDoMes = isAdmin ? pagamentosFiltrados.filter(p => {
    const dataPag = new Date(p.data_pagamento);
    return dataPag >= mesAtual && dataPag <= fimMes;
  }) : [];
  const receitaMensal = pagamentosDoMes.reduce((sum, p) => sum + (p.valor || 0), 0);

  const ocupacaoData = viagensAtivas.slice(0, 5).map(v => ({
    name: v.nome.slice(0, 15) + (v.nome.length > 15 ? '...' : ''),
    ocupadas: v.vagas_ocupadas,
    disponiveis: v.vagas_totais - v.vagas_ocupadas
  }));

  const statusPagamento = isAdmin ? [
    { name: 'Pago', value: clientesFiltrados.filter(c => c.status_pagamento === 'Pago').length },
    { name: 'Parcial', value: clientesFiltrados.filter(c => c.status_pagamento === 'Parcial').length },
    { name: 'Pendente', value: clientesFiltrados.filter(c => c.status_pagamento === 'Pendente').length },
  ].filter(item => item.value > 0) : [];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const totalVagasDisponiveis = viagensFiltradas.reduce((sum, v) => sum + v.vagas_totais, 0);
  const totalVagasOcupadas = viagensFiltradas.reduce((sum, v) => sum + v.vagas_ocupadas, 0);
  const taxaOcupacao = totalVagasDisponiveis > 0 
    ? Math.round((totalVagasOcupadas / totalVagasDisponiveis) * 100) 
    : 0;

  // ALERTAS INTELIGENTES
  const alertas = [];

  // Alerta: 10 vagas ou menos
  viagensAtivas.forEach(viagem => {
    const vagasRestantes = viagem.vagas_totais - viagem.vagas_ocupadas;
    if (vagasRestantes <= 10 && vagasRestantes > 0) {
      alertas.push({
        tipo: 'warning',
        titulo: 'Vagas limitadas!',
        mensagem: `Restam apenas ${vagasRestantes} vagas na viagem "${viagem.nome}".`
      });
    }
  });

  // Alerta: 5 dias para embarque
  viagensAtivas.forEach(viagem => {
    const diasParaEmbarque = differenceInDays(new Date(viagem.data_saida), now);
    if (diasParaEmbarque <= 5 && diasParaEmbarque > 0) {
      alertas.push({
        tipo: 'info',
        titulo: 'Embarque próximo!',
        mensagem: `Faltam ${diasParaEmbarque} dia(s) para o embarque da viagem "${viagem.nome}".`
      });
    }
  });

  // Alerta: Parcelas atrasadas
  const clientesComAtraso = clientesFiltrados.filter(c => {
    if (c.status_pagamento === 'Pago') return false;
    const ultimoPagamento = pagamentosFiltrados
      .filter(p => p.id_cliente === c.id)
      .sort((a, b) => new Date(b.data_pagamento) - new Date(a.data_pagamento))[0];
    
    if (ultimoPagamento) {
      const diasDesdeUltimo = differenceInDays(now, new Date(ultimoPagamento.data_pagamento));
      return diasDesdeUltimo > 30;
    }
    return false;
  });

  if (clientesComAtraso.length > 0) {
    alertas.push({
      tipo: 'error',
      titulo: 'Pagamentos atrasados!',
      mensagem: `${clientesComAtraso.length} cliente(s) com pagamento atrasado há mais de 30 dias.`
    });
  }

  // Mostrar mensagem de boas-vindas se não houver dados
  const sistemaNovo = viagens.length === 0 && clientes.length === 0;

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Bem-vindo ao painel de controle da Fly Turismo</p>
        </div>
        
        {!sistemaNovo && (
          <div className="w-full md:w-64">
            <Select value={selectedViagem} onValueChange={setSelectedViagem}>
              <SelectTrigger className="bg-white shadow-md">
                <SelectValue placeholder="Todas as Viagens" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Viagens</SelectItem>
                {viagens.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* MENSAGEM DE SISTEMA LIMPO */}
      {sistemaNovo && (
        <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-900 font-bold text-lg">✅ Sistema Restaurado com Sucesso!</AlertTitle>
          <AlertDescription className="text-green-700 mt-2">
            <p className="mb-2">Nenhum dado de demonstração ativo.</p>
            <p className="font-medium">🚀 Pronto para novos cadastros!</p>
            <p className="text-sm mt-3">
              Comece criando sua primeira viagem na aba <strong>Viagens</strong> e cadastrando os clientes na aba <strong>Clientes</strong>.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* ALERTAS */}
      {alertas.length > 0 && (
        <div className="space-y-3">
          {alertas.map((alerta, index) => (
            <Alert key={index} variant={alerta.tipo === 'error' ? 'destructive' : 'default'} className={`
              ${alerta.tipo === 'warning' ? 'bg-yellow-50 border-yellow-200' : ''}
              ${alerta.tipo === 'info' ? 'bg-blue-50 border-blue-200' : ''}
            `}>
              <Bell className="h-4 w-4" />
              <AlertTitle>{alerta.titulo}</AlertTitle>
              <AlertDescription>{alerta.mensagem}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Viagens"
          value={viagensFiltradas.length}
          subtitle={`${viagensAtivas.length} viagens ativas`}
          icon={Plane}
          gradient="from-sky-400 to-blue-600"
          delay={0}
        />
        <StatCard
          title="Total de Clientes"
          value={clientesFiltrados.length}
          subtitle={`${clientesPendentes} com pendências`}
          icon={Users}
          gradient="from-purple-400 to-purple-600"
          delay={0.1}
        />
        {isAdmin && (
          <StatCard
            title="Receita Total"
            value={`R$ ${totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            subtitle="Em pagamentos recebidos"
            icon={DollarSign}
            gradient="from-green-400 to-green-600"
            delay={0.2}
          />
        )}
        <StatCard
          title="Taxa de Ocupação"
          value={`${taxaOcupacao}%`}
          subtitle="Média geral de ocupação"
          icon={TrendingUp}
          gradient="from-amber-400 to-orange-600"
          delay={0.3}
        />
      </div>

      {!sistemaNovo && (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-xl border-none">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-600" />
                  Ocupação de Viagens Ativas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {ocupacaoData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ocupacaoData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="ocupadas" fill="#0ea5e9" name="Ocupadas" />
                      <Bar dataKey="disponiveis" fill="#94a3b8" name="Disponíveis" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Nenhuma viagem ativa no momento
                  </div>
                )}
              </CardContent>
            </Card>

            {isAdmin && (
              <Card className="shadow-xl border-none">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Status de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {statusPagamento.length > 0 ? (
                    <div className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={statusPagamento}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusPagamento.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      Nenhum dado disponível
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-none">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-bold">Viagens em Destaque</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {viagensAtivas.slice(0, 3).map((viagem) => {
                      const ocupacao = (viagem.vagas_ocupadas / viagem.vagas_totais) * 100;
                      return (
                        <div key={viagem.id} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-100">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{viagem.nome}</h4>
                              <p className="text-sm text-gray-600">{viagem.destino}</p>
                            </div>
                            <Badge className="bg-sky-100 text-sky-700 border-none">
                              {viagem.status}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Ocupação</span>
                              <span className="font-semibold text-gray-900">
                                {viagem.vagas_ocupadas}/{viagem.vagas_totais} vagas
                              </span>
                            </div>
                            <Progress value={ocupacao} className="h-2" />
                          </div>
                        </div>
                      );
                    })}
                    {viagensAtivas.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Plane className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Nenhuma viagem ativa no momento</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {isAdmin && (
                <Card className="shadow-xl border-none bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-green-700 font-medium">Receita do Mês</p>
                        <h3 className="text-3xl font-bold text-green-900 mt-1">
                          R$ {receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                      </div>
                      <DollarSign className="w-12 h-12 text-green-600" />
                    </div>
                    <p className="text-xs text-green-600">{pagamentosDoMes.length} pagamento(s) recebido(s)</p>
                  </CardContent>
                </Card>
              )}

              <RecentActivity 
                viagens={viagensFiltradas}
                clientes={clientesFiltrados}
                pagamentos={isAdmin ? pagamentosFiltrados : []}
              />

              {clientesPendentes > 0 && (
                <Card className="shadow-xl border-none bg-gradient-to-br from-orange-50 to-red-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Atenção!</h4>
                        <p className="text-sm text-gray-700">
                          {clientesPendentes} cliente{clientesPendentes > 1 ? 's' : ''} com pagamento pendente
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}