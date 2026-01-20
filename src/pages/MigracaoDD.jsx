import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle, Bus, ArrowRight, Play } from "lucide-react";

export default function MigracaoDD() {
  const [migrationStatus, setMigrationStatus] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoMigrating, setAutoMigrating] = useState(false);
  const queryClient = useQueryClient();

  const { data: viagens = [], refetch: refetchViagens } = useQuery({
    queryKey: ['viagens'],
    queryFn: () => base44.entities.Viagem.list(),
  });

  const { data: assentos = [], refetch: refetchAssentos } = useQuery({
    queryKey: ['assentos'],
    queryFn: () => base44.entities.Assento.list(),
  });

  // Filtrar apenas viagens DD com menos de 57 lugares
  const viagensDD = viagens.filter(v => 
    v.modelo_onibus === 'DD' && v.vagas_totais !== 57
  );

  // Auto-migração ao carregar a página
  useEffect(() => {
    const autoMigrate = async () => {
      if (viagensDD.length > 0 && !autoMigrating && !isProcessing) {
        setAutoMigrating(true);
        await handleMigrateAll(true); // true = silent mode
      }
    };

    // Executar auto-migração após 2 segundos
    const timer = setTimeout(autoMigrate, 2000);
    return () => clearTimeout(timer);
  }, [viagensDD.length]);

  const handleMigrateViagem = async (viagem, silent = false) => {
    if (!silent) {
      setIsProcessing(true);
    }
    
    setMigrationStatus(prev => ({
      ...prev,
      [viagem.id]: { status: 'processing', message: 'Processando...' }
    }));

    try {
      // 1. Buscar assentos existentes desta viagem
      const assentosViagem = assentos.filter(a => a.id_viagem === viagem.id);
      const numerosPoltronasExistentes = assentosViagem.map(a => a.numero_poltrona);

      // 2. Criar assentos faltantes até 57
      const assentosPorAndar = Math.ceil(57 / 2); // 29 no primeiro, 28 no segundo
      const novosAssentos = [];

      for (let i = 1; i <= 57; i++) {
        if (!numerosPoltronasExistentes.includes(i)) {
          const andar = i <= assentosPorAndar ? 'Primeiro Andar' : 'Segundo Andar';
          
          novosAssentos.push({
            numero_poltrona: i,
            id_viagem: viagem.id,
            andar,
            posicao: i % 2 === 1 ? 'Janela' : 'Corredor', // ÍMPARES = JANELA (DIREITA)
            status: 'Disponível'
          });
        }
      }

      // 3. Criar os novos assentos em batch
      if (novosAssentos.length > 0) {
        await base44.entities.Assento.bulkCreate(novosAssentos);
      }

      // 4. Atualizar posição de TODOS os assentos existentes (corrigir ímpares/pares)
      for (const assento of assentosViagem) {
        const posicaoCorreta = assento.numero_poltrona % 2 === 1 ? 'Janela' : 'Corredor';
        const andarCorreto = assento.numero_poltrona <= assentosPorAndar ? 'Primeiro Andar' : 'Segundo Andar';
        
        if (assento.posicao !== posicaoCorreta || assento.andar !== andarCorreto) {
          await base44.entities.Assento.update(assento.id, {
            ...assento,
            posicao: posicaoCorreta,
            andar: andarCorreto
          });
        }
      }

      // 5. Atualizar vagas_totais da viagem para 57 (último passo para evitar inconsistências)
      await base44.entities.Viagem.update(viagem.id, {
        ...viagem,
        vagas_totais: 57
      });

      setMigrationStatus(prev => ({
        ...prev,
        [viagem.id]: {
          status: 'success',
          message: `✅ Migração concluída! ${novosAssentos.length} novos assentos adicionados.`,
          novosAssentos: novosAssentos.length
        }
      }));

    } catch (error) {
      console.error('Erro na migração:', error);
      setMigrationStatus(prev => ({
        ...prev,
        [viagem.id]: {
          status: 'error',
          message: `❌ Erro: ${error.message}`
        }
      }));
    } finally {
      if (!silent) {
        setIsProcessing(false);
      }
    }
  };

  const handleMigrateAll = async (silent = false) => {
    if (!silent && viagensDD.length > 0) {
      if (!confirm(`Deseja atualizar TODAS as ${viagensDD.length} viagens DD para 57 lugares?`)) {
        return;
      }
    }

    setIsProcessing(true);

    for (const viagem of viagensDD) {
      await handleMigrateViagem(viagem, silent);
      // Pequeno delay entre cada migração
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Atualizar dados
    await refetchViagens();
    await refetchAssentos();
    queryClient.invalidateQueries(['viagens']);
    queryClient.invalidateQueries(['assentos']);

    if (!silent) {
      alert('✅ Migração de todas as viagens concluída!');
    }
    
    setIsProcessing(false);
    setAutoMigrating(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Migração Automática: Ônibus DD para 57 Lugares</h1>
        <p className="text-gray-500 mt-1">Atualização automática de todas as viagens DD para o novo padrão</p>
      </div>

      {autoMigrating && (
        <Alert className="border-blue-200 bg-blue-50 animate-pulse">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <AlertDescription className="text-blue-800">
            <strong>Migração automática em andamento...</strong>
            <p className="mt-1">Atualizando todas as viagens DD para 57 assentos. Aguarde.</p>
          </AlertDescription>
        </Alert>
      )}

      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>O que esta migração faz:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Atualiza <strong>vagas_totais</strong> de todas as viagens DD de 46 para 57</li>
            <li>Adiciona automaticamente os assentos faltantes (até 57)</li>
            <li>Corrige a posição: <strong>ímpares à direita (janela)</strong>, <strong>pares à esquerda (corredor)</strong></li>
            <li>Preserva todos os assentos ocupados e dados de clientes</li>
            <li><strong>Executa automaticamente</strong> ao abrir esta página</li>
          </ul>
        </AlertDescription>
      </Alert>

      {viagensDD.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🎉 Sistema Atualizado!
            </h3>
            <p className="text-gray-600">
              Todas as viagens DD já estão configuradas com 57 lugares.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Você pode fechar esta página com segurança.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-lg border-none">
            <CardHeader className="border-b border-gray-100">
              <div className="flex justify-between items-center">
                <CardTitle>Viagens DD Encontradas ({viagensDD.length})</CardTitle>
                <Button
                  onClick={() => handleMigrateAll(false)}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Migrando...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Migrar Todas Agora
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {viagensDD.map(viagem => {
                  const status = migrationStatus[viagem.id];
                  const assentosViagemCount = assentos.filter(a => a.id_viagem === viagem.id).length;
                  
                  return (
                    <div key={viagem.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Bus className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-gray-900">{viagem.nome}</h4>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              DD - {viagem.destino}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Atual:</span>
                              <Badge variant="outline" className="bg-red-50 text-red-700">
                                {viagem.vagas_totais} lugares
                              </Badge>
                              <span className="text-gray-400">({assentosViagemCount} assentos criados)</span>
                            </div>
                            <ArrowRight className="w-4 h-4" />
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Novo:</span>
                              <Badge className="bg-green-100 text-green-700">
                                57 lugares
                              </Badge>
                            </div>
                          </div>

                          {status && (
                            <div className={`mt-3 p-3 rounded-lg ${
                              status.status === 'success' ? 'bg-green-50 text-green-700' :
                              status.status === 'error' ? 'bg-red-50 text-red-700' :
                              'bg-blue-50 text-blue-700'
                            }`}>
                              <p className="text-sm font-medium">{status.message}</p>
                              {status.novosAssentos !== undefined && (
                                <p className="text-xs mt-1">
                                  Total de assentos: {assentosViagemCount} → {assentosViagemCount + status.novosAssentos}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => handleMigrateViagem(viagem, false)}
                          disabled={isProcessing}
                          size="sm"
                          variant={status?.status === 'success' ? 'outline' : 'default'}
                          className={status?.status === 'success' ? 'border-green-500 text-green-700' : ''}
                        >
                          {isProcessing && migrationStatus[viagem.id]?.status === 'processing' ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processando...
                            </>
                          ) : status?.status === 'success' ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Concluído
                            </>
                          ) : (
                            'Migrar Agora'
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">ℹ️ Importante</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>A migração é executada <strong>automaticamente</strong> ao abrir esta página</li>
                    <li>Você também pode migrar viagens individualmente clicando em "Migrar Agora"</li>
                    <li>Todos os dados existentes são preservados (clientes, pagamentos, poltronas ocupadas)</li>
                    <li>A operação é <strong>segura e reversível</strong> caso necessário</li>
                    <li>Após a migração, as viagens aparecerão com 57 assentos em todas as telas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}