import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Search,
  Download,
  Trash2,
  Calendar,
  User,
  FileText,
  AlertCircle,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const actionColors = {
  CREATE: "bg-green-100 text-green-700 border-green-300",
  UPDATE: "bg-blue-100 text-blue-700 border-blue-300",
  DELETE: "bg-red-100 text-red-700 border-red-300",
  EXPORT: "bg-purple-100 text-purple-700 border-purple-300",
  ARCHIVE: "bg-orange-100 text-orange-700 border-orange-300",
  RESTORE: "bg-teal-100 text-teal-700 border-teal-300",
  LOGIN: "bg-sky-100 text-sky-700 border-sky-300",
  LOGOUT: "bg-gray-100 text-gray-700 border-gray-300",
};

const actionIcons = {
  CREATE: "➕",
  UPDATE: "✏️",
  DELETE: "🗑️",
  EXPORT: "📥",
  ARCHIVE: "📦",
  RESTORE: "♻️",
  LOGIN: "🔓",
  LOGOUT: "🔒",
};

const actionLabels = {
  CREATE: "Criação",
  UPDATE: "Atualização",
  DELETE: "Exclusão",
  EXPORT: "Exportação",
  ARCHIVE: "Arquivamento",
  RESTORE: "Restauração",
  LOGIN: "Login",
  LOGOUT: "Logout",
};

export default function LogsAuditoria() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEntity, setFilterEntity] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Obter logs do localStorage diretamente (sem usar hook que pode não existir)
  const getLogs = () => {
    try {
      const logs = JSON.parse(localStorage.getItem('fly_turismo_audit_logs') || '[]');
      return logs;
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      return [];
    }
  };

  const clearOldLogs = (daysToKeep = 90) => {
    try {
      const logs = getLogs();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const recentLogs = logs.filter(log => new Date(log.timestamp) >= cutoffDate);
      localStorage.setItem('fly_turismo_audit_logs', JSON.stringify(recentLogs));

      return recentLogs.length;
    } catch (error) {
      console.error('Erro ao limpar logs antigos:', error);
      return 0;
    }
  };

  const logs = getLogs();

  const filteredLogs = useMemo(() => {
    if (!Array.isArray(logs)) return [];
    
    return logs.filter(log => {
      const matchesSearch = 
        log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity_id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = filterAction === "all" || log.action === filterAction;
      const matchesEntity = filterEntity === "all" || log.entity_type === filterEntity;

      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [logs, searchTerm, filterAction, filterEntity]);

  const entityTypes = useMemo(() => {
    if (!Array.isArray(logs)) return [];
    return [...new Set(logs.map(log => log.entity_type))].filter(Boolean);
  }, [logs]);

  const handleExportLogs = () => {
    const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: ptBR });
    const nomeArquivo = `Logs_Auditoria_FlyTurismo_${timestamp}.json`;

    const exportData = {
      exported_at: new Date().toISOString(),
      total_logs: filteredLogs.length,
      logs: filteredLogs,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearOldLogs = () => {
    if (confirm("Deseja remover logs com mais de 90 dias? Esta ação não pode ser desfeita.")) {
      const remaining = clearOldLogs(90);
      alert(`Logs antigos removidos. ${remaining} registros mantidos.`);
      window.location.reload();
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetailsDialog(true);
  };

  const stats = useMemo(() => {
    if (!Array.isArray(logs)) return { total: 0, today: 0, thisWeek: 0, byAction: {} };
    
    return {
      total: logs.length,
      today: logs.filter(log => {
        try {
          const logDate = new Date(log.timestamp);
          const today = new Date();
          return logDate.toDateString() === today.toDateString();
        } catch {
          return false;
        }
      }).length,
      thisWeek: logs.filter(log => {
        try {
          const logDate = new Date(log.timestamp);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return logDate >= weekAgo;
        } catch {
          return false;
        }
      }).length,
      byAction: logs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {}),
    };
  }, [logs]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Logs de Auditoria</h1>
        <p className="text-gray-500 mt-1">Rastreamento completo de todas as ações no sistema</p>
      </div>

      {/* Estatísticas */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-none bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">Total de Logs</p>
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700 font-medium">Hoje</p>
            </div>
            <p className="text-3xl font-bold text-green-900">{stats.today}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-purple-700 font-medium">Últimos 7 Dias</p>
            </div>
            <p className="text-3xl font-bold text-purple-900">{stats.thisWeek}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-700 font-medium">Usuários Ativos</p>
            </div>
            <p className="text-3xl font-bold text-amber-900">
              {logs.length > 0 ? [...new Set(logs.map(log => log.user_email))].length : 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card className="shadow-lg border-none">
        <CardHeader className="border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl">Histórico de Atividades</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleExportLogs}
                variant="outline"
                className="border-blue-500 text-blue-700 hover:bg-blue-50"
                disabled={filteredLogs.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button
                onClick={handleClearOldLogs}
                variant="outline"
                className="border-red-500 text-red-700 hover:bg-red-50"
                disabled={logs.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Antigos
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por usuário, entidade ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Ações</SelectItem>
                <SelectItem value="CREATE">Criação</SelectItem>
                <SelectItem value="UPDATE">Atualização</SelectItem>
                <SelectItem value="DELETE">Exclusão</SelectItem>
                <SelectItem value="EXPORT">Exportação</SelectItem>
                <SelectItem value="ARCHIVE">Arquivamento</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEntity} onValueChange={setFilterEntity}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por entidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Entidades</SelectItem>
                {entityTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Activity className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma ação registrada ainda</h3>
              <p className="text-sm text-gray-500">
                Os logs de auditoria aparecerão aqui automaticamente quando ações forem realizadas no sistema.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="text-sm">
                        {log.timestamp ? format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR }) : '-'}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{log.user_name || '-'}</p>
                          <p className="text-xs text-gray-500">{log.user_email || '-'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`border ${actionColors[log.action] || 'bg-gray-100 text-gray-700'}`}>
                          {actionIcons[log.action] || '•'} {actionLabels[log.action] || log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {log.entity_type || '-'}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-600">
                        {log.entity_id ? `${log.entity_id.substring(0, 8)}...` : '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(log)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredLogs.length === 0 && logs.length > 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum log encontrado com os filtros aplicados</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Log</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Data/Hora</p>
                  <p className="font-medium">
                    {selectedLog.timestamp ? format(new Date(selectedLog.timestamp), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR }) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ação</p>
                  <Badge className={`border ${actionColors[selectedLog.action] || 'bg-gray-100'}`}>
                    {actionIcons[selectedLog.action] || '•'} {actionLabels[selectedLog.action] || selectedLog.action}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Usuário</p>
                  <p className="font-medium">{selectedLog.user_name || '-'}</p>
                  <p className="text-xs text-gray-500">{selectedLog.user_email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Entidade</p>
                  <p className="font-medium">{selectedLog.entity_type || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">ID da Entidade</p>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                    {selectedLog.entity_id || '-'}
                  </p>
                </div>
              </div>

              {selectedLog.details && selectedLog.details !== '{}' && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Detalhes Adicionais</p>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64">
                    {typeof selectedLog.details === 'string' 
                      ? JSON.stringify(JSON.parse(selectedLog.details), null, 2)
                      : JSON.stringify(selectedLog.details, null, 2)
                    }
                  </pre>
                </div>
              )}

              {selectedLog.user_agent && (
                <div>
                  <p className="text-sm text-gray-500">User Agent</p>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    {selectedLog.user_agent}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Informações */}
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">ℹ️ Sobre os Logs de Auditoria</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Todos os logs são armazenados localmente para consulta rápida</li>
                <li>Os últimos 500 registros ficam disponíveis automaticamente</li>
                <li>Logs com mais de 90 dias podem ser removidos para otimização</li>
                <li>Sempre exporte os logs importantes antes de limpar</li>
                <li>Use os filtros para encontrar ações específicas rapidamente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}