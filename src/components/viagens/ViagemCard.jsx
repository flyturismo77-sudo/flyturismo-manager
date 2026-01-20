
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign, Edit, Trash2, Archive, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusColors = {
  "Planejamento": "bg-gray-100 text-gray-700",
  "Aberta": "bg-green-100 text-green-700",
  "Em Andamento": "bg-blue-100 text-blue-700",
  "Finalizada": "bg-purple-100 text-purple-700",
  "Cancelada": "bg-red-100 text-red-700"
};

export default function ViagemCard({ viagem, onEdit, onDelete, onArquivar, index }) {
  if (!viagem) return null;

  const formatarData = (data) => {
    try {
      return format(new Date(data), "dd/MM/yy");
    } catch (err) {
      return "Data inválida";
    }
  };

  const vagasOcupadas = viagem.vagas_ocupadas || 0;
  const vagasTotais = viagem.vagas_totais || 46;
  const valor1 = viagem.valor_1 || 0;
  const valor2 = viagem.valor_2 || 0;
  const valor3 = viagem.valor_3 || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-none">
        <div className="relative h-48 bg-gradient-to-br from-sky-400 to-blue-600 overflow-hidden">
          {viagem.imagens_urls && Array.isArray(viagem.imagens_urls) && viagem.imagens_urls.length > 0 ? (
            <img 
              src={viagem.imagens_urls[0]} 
              alt={viagem.destino || "Destino"} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Badge className={statusColors[viagem.status] || statusColors["Planejamento"]}>
              {viagem.status || "Planejamento"}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <Link to={`${createPageUrl('DetalhesViagem')}?id=${viagem.id}`}>
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-sky-600 transition-colors cursor-pointer flex items-center gap-2">
              {viagem.nome || "Sem nome"}
              <ExternalLink className="w-4 h-4" />
            </h3>
          </Link>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{viagem.destino || "Destino não definido"}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Saída</p>
                <p className="font-medium text-gray-900">
                  {viagem.data_saida ? formatarData(viagem.data_saida) : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Retorno</p>
                <p className="font-medium text-gray-900">
                  {viagem.data_retorno ? formatarData(viagem.data_retorno) : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="p-3 bg-purple-50 rounded-lg mb-2">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">Vagas</span>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {vagasOcupadas}/{vagasTotais}
              </p>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Valores (3 Lotes)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-600">1º</p>
                  <p className="text-sm font-bold text-green-900">
                    R$ {valor1.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">2º</p>
                  <p className="text-sm font-bold text-green-900">
                    R$ {valor2.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">3º</p>
                  <p className="text-sm font-bold text-green-900">
                    R$ {valor3.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onEdit(viagem)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              onClick={() => onArquivar(viagem)}
            >
              <Archive className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(viagem)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
