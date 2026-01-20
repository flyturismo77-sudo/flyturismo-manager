import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Search, 
  ExternalLink, 
  Send, 
  Users, 
  MapPin,
  Armchair,
  CheckCircle2
} from "lucide-react";
import { format } from 'date-fns';

export default function WhatsApp() {
  const [selectedViagem, setSelectedViagem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientes, setSelectedClientes] = useState([]);
  const [mensagemGrupo, setMensagemGrupo] = useState("");

  const { data: viagens = [] } = useQuery({
    queryKey: ['viagens'],
    queryFn: () => base44.entities.Viagem.list(),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => base44.entities.Cliente.list(),
  });

  const viagemSelecionada = viagens.find(v => v.id === selectedViagem);
  const clientesDaViagem = selectedViagem 
    ? clientes.filter(c => c.id_viagem === selectedViagem)
    : clientes;

  const clientesFiltrados = clientesDaViagem.filter(cliente => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      cliente.nome_completo?.toLowerCase().includes(search) ||
      cliente.cpf?.includes(search) ||
      cliente.telefone?.includes(search)
    );
  });

  const enviarWhatsApp = (cliente) => {
    if (!cliente.telefone) {
      alert('Cliente não possui telefone cadastrado!');
      return;
    }
    const telefone = cliente.telefone.replace(/\D/g, '');
    const numero = telefone.startsWith('55') ? telefone : `55${telefone}`;
    
    let mensagem = `Olá ${cliente.nome_completo}!`;
    
    if (viagemSelecionada) {
      mensagem += `
    
📌 Informações da sua viagem:
🚌 ${viagemSelecionada.nome} - ${viagemSelecionada.destino}
📅 Saída: ${format(new Date(viagemSelecionada.data_saida), "dd/MM/yyyy")}
📅 Retorno: ${format(new Date(viagemSelecionada.data_retorno), "dd/MM/yyyy")}
${cliente.poltrona ? `🪑 Poltrona: #${cliente.poltrona}` : '⚠️ Assento ainda não definido'}
${cliente.local_embarque ? `📍 Embarque: ${cliente.local_embarque}` : ''}

Qualquer dúvida, estamos à disposição!`;
    } else {
      mensagem += `\n\nComo podemos ajudar?`;
    }
    
    const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const toggleClienteSelection = (clienteId) => {
    setSelectedClientes(prev => 
      prev.includes(clienteId) 
        ? prev.filter(id => id !== clienteId)
        : [...prev, clienteId]
    );
  };

  const selecionarTodos = () => {
    if (selectedClientes.length === clientesFiltrados.length) {
      setSelectedClientes([]);
    } else {
      setSelectedClientes(clientesFiltrados.map(c => c.id));
    }
  };

  const enviarWhatsAppGrupo = () => {
    if (selectedClientes.length === 0) {
      alert('Selecione pelo menos um cliente!');
      return;
    }

    const mensagemBase = mensagemGrupo || `Olá!${viagemSelecionada ? `
    
📌 Informações da viagem:
🚌 ${viagemSelecionada.nome} - ${viagemSelecionada.destino}
📅 Saída: ${format(new Date(viagemSelecionada.data_saida), "dd/MM/yyyy")}

Qualquer dúvida, estamos à disposição!` : '\n\nComo podemos ajudar?'}`;

    let enviados = 0;
    selectedClientes.forEach(clienteId => {
      const cliente = clientes.find(c => c.id === clienteId);
      if (cliente?.telefone) {
        setTimeout(() => {
          const telefone = cliente.telefone.replace(/\D/g, '');
          const numero = telefone.startsWith('55') ? telefone : `55${telefone}`;
          const mensagemPersonalizada = `Olá ${cliente.nome_completo}!\n\n${mensagemBase}${cliente.poltrona ? `\n🪑 Sua poltrona: #${cliente.poltrona}` : ''}`;
          const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagemPersonalizada)}`;
          window.open(url, '_blank');
          enviados++;
        }, enviados * 800);
      }
    });

    setTimeout(() => {
      setSelectedClientes([]);
      setMensagemGrupo("");
      alert(`✅ ${enviados} mensagens enviadas com sucesso!`);
    }, enviados * 800 + 500);
  };

  const abrirWhatsAppWeb = () => {
    window.open('https://web.whatsapp.com', '_blank', 'width=1200,height=800');
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            WhatsApp Integrado
          </h1>
          <p className="text-gray-500 mt-1">Envie mensagens diretamente para seus clientes</p>
        </div>
        <Button
          onClick={abrirWhatsAppWeb}
          className="bg-green-500 hover:bg-green-600 text-white"
          size="lg"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          Abrir WhatsApp Web
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{clientesFiltrados.length}</p>
                <p className="text-sm text-gray-600">Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{selectedClientes.length}</p>
                <p className="text-sm text-gray-600">Selecionados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {clientesFiltrados.filter(c => c.telefone).length}
                </p>
                <p className="text-sm text-gray-600">Com Telefone</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-none">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Envio de Mensagens</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Viagem (Opcional)
                </label>
                <Select value={selectedViagem} onValueChange={setSelectedViagem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as viagens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Todas as viagens</SelectItem>
                    {viagens.map(v => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.nome} - {v.destino}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Cliente
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Nome, CPF ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                Mensagem Personalizada para Grupo
              </h3>
              <textarea
                value={mensagemGrupo}
                onChange={(e) => setMensagemGrupo(e.target.value)}
                placeholder="Digite uma mensagem personalizada para enviar aos clientes selecionados... (Opcional - deixe vazio para usar mensagem padrão)"
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3">
                  <Button
                    onClick={selecionarTodos}
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    {selectedClientes.length === clientesFiltrados.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                  </Button>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {selectedClientes.length} selecionado(s)
                  </Badge>
                </div>
                <Button
                  onClick={enviarWhatsAppGrupo}
                  disabled={selectedClientes.length === 0}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar para {selectedClientes.length} Cliente(s)
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">
                Lista de Clientes ({clientesFiltrados.length})
              </h3>
              
              {clientesFiltrados.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum cliente encontrado</p>
                </div>
              ) : (
                <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2">
                  {clientesFiltrados.map(cliente => (
                    <div
                      key={cliente.id}
                      className={`bg-white rounded-xl border-2 p-4 transition-all hover:shadow-md ${
                        selectedClientes.includes(cliente.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedClientes.includes(cliente.id)}
                            onChange={() => toggleClienteSelection(cliente.id)}
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{cliente.nome_completo}</h4>
                              {cliente.poltrona && (
                                <Badge variant="outline" className="text-xs">
                                  <Armchair className="w-3 h-3 mr-1" />
                                  #{cliente.poltrona}
                                </Badge>
                              )}
                              {!cliente.telefone && (
                                <Badge variant="destructive" className="text-xs">
                                  Sem telefone
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <span>📱 {cliente.telefone || 'Sem telefone'}</span>
                              <span>CPF: {cliente.cpf}</span>
                              {cliente.local_embarque && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {cliente.local_embarque}
                                </span>
                              )}
                            </div>
                            {viagemSelecionada && (
                              <div className="mt-2 text-xs text-gray-500">
                                {viagemSelecionada.nome} - {format(new Date(viagemSelecionada.data_saida), "dd/MM/yyyy")}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => enviarWhatsApp(cliente)}
                          disabled={!cliente.telefone}
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Enviar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}