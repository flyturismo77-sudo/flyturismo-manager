import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, MapPin, Calendar, Users, Globe, Award } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';

export default function Home() {
  const { data: viagens = [] } = useQuery({
    queryKey: ['viagens-destaque'],
    queryFn: () => base44.entities.Viagem.filter({ status: 'Aberta' }, '-created_date', 3),
  });

  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const configs = await base44.entities.ConfiguracaoEmpresa.list();
      return configs[0];
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-blue-700 to-blue-900" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {config?.nome_empresa || 'Fly Turismo'}
          </h1>
          <p className="text-xl md:text-3xl mb-8 text-amber-300 font-semibold">
            {config?.slogan || 'Seu próximo destino começa aqui'}
          </p>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Descubra os melhores destinos do Brasil e do mundo com conforto, segurança e preços especiais
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('ViagensPublico')}>
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white shadow-2xl text-lg px-8 py-6">
                <Plane className="w-5 h-5 mr-2" />
                Ver Viagens Disponíveis
              </Button>
            </Link>
            <Link to={createPageUrl('Contato')}>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-6">
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Atendimento Personalizado</h3>
                <p className="text-gray-600">Equipe dedicada para planejar a viagem dos seus sonhos</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Qualidade Garantida</h3>
                <p className="text-gray-600">Parceiros selecionados e serviços de excelência</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Destinos Exclusivos</h3>
                <p className="text-gray-600">Os melhores lugares para você conhecer e se encantar</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Viagens em Destaque</h2>
            <p className="text-xl text-gray-600">Confira nossos pacotes mais procurados</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {viagens.map((viagem) => (
              <Card key={viagem.id} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-56 bg-gradient-to-br from-sky-400 to-blue-600 overflow-hidden">
                  {viagem.imagem_url ? (
                    <img src={viagem.imagem_url} alt={viagem.destino} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-20 h-20 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    R$ {viagem.valor_total?.toLocaleString('pt-BR')}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{viagem.nome}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 text-sky-600" />
                    <span className="font-medium">{viagem.destino}</span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>
                        {format(new Date(viagem.data_saida), "dd 'de' MMMM", { locale: ptBR })} - {format(new Date(viagem.data_retorno), "dd 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>{viagem.vagas_totais - viagem.vagas_ocupadas} vagas disponíveis</span>
                    </div>
                  </div>

                  <Link to={createPageUrl('Contato')}>
                    <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700">
                      Reservar Agora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {viagens.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Plane className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Em breve, novos destinos incríveis!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to={createPageUrl('ViagensPublico')}>
              <Button size="lg" variant="outline" className="border-2 border-sky-600 text-sky-600 hover:bg-sky-50">
                Ver Todas as Viagens
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Pronto para sua próxima aventura?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos tornar sua viagem inesquecível
          </p>
          <Link to={createPageUrl('Contato')}>
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl text-lg px-10 py-6">
              Fale Conosco Agora
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}