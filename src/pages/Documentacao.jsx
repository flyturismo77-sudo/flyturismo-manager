import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen, Loader2 } from "lucide-react";

export default function Documentacao() {
  const [gerando, setGerando] = useState(false);

  const gerarDocumentacaoCompleta = () => {
    setGerando(true);

    const documentacao = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documentação Completa - Sistema Fly Turismo</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #0EA5E9;
      border-bottom: 3px solid #0EA5E9;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    h2 {
      color: #0369a1;
      margin-top: 40px;
      border-left: 4px solid #0EA5E9;
      padding-left: 15px;
    }
    h3 {
      color: #075985;
      margin-top: 25px;
    }
    .feature-box {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 6px;
      padding: 15px;
      margin: 15px 0;
    }
    .action-item {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 10px;
      margin: 10px 0;
    }
    .warning {
      background: #fee2e2;
      border-left: 4px solid #ef4444;
      padding: 10px;
      margin: 10px 0;
    }
    .success {
      background: #d1fae5;
      border-left: 4px solid #10b981;
      padding: 10px;
      margin: 10px 0;
    }
    .step {
      background: #e0e7ff;
      padding: 10px;
      margin: 8px 0;
      border-radius: 4px;
      border-left: 3px solid #6366f1;
    }
    ul, ol {
      margin: 10px 0;
      padding-left: 25px;
    }
    li {
      margin: 8px 0;
    }
    .table-container {
      overflow-x: auto;
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th {
      background: #0EA5E9;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 10px;
      border: 1px solid #ddd;
    }
    tr:nth-child(even) {
      background: #f9fafb;
    }
    code {
      background: #1e293b;
      color: #10b981;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    .toc {
      background: #f8fafc;
      border: 2px solid #cbd5e1;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .toc h2 {
      margin-top: 0;
    }
    .toc ul {
      list-style-type: none;
    }
    .toc a {
      color: #0EA5E9;
      text-decoration: none;
    }
    .toc a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📖 Documentação Completa - Sistema Fly Turismo</h1>
    <p><strong>Versão:</strong> 1.0 | <strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')} | <strong>Tipo:</strong> Sistema de Gestão de Viagens</p>

    <div class="toc">
      <h2>📑 Índice</h2>
      <ul>
        <li><a href="#visao-geral">1. Visão Geral do Sistema</a></li>
        <li><a href="#dashboard">2. Dashboard (Painel Principal)</a></li>
        <li><a href="#viagens">3. Gestão de Viagens</a></li>
        <li><a href="#clientes">4. Gestão de Clientes</a></li>
        <li><a href="#assentos">5. Mapa de Assentos</a></li>
        <li><a href="#quartos">6. Mapa de Quartos</a></li>
        <li><a href="#financeiro">7. Financeiro</a></li>
        <li><a href="#whatsapp">8. WhatsApp Integrado</a></li>
        <li><a href="#pagamentos-empresa">9. Pagamentos da Empresa</a></li>
        <li><a href="#fornecedores">10. Fornecedores</a></li>
        <li><a href="#equipe">11. Equipe</a></li>
        <li><a href="#relatorios">12. Relatórios</a></li>
        <li><a href="#formularios">13. Formulários Recebidos</a></li>
        <li><a href="#mensagens">14. Mensagens</a></li>
        <li><a href="#usuarios">15. Usuários</a></li>
        <li><a href="#backup">16. Backup e Arquivos</a></li>
        <li><a href="#logs">17. Logs de Auditoria</a></li>
        <li><a href="#migracao">18. Migração DD</a></li>
        <li><a href="#exportacao">19. Exportação de Dados</a></li>
        <li><a href="#configuracoes">20. Configurações</a></li>
        <li><a href="#site-publico">21. Site Público</a></li>
      </ul>
    </div>

    <div id="visao-geral">
      <h2>1. 🎯 Visão Geral do Sistema</h2>
      
      <div class="feature-box">
        <h3>O que é o Sistema Fly Turismo?</h3>
        <p>Um sistema completo de gestão de agência de turismo que gerencia:</p>
        <ul>
          <li><strong>Viagens:</strong> Criação e controle de pacotes turísticos</li>
          <li><strong>Clientes:</strong> Cadastro completo de passageiros</li>
          <li><strong>Assentos e Quartos:</strong> Gestão visual de ocupação</li>
          <li><strong>Financeiro:</strong> Controle de pagamentos, parcelas e despesas</li>
          <li><strong>Comunicação:</strong> Integração com WhatsApp</li>
          <li><strong>Relatórios:</strong> Análises e exportações</li>
        </ul>
      </div>

      <h3>🔐 Tipos de Usuário</h3>
      <div class="table-container">
        <table>
          <tr>
            <th>Tipo</th>
            <th>Identificação</th>
            <th>Permissões</th>
          </tr>
          <tr>
            <td><strong>Administrador</strong></td>
            <td>Email contém "flyturadm" OU role="admin"</td>
            <td>Acesso total ao sistema</td>
          </tr>
          <tr>
            <td><strong>Funcionário</strong></td>
            <td>Demais usuários</td>
            <td>Acesso limitado (sem Viagens, Financeiro, Despesas, etc.)</td>
          </tr>
        </table>
      </div>
    </div>

    <div id="dashboard">
      <h2>2. 📊 Dashboard (Painel Principal)</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Dashboard (primeiro item)</p>
      </div>

      <h3>📌 O que aparece na tela:</h3>
      
      <div class="step">
        <strong>1. Cards de Estatísticas (4 cards no topo):</strong>
        <ul>
          <li>💰 <strong>Receita Total:</strong> Soma de todos os pagamentos recebidos</li>
          <li>✈️ <strong>Viagens Ativas:</strong> Quantidade de viagens não arquivadas</li>
          <li>👥 <strong>Clientes Totais:</strong> Total de clientes cadastrados</li>
          <li>📅 <strong>Próximas Viagens:</strong> Viagens com data próxima</li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Gráficos:</strong>
        <ul>
          <li><strong>Gráfico de Receita Mensal:</strong> Visualização das receitas por mês</li>
          <li><strong>Status de Pagamentos:</strong> Pizza mostrando Pago/Pendente/Parcial</li>
        </ul>
      </div>

      <div class="step">
        <strong>3. Atividades Recentes:</strong>
        <ul>
          <li>Lista das últimas ações no sistema (novos clientes, pagamentos, etc.)</li>
        </ul>
      </div>

      <div class="action-item">
        <strong>✅ Ações disponíveis:</strong>
        <ul>
          <li>Visualizar informações em tempo real</li>
          <li>Clicar nos cards para navegar para seções específicas</li>
        </ul>
      </div>
    </div>

    <div id="viagens">
      <h2>3. ✈️ Gestão de Viagens</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Viagens (2º item)</p>
        <p><strong>Permissão:</strong> ⚠️ Apenas Administradores</p>
      </div>

      <h3>📌 O que aparece na tela:</h3>
      
      <div class="step">
        <strong>1. Barra Superior:</strong>
        <ul>
          <li><strong>Botão "Nova Viagem":</strong> Abre formulário de criação (azul, lado direito)</li>
          <li><strong>Campo de Busca:</strong> Pesquisa viagens por nome ou destino</li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Abas:</strong>
        <ul>
          <li><strong>Viagens Ativas:</strong> Lista viagens não arquivadas</li>
          <li><strong>Arquivadas:</strong> Lista viagens arquivadas</li>
        </ul>
      </div>

      <div class="step">
        <strong>3. Cards de Viagens (cada card mostra):</strong>
        <ul>
          <li><strong>Imagem:</strong> Foto do destino</li>
          <li><strong>Nome e Destino:</strong> Ex: "Praia do Forte - Bahia"</li>
          <li><strong>Datas:</strong> Data de saída e retorno</li>
          <li><strong>Status:</strong> Badge colorido (Planejamento/Aberta/Em Andamento/Finalizada)</li>
          <li><strong>Ocupação:</strong> Barra de progresso (ex: 25/46 vagas)</li>
          <li><strong>Valores:</strong> 3 valores de lote (R$ 1.200, R$ 1.400, R$ 1.600)</li>
          <li><strong>Ações:</strong> Botões Ver Detalhes, Editar, Arquivar/Desarquivar, Deletar</li>
        </ul>
      </div>

      <h3>🎯 Como Criar uma Nova Viagem:</h3>
      
      <div class="step">
        <strong>Passo 1:</strong> Clique no botão <code>Nova Viagem</code> (canto superior direito)
      </div>

      <div class="step">
        <strong>Passo 2:</strong> Preencha o formulário:
        <ul>
          <li><strong>Nome da Viagem:</strong> Ex: "Viagem Litoral Norte"</li>
          <li><strong>Destino:</strong> Ex: "Praia do Forte - Bahia"</li>
          <li><strong>Data de Saída:</strong> Selecione no calendário</li>
          <li><strong>Data de Retorno:</strong> Selecione no calendário</li>
          <li><strong>Modelo de Ônibus:</strong>
            <ul>
              <li>LD (Leito) - 46 lugares</li>
              <li>DD (Double Decker) - 57 lugares (2 andares)</li>
              <li>VAN - 20 lugares</li>
            </ul>
          </li>
          <li><strong>Valores:</strong>
            <ul>
              <li>Valor 1 (1º lote): Ex: R$ 1.200,00</li>
              <li>Valor 2 (2º lote): Ex: R$ 1.400,00</li>
              <li>Valor 3 (3º lote): Ex: R$ 1.600,00</li>
            </ul>
          </li>
          <li><strong>Modo Pirapark:</strong> ☑️ Ativar se usar preços por faixa etária automática</li>
          <li><strong>Imagens:</strong> Upload de fotos do destino (múltiplas imagens)</li>
        </ul>
      </div>

      <div class="step">
        <strong>Passo 3:</strong> Clique em <code>Salvar Viagem</code>
      </div>

      <div class="success">
        <strong>✅ O que acontece automaticamente:</strong>
        <ul>
          <li>Sistema cria todos os assentos do ônibus (46, 57 ou 20 dependendo do modelo)</li>
          <li>Cria estrutura de quartos (se aplicável)</li>
          <li>Viagem fica disponível para vincular clientes</li>
        </ul>
      </div>

      <h3>✏️ Como Editar uma Viagem:</h3>
      <ol>
        <li>Localize o card da viagem</li>
        <li>Clique no botão <code>Editar</code> (ícone de lápis)</li>
        <li>Modifique os campos necessários</li>
        <li>Clique em <code>Salvar Alterações</code></li>
      </ol>

      <h3>👁️ Detalhes da Viagem:</h3>
      <div class="action-item">
        Ao clicar em <code>Ver Detalhes</code>, você acessa:
        <ul>
          <li><strong>Aba Passageiros:</strong> Lista completa de clientes da viagem com opções de adicionar/editar</li>
          <li><strong>Aba Documentos:</strong> Documentos salvos (listas de passageiros, assentos, etc.)</li>
          <li><strong>Estatísticas:</strong> Total de passageiros, ocupação, status de pagamentos</li>
          <li><strong>Geração de Listas:</strong> Botões para gerar e imprimir lista de passageiros</li>
        </ul>
      </div>
    </div>

    <div id="clientes">
      <h2>4. 👥 Gestão de Clientes</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Clientes (3º item)</p>
        <p><strong>Permissão:</strong> ✅ Todos os usuários</p>
      </div>

      <h3>📌 O que aparece na tela:</h3>
      
      <div class="step">
        <strong>1. Barra Superior:</strong>
        <ul>
          <li><strong>Botão "Novo Cliente":</strong> Abre formulário completo</li>
          <li><strong>Campo de Busca:</strong> Pesquisa por nome, CPF ou telefone</li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Filtros:</strong>
        <ul>
          <li><strong>Filtrar por Viagem:</strong> Dropdown com todas as viagens</li>
          <li><strong>Filtrar por Status de Pagamento:</strong> Todos/Pago/Pendente/Parcial</li>
        </ul>
      </div>

      <div class="step">
        <strong>3. Tabela de Clientes com colunas:</strong>
        <ul>
          <li><strong>Nome:</strong> Nome completo + badge de grupo (se tiver)</li>
          <li><strong>CPF:</strong> Documento</li>
          <li><strong>Telefone:</strong> Com botão de WhatsApp direto</li>
          <li><strong>Viagem:</strong> Nome da viagem vinculada</li>
          <li><strong>Poltrona:</strong> Número do assento (ou "Não definido")</li>
          <li><strong>Status Pgto:</strong> Badge colorido (Verde=Pago, Amarelo=Pendente, Azul=Parcial)</li>
          <li><strong>Valor:</strong> Valor do pacote</li>
          <li><strong>Ações:</strong> Botões Editar e Excluir</li>
        </ul>
      </div>

      <h3>🎯 Como Cadastrar um Novo Cliente:</h3>
      
      <div class="step">
        <strong>Passo 1:</strong> Clique em <code>Novo Cliente</code>
      </div>

      <div class="step">
        <strong>Passo 2:</strong> Preencha as informações pessoais:
        <ul>
          <li><strong>Nome Completo:</strong> Ex: "João Silva Santos"</li>
          <li><strong>CPF:</strong> Ex: "123.456.789-00"</li>
          <li><strong>RG:</strong> Ex: "12.345.678-9"</li>
          <li><strong>Sexo:</strong> Masculino/Feminino/Outro</li>
          <li><strong>Data de Nascimento:</strong> Selecione no calendário</li>
          <li><strong>Telefone:</strong> Ex: "(38) 99999-9999"</li>
          <li><strong>Email:</strong> Ex: "joao@email.com"</li>
        </ul>
      </div>

      <div class="step">
        <strong>Passo 3:</strong> Endereço:
        <ul>
          <li>Rua, Número, Bairro, Cidade, Estado, CEP</li>
          <li><strong>Local de Embarque:</strong> Ex: "Marcely - Lontra/MG"</li>
        </ul>
      </div>

      <div class="step">
        <strong>Passo 4:</strong> Informações da Viagem:
        <ul>
          <li><strong>Viagem:</strong> Selecione do dropdown</li>
          <li><strong>Valor Selecionado:</strong> Escolha Valor 1, 2, 3 ou Personalizado</li>
          <li><strong>Forma de Pagamento:</strong> À Vista/Parcelado/Boleto</li>
          <li><strong>Número de Parcelas:</strong> Se parcelado (1 a 12x)</li>
        </ul>
      </div>

      <div class="step">
        <strong>Passo 5:</strong> Assento e Quarto (opcional):
        <ul>
          <li><strong>Poltrona:</strong> Número do assento (se já definido)</li>
          <li><strong>Quarto:</strong> Selecione do dropdown</li>
        </ul>
      </div>

      <div class="step">
        <strong>Passo 6:</strong> Criança de Colo (se houver):
        <ul>
          <li>☑️ Marque "Cliente é criança de colo" se for o caso</li>
          <li>☑️ Marque "Possui criança de colo" se viaja com bebê</li>
          <li>Preencha nome e idade da criança</li>
        </ul>
      </div>

      <div class="step">
        <strong>Passo 7:</strong> Grupo Familiar (opcional):
        <ul>
          <li><strong>Cor do Grupo:</strong> Escolha uma cor para identificar família</li>
          <li><strong>Número do Grupo:</strong> Ex: "Grupo 1" da cor azul</li>
        </ul>
      </div>

      <div class="step">
        <strong>Passo 8:</strong> Clique em <code>Salvar Cliente</code>
      </div>

      <div class="success">
        <strong>✅ O que acontece automaticamente:</strong>
        <ul>
          <li>Cliente vinculado à viagem</li>
          <li>Vagas ocupadas da viagem aumentam</li>
          <li>Se valor foi definido, valor total e valor pago são registrados</li>
          <li>Se parcelado, parcelas são criadas automaticamente</li>
          <li>Cliente aparece na lista de passageiros</li>
        </ul>
      </div>

      <h3>📝 Campos Importantes:</h3>
      <div class="warning">
        <strong>⚠️ Modo Pirapark:</strong>
        <p>Se a viagem estiver com "Modo Pirapark" ativado, o valor é calculado automaticamente pela idade:</p>
        <ul>
          <li>0-5 anos: R$ 150,00</li>
          <li>6-11 anos: R$ 300,00</li>
          <li>12+ anos: Valor do lote selecionado</li>
        </ul>
      </div>
    </div>

    <div id="assentos">
      <h2>5. 🪑 Mapa de Assentos</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Assentos (4º item)</p>
        <p><strong>Permissão:</strong> ✅ Todos os usuários</p>
      </div>

      <h3>📌 O que aparece na tela:</h3>
      
      <div class="step">
        <strong>1. Seletor de Viagem:</strong>
        <ul>
          <li>Dropdown para escolher qual viagem visualizar</li>
          <li>Mostra nome, destino e data de cada viagem</li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Barra de Ações:</strong>
        <ul>
          <li><strong>Campo de Busca:</strong> Pesquisar passageiro por nome</li>
          <li><strong>Botão "Gerar Lista":</strong> Cria lista de passageiros para impressão</li>
          <li><strong>Botão "Enviar WhatsApp":</strong> Opção de enviar mensagem em grupo</li>
          <li><strong>Botão "Abrir WhatsApp Web":</strong> Abre WhatsApp em nova janela</li>
        </ul>
      </div>

      <div class="step">
        <strong>3. Mapa Visual do Ônibus:</strong>
        <ul>
          <li><strong>Assentos Disponíveis:</strong> Cor cinza clara</li>
          <li><strong>Assentos Ocupados:</strong> Cor azul com nome do passageiro</li>
          <li><strong>Assentos Destacados:</strong> Amarelo quando passageiro é buscado</li>
          <li><strong>Layout LD:</strong> 46 poltronas em layout tradicional</li>
          <li><strong>Layout DD:</strong> 57 poltronas em 2 andares (1º andar: 48 lugares, 2º andar: 9 lugares)</li>
        </ul>
      </div>

      <h3>🎯 Como Alocar um Passageiro no Assento:</h3>
      
      <div class="step">
        <strong>Passo 1:</strong> Selecione a viagem no dropdown
      </div>

      <div class="step">
        <strong>Passo 2:</strong> Clique em um assento DISPONÍVEL (cinza)
      </div>

      <div class="step">
        <strong>Passo 3:</strong> Na modal que abre:
        <ul>
          <li>Selecione o cliente do dropdown (lista de passageiros sem assento)</li>
          <li>Clique em <code>Confirmar Alocação</code></li>
        </ul>
      </div>

      <div class="success">
        <strong>✅ O assento ficará azul com o nome do passageiro</strong>
      </div>

      <h3>🔄 Como Remover um Passageiro do Assento:</h3>
      <ol>
        <li>Clique no assento OCUPADO (azul)</li>
        <li>Na modal, clique em <code>Remover Passageiro</code></li>
        <li>Assento volta a ficar disponível (cinza)</li>
      </ol>

      <h3>📱 Enviar WhatsApp:</h3>
      <div class="action-item">
        <strong>WhatsApp Individual:</strong>
        <ul>
          <li>Passe o mouse sobre um assento ocupado</li>
          <li>Aparece card com informações do passageiro</li>
          <li>Clique no ícone de WhatsApp</li>
          <li>Abre conversa com mensagem personalizada automática</li>
        </ul>
      </div>

      <h3>📄 Gerar Lista de Passageiros:</h3>
      <ol>
        <li>Clique em <code>Gerar Lista de Assentos</code></li>
        <li>Sistema gera documento HTML com:
          <ul>
            <li>Nome da viagem e datas</li>
            <li>Lista de todos os passageiros ordenados por assento</li>
            <li>Local de embarque de cada um</li>
          </ul>
        </li>
        <li>Opções: <code>Imprimir</code> ou <code>Salvar como Documento</code></li>
      </ol>
    </div>

    <div id="quartos">
      <h2>6. 🏨 Mapa de Quartos</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Quartos (5º item)</p>
        <p><strong>Permissão:</strong> ✅ Todos os usuários</p>
      </div>

      <h3>📌 O que aparece na tela:</h3>
      
      <div class="step">
        <strong>1. Seletor de Viagem e Ações:</strong>
        <ul>
          <li>Dropdown para escolher viagem</li>
          <li>Botão <code>Adicionar Quarto</code></li>
          <li>Botão <code>Gerar Lista de Quartos</code></li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Grid de Quartos (cada card mostra):</strong>
        <ul>
          <li><strong>Número/Nome:</strong> Ex: "Quarto 101"</li>
          <li><strong>Capacidade:</strong> Ex: "4 pessoas"</li>
          <li><strong>Ocupação:</strong> Barra de progresso (ex: 2/4)</li>
          <li><strong>Tipo de Camas:</strong> Icons mostrando quantidade:
            <ul>
              <li>🛏️ Camas de Casal</li>
              <li>🛏️ Camas de Solteiro</li>
              <li>🪜 Beliches</li>
              <li>➕ Camas Extra</li>
            </ul>
          </li>
          <li><strong>Hóspedes:</strong> Lista de nomes dos ocupantes</li>
          <li><strong>Ações:</strong> Alocar Hóspede, Editar, Excluir</li>
        </ul>
      </div>

      <h3>🎯 Como Adicionar um Quarto:</h3>
      
      <div class="step">
        <strong>Passo 1:</strong> Clique em <code>Adicionar Quarto</code>
      </div>

      <div class="step">
        <strong>Passo 2:</strong> Preencha:
        <ul>
          <li><strong>Número/Nome do Quarto:</strong> Ex: "101", "Suite Premium"</li>
          <li><strong>Capacidade Total:</strong> Máximo 6 pessoas</li>
          <li><strong>Configuração de Camas:</strong>
            <ul>
              <li>Camas de Casal (2 pessoas cada)</li>
              <li>Camas de Solteiro (1 pessoa cada)</li>
              <li>Beliches (2 pessoas cada)</li>
              <li>Camas Extra (1 pessoa cada)</li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="warning">
        <strong>⚠️ Importante:</strong>
        <p>A soma das camas deve corresponder à capacidade total!</p>
        <p>Exemplo: Capacidade 4 = 1 casal (2) + 2 solteiro (2) = 4</p>
      </div>

      <div class="step">
        <strong>Passo 3:</strong> Clique em <code>Salvar Quarto</code>
      </div>

      <h3>🎯 Como Alocar Hóspede no Quarto:</h3>
      
      <ol>
        <li>Clique em <code>Alocar Hóspede</code> no card do quarto</li>
        <li>Selecione o cliente da lista (mostra apenas clientes sem quarto)</li>
        <li>Clique em <code>Alocar</code></li>
        <li>Cliente aparece no quarto e ocupação aumenta</li>
      </ol>

      <h3>🔄 Como Remover Hóspede do Quarto:</h3>
      <ol>
        <li>Clique no nome do hóspede dentro do card</li>
        <li>Clique em <code>Remover do Quarto</code></li>
        <li>Hóspede volta a ficar sem quarto definido</li>
      </ol>
    </div>

    <div id="financeiro">
      <h2>7. 💰 Financeiro</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Financeiro (6º item)</p>
        <p><strong>Permissão:</strong> ⚠️ Apenas Administradores</p>
      </div>

      <h3>📌 O que aparece na tela:</h3>
      
      <div class="step">
        <strong>1. Cards de Resumo (4 cards no topo):</strong>
        <ul>
          <li>💵 <strong>Total Recebido:</strong> Soma de todos os pagamentos</li>
          <li>📊 <strong>Total a Receber:</strong> Diferença entre valor total e pago</li>
          <li>🏢 <strong>Despesas da Empresa:</strong> Total de gastos operacionais</li>
          <li>📈 <strong>Lucro Líquido:</strong> Receita - Despesas</li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Abas:</strong>
        <ul>
          <li><strong>Visão Geral:</strong> Dashboard financeiro com gráficos</li>
          <li><strong>Por Viagem:</strong> Análise financeira de cada viagem</li>
          <li><strong>Histórico do Cliente:</strong> Pagamentos de cliente específico</li>
          <li><strong>Alertas:</strong> Parcelas atrasadas e vencendo</li>
        </ul>
      </div>

      <h3>🎯 Como Registrar um Pagamento:</h3>
      
      <div class="step">
        <strong>Passo 1:</strong> Clique em <code>Registrar Pagamento</code>
      </div>

      <div class="step">
        <strong>Passo 2:</strong> Preencha:
        <ul>
          <li><strong>Cliente:</strong> Selecione do dropdown</li>
          <li><strong>Valor:</strong> Ex: R$ 500,00</li>
          <li><strong>Data do Pagamento:</strong> Selecione no calendário</li>
          <li><strong>Forma de Pagamento:</strong> Dinheiro/PIX/Cartão Crédito/Débito/Transferência</li>
          <li><strong>Número da Parcela:</strong> Se for pagamento de parcela específica</li>
          <li><strong>Comprovante:</strong> Upload do arquivo (opcional)</li>
          <li><strong>Observações:</strong> Notas adicionais</li>
        </ul>
      </div>

      <div class="step">
        <strong>Passo 3:</strong> Clique em <code>Registrar</code>
      </div>

      <div class="success">
        <strong>✅ O que acontece:</strong>
        <ul>
          <li>Valor pago do cliente é atualizado</li>
          <li>Status de pagamento recalculado (Pago/Pendente/Parcial)</li>
          <li>Se parcela foi indicada, ela é marcada como paga</li>
          <li>Gráficos e estatísticas são atualizados</li>
        </ul>
      </div>

      <h3>📝 Gerar Parcelas:</h3>
      
      <div class="action-item">
        <strong>Para clientes com pagamento parcelado:</strong>
        <ol>
          <li>Clique em <code>Gerar Parcelas</code></li>
          <li>Selecione o cliente</li>
          <li>Define quantidade de parcelas (já vem do cadastro)</li>
          <li>Define data de vencimento da 1ª parcela</li>
          <li>Sistema cria automaticamente todas as parcelas mensais</li>
        </ol>
      </div>

      <h3>⚠️ Alertas de Parcelas:</h3>
      <div class="warning">
        <strong>Na aba "Alertas" você vê:</strong>
        <ul>
          <li><strong>Atrasadas:</strong> Parcelas com vencimento passado não pagas</li>
          <li><strong>Vencendo em 5 dias:</strong> Parcelas próximas do vencimento</li>
          <li>Cada parcela tem botão para <code>Marcar como Paga</code></li>
        </ul>
      </div>

      <h3>📊 Análise por Viagem:</h3>
      <div class="feature-box">
        <p>Na aba "Por Viagem":</p>
        <ul>
          <li>Selecione uma viagem</li>
          <li>Veja: Total esperado, Total recebido, A receber, Clientes pagos/pendentes</li>
          <li>Lista de todos os clientes com valor individual e status</li>
        </ul>
      </div>
    </div>

    <div id="whatsapp">
      <h2>8. 💬 WhatsApp Integrado</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> WhatsApp (após Quartos)</p>
        <p><strong>Permissão:</strong> ✅ Todos os usuários</p>
      </div>

      <h3>📌 O que aparece na tela:</h3>
      
      <div class="step">
        <strong>1. Banner Superior:</strong>
        <ul>
          <li>Botão grande <code>Abrir WhatsApp Web</code> (abre em nova janela)</li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Painel de Envio Rápido:</strong>
        <ul>
          <li><strong>Cards de Estatísticas:</strong>
            <ul>
              <li>Total de Clientes</li>
              <li>Selecionados</li>
              <li>Clientes com Telefone</li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="step">
        <strong>3. Filtros:</strong>
        <ul>
          <li><strong>Filtrar por Viagem:</strong> Mostra apenas clientes de uma viagem</li>
          <li><strong>Buscar Cliente:</strong> Por nome, CPF ou telefone</li>
        </ul>
      </div>

      <div class="step">
        <strong>4. Área de Mensagem em Grupo:</strong>
        <ul>
          <li>Campo de texto para mensagem personalizada</li>
          <li>Botão <code>Todos/Desmarcar</code> para selecionar todos</li>
          <li>Contador de selecionados</li>
          <li>Botão <code>Enviar</code></li>
        </ul>
      </div>

      <div class="step">
        <strong>5. Lista de Clientes:</strong>
        <ul>
          <li>Checkbox para seleção</li>
          <li>Nome + Badge com número da poltrona</li>
          <li>Telefone</li>
          <li>Botão de WhatsApp individual (ícone verde)</li>
        </ul>
      </div>

      <h3>🎯 Como Enviar WhatsApp Individual:</h3>
      
      <ol>
        <li>Localize o cliente na lista</li>
        <li>Clique no ícone verde de WhatsApp ao lado do nome</li>
        <li>Abre WhatsApp Web com mensagem personalizada automática contendo:
          <ul>
            <li>Nome do cliente</li>
            <li>Informações da viagem (se filtrada)</li>
            <li>Número da poltrona</li>
            <li>Local de embarque</li>
          </ul>
        </li>
      </ol>

      <h3>📢 Como Enviar WhatsApp em Grupo:</h3>
      
      <div class="step">
        <strong>Passo 1:</strong> Filtre por viagem (opcional)
      </div>

      <div class="step">
        <strong>Passo 2:</strong> Selecione os clientes:
        <ul>
          <li>Marque checkbox individualmente OU</li>
          <li>Clique em <code>Todos</code> para selecionar todos da lista</li>
        </ul>
      </div>

      <div class="step">
        <strong>Passo 3:</strong> Digite mensagem personalizada (opcional)
        <p>Se não digitar, usa mensagem padrão com informações da viagem</p>
      </div>

      <div class="step">
        <strong>Passo 4:</strong> Clique em <code>Enviar</code>
      </div>

      <div class="success">
        <strong>✅ O que acontece:</strong>
        <ul>
          <li>Sistema abre uma aba do WhatsApp Web para cada cliente selecionado</li>
          <li>Mensagem personalizada com nome de cada cliente</li>
          <li>Intervalo de 800ms entre cada abertura para não sobrecarregar</li>
          <li>Ao final, mostra alerta com quantidade enviada</li>
        </ul>
      </div>
    </div>

    <div id="pagamentos-empresa">
      <h2>9. 💳 Pagamentos da Empresa</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Despesas</p>
        <p><strong>Permissão:</strong> ⚠️ Apenas Administradores</p>
      </div>

      <h3>📌 O que aparece na tela:</h3>
      
      <div class="step">
        <strong>1. Card de Resumo:</strong>
        <ul>
          <li>💰 Total de Despesas (soma de todos os pagamentos)</li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Filtros:</strong>
        <ul>
          <li><strong>Filtrar por Viagem:</strong> Ver despesas de viagem específica</li>
          <li><strong>Filtrar por Tipo:</strong> Hotel/Ônibus/Alimentação/Combustível/Pedágios/Guia/Outros</li>
        </ul>
      </div>

      <div class="step">
        <strong>3. Botão:</strong>
        <ul>
          <li><code>Registrar Despesa</code> (canto superior direito)</li>
        </ul>
      </div>

      <div class="step">
        <strong>4. Tabela de Despesas:</strong>
        <ul>
          <li><strong>Tipo:</strong> Categoria da despesa</li>
          <li><strong>Fornecedor:</strong> Nome do prestador</li>
          <li><strong>Viagem:</strong> Viagem vinculada</li>
          <li><strong>Valor:</strong> Montante pago</li>
          <li><strong>Data:</strong> Data do pagamento</li>
          <li><strong>Forma Pgto:</strong> Como foi pago</li>
          <li><strong>Comprovante:</strong> Link para download (se houver)</li>
          <li><strong>Ações:</strong> Ver detalhes, Editar, Excluir</li>
        </ul>
      </div>

      <h3>🎯 Como Registrar uma Despesa:</h3>
      
      <div class="step">
        <strong>Passo 1:</strong> Clique em <code>Registrar Despesa</code>
      </div>

      <div class="step">
        <strong>Passo 2:</strong> Preencha:
        <ul>
          <li><strong>Viagem:</strong> Selecione qual viagem (opcional se despesa fixa)</li>
          <li><strong>Tipo de Despesa:</strong>
            <ul>
              <li>Hotel</li>
              <li>Ônibus</li>
              <li>Alimentação</li>
              <li>Combustível</li>
              <li>Pedágios</li>
              <li>Guia Turístico</li>
              <li>Outros</li>
            </ul>
          </li>
          <li><strong>Nome do Fornecedor:</strong> Ex: "Hotel Pousada Praia"</li>
          <li><strong>Valor:</strong> Ex: R$ 5.000,00</li>
          <li><strong>Data do Pagamento:</strong> Selecione no calendário</li>
          <li><strong>Forma de Pagamento:</strong> Dinheiro/PIX/Cartão/Transferência/Boleto</li>
          <li><strong>Comprovante:</strong> Upload de nota fiscal/recibo</li>
          <li><strong>Observações:</strong> Detalhes adicionais</li>
        </ul>
      </div>

      <div class="step">
        <strong>Passo 3:</strong> Clique em <code>Salvar Despesa</code>
      </div>

      <div class="success">
        <strong>✅ Impacto no Sistema:</strong>
        <ul>
          <li>Despesa é registrada</li>
          <li>Total de despesas atualizado</li>
          <li>Aparece no cálculo de lucro líquido (Receitas - Despesas)</li>
          <li>Se vinculada a viagem, aparece na análise financeira daquela viagem</li>
        </ul>
      </div>
    </div>

    <div id="fornecedores">
      <h2>10. 🏢 Fornecedores</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Fornecedores</p>
        <p><strong>Permissão:</strong> ⚠️ Apenas Administradores</p>
      </div>

      <h3>📌 Finalidade:</h3>
      <p>Cadastro de fornecedores de serviços (hotéis, transportadoras, guias, restaurantes, etc.)</p>

      <h3>🎯 Como Cadastrar Fornecedor:</h3>
      <ol>
        <li>Clique em <code>Novo Fornecedor</code></li>
        <li>Preencha: Nome, Tipo de Serviço, Contato, CNPJ, Endereço, Observações</li>
        <li>Clique em <code>Salvar</code></li>
      </ol>

      <h3>💡 Uso:</h3>
      <p>Ao registrar despesas, você pode vincular ao fornecedor cadastrado para melhor controle</p>
    </div>

    <div id="equipe">
      <h2>11. 👨‍💼 Equipe</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Equipe</p>
        <p><strong>Permissão:</strong> ⚠️ Apenas Administradores</p>
      </div>

      <h3>📌 Finalidade:</h3>
      <p>Cadastro de motoristas, guias, assistentes e coordenadores para cada viagem</p>

      <h3>🎯 Como Cadastrar Membro da Equipe:</h3>
      <ol>
        <li>Clique em <code>Novo Membro</code></li>
        <li>Preencha:
          <ul>
            <li>Nome Completo</li>
            <li>Função (Motorista/Guia/Assistente/Coordenador)</li>
            <li>Telefone, Email, CPF</li>
            <li>Viagem vinculada</li>
            <li>Status (Ativo/Inativo)</li>
          </ul>
        </li>
        <li>Clique em <code>Salvar</code></li>
      </ol>

      <h3>📋 Visualização:</h3>
      <p>Lista todos os membros com filtro por viagem e status</p>
    </div>

    <div id="relatorios">
      <h2>12. 📊 Relatórios</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Relatórios</p>
        <p><strong>Permissão:</strong> ⚠️ Apenas Administradores</p>
      </div>

      <h3>📌 Tipos de Relatórios:</h3>
      
      <div class="step">
        <strong>1. Relatório de Viagens:</strong>
        <ul>
          <li>Análise completa de todas as viagens</li>
          <li>Ocupação, receita, status</li>
          <li>Gráficos comparativos</li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Relatório Financeiro:</strong>
        <ul>
          <li>Receitas x Despesas</li>
          <li>Lucro por viagem</li>
          <li>Análise de fluxo de caixa</li>
          <li>Gráficos mensais</li>
        </ul>
      </div>

      <div class="step">
        <strong>3. Relatório de Clientes:</strong>
        <ul>
          <li>Estatísticas de clientes</li>
          <li>Análise de origem</li>
          <li>Recorrência</li>
        </ul>
      </div>

      <h3>💾 Exportação:</h3>
      <div class="action-item">
        <p>Todos os relatórios podem ser:</p>
        <ul>
          <li>📄 Exportados em PDF</li>
          <li>📊 Exportados em Excel</li>
          <li>🖨️ Impressos diretamente</li>
        </ul>
      </div>
    </div>

    <div id="formularios">
      <h2>13. 📝 Formulários Recebidos</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Formulários</p>
        <p><strong>Permissão:</strong> ✅ Todos os usuários</p>
      </div>

      <h3>📌 O que é:</h3>
      <p>Formulários enviados por clientes através do site público para se inscrever em viagens</p>

      <h3>📌 O que aparece na tela:</h3>
      
      <div class="step">
        <strong>1. Link do Formulário Público:</strong>
        <ul>
          <li>Card no topo com o link</li>
          <li>Botão <code>Copiar Link</code> para compartilhar</li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Lista de Formulários Recebidos (cada card mostra):</strong>
        <ul>
          <li><strong>Nome do Cliente:</strong> Nome completo</li>
          <li><strong>Viagem:</strong> Qual viagem selecionou</li>
          <li><strong>Contato:</strong> Telefone e email</li>
          <li><strong>Data de Envio:</strong> Quando preencheu</li>
          <li><strong>Status:</strong> Badge (Recebido/Processado)</li>
          <li><strong>Dados:</strong> CPF, forma de pagamento, quantidade de passageiros</li>
          <li><strong>Ações:</strong>
            <ul>
              <li><code>Ver Detalhes</code> - Modal com todas as informações</li>
              <li><code>Processar</code> - Converte em cliente no sistema</li>
              <li><code>Marcar como Processado</code></li>
            </ul>
          </li>
        </ul>
      </div>

      <h3>🎯 Como Processar um Formulário:</h3>
      
      <div class="step">
        <strong>Passo 1:</strong> Clique em <code>Processar</code> no card do formulário
      </div>

      <div class="step">
        <strong>Passo 2:</strong> Sistema confirma: "Deseja processar este formulário?"
      </div>

      <div class="step">
        <strong>Passo 3:</strong> Clique em <code>Sim, processar</code>
      </div>

      <div class="success">
        <strong>✅ O que acontece automaticamente:</strong>
        <ul>
          <li>Cliente principal é criado no sistema</li>
          <li>Passageiros adicionais são criados como clientes separados</li>
          <li>Todos vinculados à viagem selecionada</li>
          <li>Vagas da viagem são ocupadas</li>
          <li>Criança de colo registrada (se houver)</li>
          <li>Status do formulário muda para "Processado"</li>
        </ul>
      </div>
    </div>

    <div id="mensagens">
      <h2>14. 💬 Mensagens</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Mensagens</p>
        <p><strong>Permissão:</strong> ✅ Todos os usuários</p>
      </div>

      <h3>📌 O que é:</h3>
      <p>Mensagens de contato enviadas através do formulário do site público</p>

      <h3>📌 O que aparece na tela:</h3>
      
      <div class="step">
        <strong>Cards de Mensagens com:</strong>
        <ul>
          <li>Nome do contato</li>
          <li>Email e telefone</li>
          <li>Mensagem enviada</li>
          <li>Data de envio</li>
          <li>Status (Novo/Em Atendimento/Respondido)</li>
          <li>Ações: Responder por WhatsApp, Email, Mudar Status</li>
        </ul>
      </div>

      <h3>🎯 Como Responder:</h3>
      <ol>
        <li>Clique no ícone de WhatsApp para abrir conversa</li>
        <li>Ou clique no email para enviar resposta</li>
        <li>Marque status como "Em Atendimento" ou "Respondido"</li>
      </ol>
    </div>

    <div id="usuarios">
      <h2>15. 👤 Usuários</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Usuários</p>
        <p><strong>Permissão:</strong> ⚠️ Apenas Administradores</p>
      </div>

      <h3>📌 O que aparece na tela:</h3>
      
      <div class="step">
        <strong>Lista de Usuários com:</strong>
        <ul>
          <li>Nome completo</li>
          <li>Email</li>
          <li>Cargo (Administrador/Funcionário)</li>
          <li>Data de cadastro</li>
          <li>Status (Ativo/Inativo)</li>
        </ul>
      </div>

      <h3>🎯 Como Convidar Novo Usuário:</h3>
      
      <div class="step">
        <strong>Passo 1:</strong> Clique em <code>Convidar Usuário</code>
      </div>

      <div class="step">
        <strong>Passo 2:</strong> Preencha:
        <ul>
          <li>Email do novo usuário</li>
          <li>Cargo: Administrador ou Funcionário (user)</li>
        </ul>
      </div>

      <div class="step">
        <strong>Passo 3:</strong> Clique em <code>Enviar Convite</code>
      </div>

      <div class="success">
        <strong>✅ Usuário recebe email com link para criar senha e acessar o sistema</strong>
      </div>

      <div class="warning">
        <strong>⚠️ Diferença de Permissões:</strong>
        <ul>
          <li><strong>Administrador:</strong> Acesso total a todas as funcionalidades</li>
          <li><strong>Funcionário:</strong> Não vê: Viagens, Financeiro, Despesas, Fornecedores, Equipe, Relatórios, Usuários, Backup, Logs</li>
        </ul>
      </div>
    </div>

    <div id="backup">
      <h2>16. 💾 Backup e Arquivos</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Backup</p>
        <p><strong>Permissão:</strong> ⚠️ Apenas Administradores</p>
      </div>

      <h3>📌 O que é:</h3>
      <p>Gestão de arquivos e documentos salvos do sistema (listas de passageiros, relatórios, etc.)</p>

      <h3>📌 Funcionalidades:</h3>
      <ul>
        <li>Visualizar todos os documentos salvos</li>
        <li>Filtrar por tipo e viagem</li>
        <li>Download de documentos</li>
        <li>Excluir documentos antigos</li>
      </ul>
    </div>

    <div id="logs">
      <h2>17. 📋 Logs de Auditoria</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Logs</p>
        <p><strong>Permissão:</strong> ⚠️ Apenas Administradores</p>
      </div>

      <h3>📌 O que é:</h3>
      <p>Registro de todas as ações realizadas no sistema para auditoria e segurança</p>

      <h3>📌 O que é registrado:</h3>
      <ul>
        <li>CREATE: Criação de registros</li>
        <li>UPDATE: Edições</li>
        <li>DELETE: Exclusões</li>
        <li>EXPORT: Exportações de dados</li>
        <li>ARCHIVE: Arquivamentos</li>
        <li>LOGIN/LOGOUT: Acessos ao sistema</li>
      </ul>

      <h3>📌 Informações de cada log:</h3>
      <ul>
        <li>Data e hora exata</li>
        <li>Usuário que realizou a ação</li>
        <li>Tipo de ação</li>
        <li>Entidade afetada (Cliente, Viagem, Pagamento, etc.)</li>
        <li>Detalhes da ação</li>
        <li>IP do usuário</li>
      </ul>
    </div>

    <div id="migracao">
      <h2>18. 🔄 Migração DD</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> ⚠️ Migração DD (aparece apenas se houver viagens DD antigas)</p>
        <p><strong>Permissão:</strong> ⚠️ Apenas Administradores</p>
      </div>

      <h3>📌 O que é:</h3>
      <p>Ferramenta para migrar viagens Double Decker (DD) antigas de 56 para 57 lugares</p>

      <h3>⚠️ Quando usar:</h3>
      <div class="warning">
        <p>Use APENAS se você tem viagens DD criadas antes da atualização do sistema que aumentou de 56 para 57 lugares</p>
      </div>

      <h3>🎯 Como Usar:</h3>
      <ol>
        <li>Acesse a página de Migração DD</li>
        <li>Veja lista de viagens que precisam migração</li>
        <li>Clique em <code>Iniciar Migração</code></li>
        <li>Sistema atualiza automaticamente:
          <ul>
            <li>Vagas totais de 56 para 57</li>
            <li>Cria o assento #57 adicional</li>
          </ul>
        </li>
      </ol>
    </div>

    <div id="exportacao">
      <h2>19. 💾 Exportação de Dados</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Exportação</p>
        <p><strong>Permissão:</strong> ⚠️ Apenas Administradores</p>
      </div>

      <h3>📌 O que é:</h3>
      <p>Ferramenta para exportar todos os dados do sistema em formato JSON para backup ou migração</p>

      <h3>📌 Opções de Exportação:</h3>
      
      <div class="step">
        <strong>1. Backup Completo:</strong>
        <ul>
          <li>Baixa TODOS os dados de todas as entidades em um único arquivo JSON</li>
          <li>Inclui: Viagens, Clientes, Assentos, Quartos, Pagamentos, Parcelas, Documentos, Config, Fornecedores, Equipe, etc.</li>
          <li>Nome do arquivo: <code>backup_completo_YYYY-MM-DD.json</code></li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Exportação Individual:</strong>
        <ul>
          <li>Cards para cada entidade do sistema</li>
          <li>Mostra quantidade de registros</li>
          <li>Baixa apenas dados daquela entidade específica</li>
          <li>Nome do arquivo: <code>NomeEntidade_YYYY-MM-DD.json</code></li>
        </ul>
      </div>

      <h3>🎯 Como Exportar:</h3>
      
      <div class="step">
        <strong>Backup Completo:</strong>
        <ol>
          <li>Clique em <code>Exportar Backup Completo</code></li>
          <li>Arquivo JSON é baixado automaticamente</li>
        </ol>
      </div>

      <div class="step">
        <strong>Exportação Individual:</strong>
        <ol>
          <li>Localize o card da entidade desejada (ex: "Clientes")</li>
          <li>Clique em <code>Exportar JSON</code></li>
          <li>Arquivo JSON é baixado</li>
        </ol>
      </div>

      <h3>💡 Para que usar:</h3>
      <ul>
        <li>Backup de segurança regular</li>
        <li>Migrar dados para outro sistema</li>
        <li>Clonar sistema em outro ambiente (ex: Lovable)</li>
        <li>Análise externa dos dados</li>
        <li>Auditoria e compliance</li>
      </ul>

      <div class="warning">
        <strong>⚠️ Importante:</strong>
        <p>Os arquivos JSON exportados contêm apenas os DADOS (conteúdo das entidades). Para clonar o sistema completo, você também precisa da estrutura do código (páginas, componentes, etc.)</p>
      </div>
    </div>

    <div id="configuracoes">
      <h2>20. ⚙️ Configurações</h2>
      
      <div class="feature-box">
        <h3>Localização</h3>
        <p><strong>Menu:</strong> Configurações (último item antes de Logout)</p>
        <p><strong>Permissão:</strong> ✅ Todos os usuários (algumas opções apenas admin)</p>
      </div>

      <h3>📌 O que pode ser configurado:</h3>
      
      <div class="step">
        <strong>1. Informações da Empresa:</strong>
        <ul>
          <li>Nome da Empresa</li>
          <li>Slogan</li>
          <li>Logo (upload de imagem)</li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Contato:</strong>
        <ul>
          <li>Telefone Principal</li>
          <li>WhatsApp</li>
          <li>Email</li>
          <li>Endereço Completo</li>
        </ul>
      </div>

      <div class="step">
        <strong>3. Redes Sociais:</strong>
        <ul>
          <li>Link do Instagram</li>
          <li>Link do Facebook</li>
        </ul>
      </div>

      <div class="step">
        <strong>4. Sobre a Empresa:</strong>
        <ul>
          <li>Texto descritivo sobre a empresa (aparece no site público)</li>
        </ul>
      </div>

      <h3>🎯 Como Alterar Configurações:</h3>
      <ol>
        <li>Acesse <code>Configurações</code> no menu</li>
        <li>Edite os campos desejados</li>
        <li>Para logo: clique em <code>Upload de Logo</code> e selecione imagem</li>
        <li>Clique em <code>Salvar Configurações</code></li>
      </ol>

      <div class="success">
        <strong>✅ Mudanças aparecem imediatamente:</strong>
        <ul>
          <li>No site público</li>
          <li>Na sidebar do sistema (logo e nome)</li>
          <li>Nos documentos gerados</li>
        </ul>
      </div>
    </div>

    <div id="site-publico">
      <h2>21. 🌐 Site Público</h2>
      
      <div class="feature-box">
        <h3>Acesso</h3>
        <p><strong>Botão:</strong> "Ver Site" no menu lateral (ícone de globo)</p>
        <p><strong>URL:</strong> Página inicial pública do sistema</p>
      </div>

      <h3>📌 Páginas do Site Público:</h3>
      
      <div class="step">
        <strong>1. Home (Página Inicial):</strong>
        <ul>
          <li>Banner principal com nome e slogan da empresa</li>
          <li>Cards de destaque das viagens disponíveis</li>
          <li>Seção "Por que viajar conosco?"</li>
          <li>Call-to-action para ver viagens</li>
        </ul>
      </div>

      <div class="step">
        <strong>2. Sobre:</strong>
        <ul>
          <li>Informações sobre a empresa</li>
          <li>Missão, visão, valores</li>
          <li>Texto configurado em "Configurações > Sobre Nós"</li>
        </ul>
      </div>

      <div class="step">
        <strong>3. Viagens:</strong>
        <ul>
          <li>Catálogo de todas as viagens ativas</li>
          <li>Cards com:
            <ul>
              <li>Imagem do destino</li>
              <li>Nome e destino</li>
              <li>Datas de saída e retorno</li>
              <li>Valores dos lotes</li>
              <li>Vagas disponíveis</li>
              <li>Botão "Inscrever-se"</li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="step">
        <strong>4. Formulário de Contrato:</strong>
        <ul>
          <li>Acessível quando cliente clica em "Inscrever-se" em uma viagem</li>
          <li>Formulário completo para reserva</li>
          <li>Campos: Dados pessoais, endereço, forma de pagamento, passageiros adicionais</li>
          <li>Ao enviar, formulário aparece na aba "Formulários Recebidos" do sistema</li>
        </ul>
      </div>

      <div class="step">
        <strong>5. Contato:</strong>
        <ul>
          <li>Formulário de contato</li>
          <li>Campos: Nome, Email, Telefone, Mensagem</li>
          <li>Ao enviar, mensagem aparece na aba "Mensagens" do sistema</li>
          <li>Informações de contato da empresa</li>
          <li>Links para redes sociais</li>
        </ul>
      </div>

      <h3>🎨 Layout Público:</h3>
      <ul>
        <li>Header com logo e menu de navegação</li>
        <li>Footer com informações de contato e redes sociais</li>
        <li>Design responsivo (funciona em celular e desktop)</li>
        <li>Cores e estilo corporativo conforme configurações</li>
      </ul>
    </div>

    <hr style="margin: 40px 0; border: 2px solid #0EA5E9;">

    <h2>🎯 Fluxos de Trabalho Completos</h2>

    <h3>📋 Fluxo 1: Criar e Gerenciar uma Viagem Completa</h3>
    <ol>
      <li><strong>Criar Viagem:</strong> Menu > Viagens > Nova Viagem > Preencher dados > Salvar</li>
      <li><strong>Configurar Quartos:</strong> Menu > Quartos > Adicionar Quartos com capacidades</li>
      <li><strong>Publicar:</strong> Viagem fica visível no site público automaticamente</li>
      <li><strong>Receber Inscrições:</strong> Clientes preenchem formulário no site</li>
      <li><strong>Processar Inscrições:</strong> Menu > Formulários > Processar cada formulário</li>
      <li><strong>Alocar Assentos:</strong> Menu > Assentos > Selecionar viagem > Clicar em assento > Alocar cliente</li>
      <li><strong>Alocar Quartos:</strong> Menu > Quartos > Alocar Hóspede em cada quarto</li>
      <li><strong>Gerar Listas:</strong> Menu > Assentos > Gerar Lista de Assentos (para impressão)</li>
      <li><strong>Gerar Lista de Quartos:</strong> Menu > Quartos > Gerar Lista de Quartos</li>
      <li><strong>Comunicação:</strong> Menu > WhatsApp > Enviar informações para todos os passageiros</li>
      <li><strong>Finalizar:</strong> Após viagem, mudar status para "Finalizada" e arquivar</li>
    </ol>

    <h3>💰 Fluxo 2: Controle Financeiro Completo</h3>
    <ol>
      <li><strong>Cadastrar Cliente:</strong> Com forma de pagamento e parcelas</li>
      <li><strong>Gerar Parcelas:</strong> Menu > Financeiro > Gerar Parcelas > Selecionar cliente</li>
      <li><strong>Registrar Pagamentos:</strong> Menu > Financeiro > Registrar Pagamento (quando cliente paga)</li>
      <li><strong>Monitorar Alertas:</strong> Menu > Financeiro > Aba Alertas (ver parcelas atrasadas)</li>
      <li><strong>Registrar Despesas:</strong> Menu > Despesas > Registrar todas as despesas da viagem</li>
      <li><strong>Análise:</strong> Menu > Financeiro > Aba Por Viagem (ver lucro de cada viagem)</li>
      <li><strong>Relatórios:</strong> Menu > Relatórios > Gerar relatório financeiro completo</li>
    </ol>

    <h3>📱 Fluxo 3: Comunicação com Clientes</h3>
    <ol>
      <li><strong>WhatsApp Individual:</strong> Menu > Clientes > Clicar ícone WhatsApp ao lado do nome</li>
      <li><strong>WhatsApp em Grupo:</strong> Menu > WhatsApp > Filtrar por viagem > Selecionar clientes > Enviar</li>
      <li><strong>Responder Mensagens:</strong> Menu > Mensagens > Responder contatos do site</li>
      <li><strong>Email:</strong> Através do email cadastrado no cliente</li>
    </ol>

    <hr style="margin: 40px 0; border: 2px solid #0EA5E9;">

    <h2>⚠️ Avisos e Limitações</h2>
    
    <div class="warning">
      <h3>Restrições do Sistema:</h3>
      <ul>
        <li>WhatsApp Web NÃO funciona embutido (abre em nova janela por restrição de segurança)</li>
        <li>Funcionários não têm acesso a: Viagens, Financeiro, Despesas, Fornecedores, Equipe, Relatórios, Usuários, Logs, Exportação</li>
        <li>Exclusão de clientes com pagamentos registrados exige confirmação</li>
        <li>Arquivamento de viagens não deleta os dados, apenas oculta da lista ativa</li>
        <li>Logs de auditoria NÃO podem ser deletados (segurança)</li>
      </ul>
    </div>

    <div class="success">
      <h3>✅ Boas Práticas:</h3>
      <ul>
        <li>Faça backup regular usando Menu > Exportação > Backup Completo</li>
        <li>Configure todas as informações da empresa antes de publicar o site</li>
        <li>Gere parcelas assim que cadastrar cliente com pagamento parcelado</li>
        <li>Sempre aloque assentos E quartos para melhor organização</li>
        <li>Registre todas as despesas para ter controle de lucro real</li>
        <li>Use grupos coloridos para identificar famílias facilmente</li>
        <li>Acompanhe alertas de parcelas diariamente</li>
      </ul>
    </div>

    <hr style="margin: 40px 0; border: 2px solid #0EA5E9;">

    <div style="background: linear-gradient(135deg, #0EA5E9 0%, #0369a1 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-top: 50px;">
      <h2 style="color: white; border: none; margin-top: 0;">📚 Fim da Documentação</h2>
      <p style="font-size: 18px;">Sistema Fly Turismo - Gestão Completa de Agência de Viagens</p>
      <p><strong>Versão:</strong> 1.0 | <strong>Gerado em:</strong> ${new Date().toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
      <p style="margin-top: 20px; font-size: 14px;">Este documento contém todas as funcionalidades, fluxos de trabalho e instruções detalhadas do sistema.</p>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([documentacao], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Documentacao_Completa_Sistema_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setGerando(false);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          Documentação do Sistema
        </h1>
        <p className="text-gray-600">
          Baixe o manual completo com todas as funcionalidades, fluxos de trabalho e instruções passo a passo
        </p>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Documentação Completa do Sistema
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Manual detalhado em HTML com mais de 20 páginas explicando:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                📋 O que está incluído:
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ Visão geral do sistema</li>
                <li>✅ Cada página explicada em detalhes</li>
                <li>✅ O que é clicável e o que acontece</li>
                <li>✅ Formulários e campos disponíveis</li>
                <li>✅ Fluxos de trabalho completos</li>
                <li>✅ Passo a passo de cada funcionalidade</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                🎯 Conteúdo detalhado:
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>📊 Dashboard e estatísticas</li>
                <li>✈️ Criação e gestão de viagens</li>
                <li>👥 Cadastro de clientes</li>
                <li>🪑 Alocação de assentos e quartos</li>
                <li>💰 Controle financeiro completo</li>
                <li>📱 Integração com WhatsApp</li>
                <li>📝 Formulários e relatórios</li>
                <li>⚙️ Configurações e usuários</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              💡 Formato e Uso:
            </h3>
            <ul className="text-sm text-amber-900 space-y-1">
              <li>• Arquivo HTML completo e responsivo</li>
              <li>• Abra em qualquer navegador</li>
              <li>• Índice clicável para navegação rápida</li>
              <li>• Print-friendly (pode imprimir em PDF)</li>
              <li>• Visual profissional com cores e formatação</li>
              <li>• Exemplos práticos de uso</li>
              <li>• Avisos de segurança e boas práticas</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              ✨ Perfeito para:
            </h3>
            <ul className="text-sm text-green-900 space-y-1">
              <li>📚 Treinamento de novos funcionários</li>
              <li>🔄 Clonar o sistema em outro ambiente (Lovable, etc.)</li>
              <li>📖 Referência rápida de funcionalidades</li>
              <li>🎓 Documentação técnica completa</li>
              <li>💼 Apresentações para stakeholders</li>
            </ul>
          </div>

          <Button
            onClick={gerarDocumentacaoCompleta}
            disabled={gerando}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
          >
            {gerando ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Gerando Documentação...
              </>
            ) : (
              <>
                <Download className="w-6 h-6 mr-2" />
                Baixar Documentação Completa (HTML)
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            O arquivo será baixado em formato HTML e pode ser aberto em qualquer navegador. 
            Contém mais de 10.000 palavras explicando cada detalhe do sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}