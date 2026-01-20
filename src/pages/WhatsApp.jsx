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
    window.open('https://web.whatsapp.com', 'WhatsApp', 'width=1400,height=900,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">WhatsApp Integrado</h1>
              <p className="text-green-100 text-sm">Envie mensagens personalizadas para seus clientes</p>
            </div>
          </div>
          <Button
            onClick={abrirWhatsAppWeb}
            className="bg-white text-green-600 hover:bg-green-50"
            size="lg"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Abrir WhatsApp Web
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto space-y-4">



      <div className="grid grid-cols-3 gap-3">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{clientesFiltrados.length}</p>
                <p className="text-xs text-gray-600">Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{selectedClientes.length}</p>
                <p className="text-xs text-gray-600">Selecionados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Send className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {clientesFiltrados.filter(c => c.telefone).length}
                </p>
                <p className="text-xs text-gray-600">Com Tel.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-none">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="space-y-3">
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

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
              <h3 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-600" />
                Mensagem em Grupo
              </h3>
              <textarea
                value={mensagemGrupo}
                onChange={(e) => setMensagemGrupo(e.target.value)}
                placeholder="Mensagem personalizada (opcional)..."
                className="w-full border border-gray-300 rounded-lg p-2 min-h-[80px] text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex justify-between items-center mt-3 gap-2">
                <div className="flex gap-2">
                  <Button
                    onClick={selecionarTodos}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    {selectedClientes.length === clientesFiltrados.length ? 'Desmarcar' : 'Todos'}
                  </Button>
                  <Badge variant="outline" className="px-3 py-1">
                    {selectedClientes.length}
                  </Badge>
                </div>
                <Button
                  onClick={enviarWhatsAppGrupo}
                  disabled={selectedClientes.length === 0}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Send className="w-3 h-3 mr-1" />
                  Enviar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-900">
                Clientes ({clientesFiltrados.length})
              </h3>
              
              {clientesFiltrados.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Nenhum cliente encontrado</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {clientesFiltrados.map(cliente => (
                    <div
                      key={cliente.id}
                      className={`bg-white rounded-lg border p-2 transition-all hover:shadow-sm ${
                        selectedClientes.includes(cliente.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={selectedClientes.includes(cliente.id)}
                            onChange={() => toggleClienteSelection(cliente.id)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-0.5">
                              <h4 className="font-semibold text-sm text-gray-900 truncate">{cliente.nome_completo}</h4>
                              {cliente.poltrona && (
                                <Badge variant="outline" className="text-[10px] px-1 py-0">
                                  #{cliente.poltrona}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              📱 {cliente.telefone || 'Sem tel.'}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => enviarWhatsApp(cliente)}
                          disabled={!cliente.telefone}
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50 h-8 px-2"
                        >
                          <MessageCircle className="w-3 h-3" />
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
    </div>
  );
}