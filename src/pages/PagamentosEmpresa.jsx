import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, CreditCard, TrendingDown, Loader2, Eye, Download, FileText } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const tipoColors = {
  "Hotel": "bg-purple-100 text-purple-700",
  "Ônibus": "bg-blue-100 text-blue-700",
  "Alimentação": "bg-green-100 text-green-700",
  "Combustível": "bg-orange-100 text-orange-700",
  "Pedágios": "bg-yellow-100 text-yellow-700",
  "Guia Turístico": "bg-pink-100 text-pink-700",
  "Outros": "bg-gray-100 text-gray-700"
};

export default function PagamentosEmpresa() {
  const [showForm, setShowForm] = useState(false);
  const [uploadingComprovante, setUploadingComprovante] = useState(false);
  const [viewingComprovante, setViewingComprovante] = useState(null);
  const [formData, setFormData] = useState({
    id_viagem: '',
    tipo_despesa: 'Hotel',
    nome_fornecedor: '',
    valor: 0,
    data_pagamento: new Date().toISOString().split('T')[0],
    forma_pagamento: 'PIX',
    comprovante_url: '',
    observacoes: ''
  });

  const queryClient = useQueryClient();

  const { data: pagamentos = [] } = useQuery({
    queryKey: ['pagamentos-empresa'],
    queryFn: () => base44.entities.PagamentoEmpresa.list('-data_pagamento'),
  });

  const { data: viagens = [] } = useQuery({
    queryKey: ['viagens'],
    queryFn: () => base44.entities.Viagem.list(),
  });

  const { data: pagamentosClientes = [] } = useQuery({
    queryKey: ['pagamentos'],
    queryFn: () => base44.entities.Pagamento.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PagamentoEmpresa.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['pagamentos-empresa']);
      setShowForm(false);
      setFormData({
        id_viagem: '',
        tipo_despesa: 'Hotel',
        nome_fornecedor: '',
        valor: 0,
        data_pagamento: new Date().toISOString().split('T')[0],
        forma_pagamento: 'PIX',
        comprovante_url: '',
        observacoes: ''
      });
    },
  });

  const handleComprovanteUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingComprovante(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, comprovante_url: file_url });
    setUploadingComprovante(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const totalDespesas = pagamentos.reduce((sum, p) => sum + (p.valor || 0), 0);
  const totalReceitas = pagamentosClientes.reduce((sum, p) => sum + (p.valor || 0), 0);
  const lucroTotal = totalReceitas - totalDespesas;

  const now = new Date();
  const mesAtual = startOfMonth(now);
  const fimMes = endOfMonth(now);
  
  const despesasMes = pagamentos.filter(p => {
    const data = new Date(p.data_pagamento);
    return data >= mesAtual && data <= fimMes;
  }).reduce((sum, p) => sum + (p.valor || 0), 0);

  const receitasMes = pagamentosClientes.filter(p => {
    const data = new Date(p.data_pagamento);
    return data >= mesAtual && data <= fimMes;
  }).reduce((sum, p) => sum + (p.valor || 0), 0);

  const despesasPorTipo = {};
  pagamentos.forEach(p => {
    despesasPorTipo[p.tipo_despesa] = (despesasPorTipo[p.tipo_despesa] || 0) + p.valor;
  });

  const chartData = Object.entries(despesasPorTipo).map(([tipo, valor]) => ({
    tipo,
    valor
  }));

  const getViagemNome = (id) => {
    const viagem = viagens.find(v => v.id === id);
    return viagem ? viagem.nome : 'N/A';
  };

  // Dados para gráfico de receitas x despesas mensais (últimos 6 meses)
  const getLast6MonthsData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      
      const despesas = pagamentos.filter(p => {
        const d = new Date(p.data_pagamento);
        return d >= start && d <= end;
      }).reduce((sum, p) => sum + p.valor, 0);
      
      const receitas = pagamentosClientes.filter(p => {
        const d = new Date(p.data_pagamento);
        return d >= start && d <= end;
      }).reduce((sum, p) => sum + p.valor, 0);
      
      months.push({
        mes: format(date, 'MMM/yy', { locale: ptBR }),
        receitas,
        despesas,
        lucro: receitas - despesas
      });
    }
    return months;
  };

  const monthlyData = getLast6MonthsData();

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Despesas da Empresa</h1>
          <p className="text-gray-500 mt-1">Controle de pagamentos e fornecedores</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Despesa
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-none bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-red-700 font-medium">Total Despesas</p>
                <h3 className="text-3xl font-bold text-red-900 mt-1">
                  R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-700" />
              </div>
            </div>
            <p className="text-xs text-red-600">{pagamentos.length} pagamento(s) registrado(s)</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-green-700 font-medium">Total Receitas</p>
                <h3 className="text-3xl font-bold text-green-900 mt-1">
                  R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-700" />
              </div>
            </div>
            <p className="text-xs text-green-600">De clientes</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-blue-700 font-medium">Lucro Total</p>
                <h3 className={`text-3xl font-bold mt-1 ${lucroTotal >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                  R$ {lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <p className="text-xs text-blue-600">Receitas - Despesas</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-amber-700 font-medium mb-2">Mês Atual</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-amber-600">Receitas</p>
                  <p className="text-lg font-bold text-green-700">
                    R$ {receitasMes.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-amber-600">Despesas</p>
                  <p className="text-lg font-bold text-red-700">
                    R$ {despesasMes.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-none">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Despesas por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                  <Bar dataKey="valor" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Nenhuma despesa registrada
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Receitas vs Despesas (Últimos 6 Meses)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="receitas" stroke="#10b981" name="Receitas" strokeWidth={2} />
                <Line type="monotone" dataKey="despesas" stroke="#ef4444" name="Despesas" strokeWidth={2} />
                <Line type="monotone" dataKey="lucro" stroke="#3b82f6" name="Lucro" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-none">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Histórico de Despesas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Viagem</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Forma</TableHead>
                <TableHead>Comprovante</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagamentos.map((pag) => (
                <TableRow key={pag.id} className="hover:bg-gray-50">
                  <TableCell>
                    {format(new Date(pag.data_pagamento), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge className={tipoColors[pag.tipo_despesa]}>
                      {pag.tipo_despesa}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{pag.nome_fornecedor}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {getViagemNome(pag.id_viagem)}
                  </TableCell>
                  <TableCell className="font-bold text-red-700">
                    R$ {pag.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{pag.forma_pagamento}</Badge>
                  </TableCell>
                  <TableCell>
                    {pag.comprovante_url ? (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingComprovante(pag.comprovante_url)}
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4 text-sky-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(pag.comprovante_url, '_blank')}
                          title="Baixar"
                        >
                          <Download className="w-4 h-4 text-green-600" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Sem comprovante</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {pag.observacoes || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {pagamentos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Nenhuma despesa registrada ainda</p>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Registrar Despesa</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Viagem</Label>
                <Select
                  value={formData.id_viagem}
                  onValueChange={(value) => setFormData({...formData, id_viagem: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a viagem (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {viagens.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Despesa *</Label>
                <Select
                  value={formData.tipo_despesa}
                  onValueChange={(value) => setFormData({...formData, tipo_despesa: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hotel">Hotel</SelectItem>
                    <SelectItem value="Ônibus">Ônibus</SelectItem>
                    <SelectItem value="Alimentação">Alimentação</SelectItem>
                    <SelectItem value="Combustível">Combustível</SelectItem>
                    <SelectItem value="Pedágios">Pedágios</SelectItem>
                    <SelectItem value="Guia Turístico">Guia Turístico</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nome do Fornecedor *</Label>
              <Input
                value={formData.nome_fornecedor}
                onChange={(e) => setFormData({...formData, nome_fornecedor: e.target.value})}
                placeholder="Ex: Hotel Fazenda XYZ"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor (R$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Data do Pagamento *</Label>
                <Input
                  type="date"
                  value={formData.data_pagamento}
                  onChange={(e) => setFormData({...formData, data_pagamento: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Forma de Pagamento *</Label>
              <Select
                value={formData.forma_pagamento}
                onValueChange={(value) => setFormData({...formData, forma_pagamento: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="Cartão Crédito">Cartão Crédito</SelectItem>
                  <SelectItem value="Cartão Débito">Cartão Débito</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                  <SelectItem value="Boleto">Boleto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Comprovante de Pagamento</Label>
              <div className="flex gap-4 items-start">
                {formData.comprovante_url && (
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden">
                      {formData.comprovante_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img src={formData.comprovante_url} alt="Comprovante" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleComprovanteUpload}
                    disabled={uploadingComprovante}
                  />
                  {uploadingComprovante && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando comprovante...
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Formatos aceitos: JPG, PNG, PDF</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Input
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Informações adicionais"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Registrar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingComprovante} onOpenChange={() => setViewingComprovante(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Comprovante de Pagamento</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {viewingComprovante?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img src={viewingComprovante} alt="Comprovante" className="max-w-full max-h-[70vh] object-contain" />
            ) : (
              <iframe src={viewingComprovante} className="w-full h-[70vh]" />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => window.open(viewingComprovante, '_blank')}>
              <Download className="w-4 h-4 mr-2" />
              Baixar Comprovante
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}