import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Heart, Shield, Users, Plane, Target } from 'lucide-react';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';

export default function Sobre() {
  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const configs = await base44.entities.ConfiguracaoEmpresa.list();
      return configs[0];
    },
  });

  const valores = [
    {
      icon: Heart,
      titulo: 'Paixão por Viajar',
      descricao: 'Amamos o que fazemos e queremos que você viva experiências únicas'
    },
    {
      icon: Shield,
      titulo: 'Segurança e Confiança',
      descricao: 'Parceiros certificados e total transparência em todos os processos'
    },
    {
      icon: Users,
      titulo: 'Atendimento Humanizado',
      descricao: 'Cada cliente é especial e merece nossa atenção personalizada'
    },
    {
      icon: Award,
      titulo: 'Excelência',
      descricao: 'Buscamos sempre os melhores serviços e destinos para você'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-sky-700" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Sobre Nós</h1>
          <p className="text-xl md:text-2xl text-amber-300">Conheça a história da {config?.nome_empresa || 'Fly Turismo'}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-none shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Nossa História</h2>
                  <p className="text-amber-600 font-medium">{config?.slogan || 'Seu próximo destino começa aqui'}</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {config?.sobre_nos || `A ${config?.nome_empresa || 'Fly Turismo'} nasceu do sonho de proporcionar experiências inesquecíveis através de viagens planejadas com cuidado e dedicação. Nossa missão é conectar pessoas a destinos incríveis, transformando sonhos em realidade.`}
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  Com anos de experiência no mercado de turismo, construímos uma reputação baseada em confiança, qualidade e compromisso com a satisfação dos nossos clientes. Cada viagem é cuidadosamente planejada para garantir momentos únicos e memoráveis.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Nossa equipe é formada por profissionais apaixonados por turismo, sempre prontos para oferecer o melhor atendimento e as melhores opções de destinos, acomodações e experiências.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Target className="w-16 h-16 mx-auto mb-4 text-amber-600" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Valores</h2>
            <p className="text-xl text-gray-600">O que nos move e nos torna únicos</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <valor.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{valor.titulo}</h3>
                  <p className="text-gray-600">{valor.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Nossa Missão</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Proporcionar experiências de viagem excepcionais, conectando pessoas aos melhores destinos 
            com segurança, conforto e preços acessíveis, sempre superando expectativas e criando memórias 
            que durarão para toda a vida.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-5xl font-bold text-sky-600 mb-2">+1000</div>
              <p className="text-gray-600 font-medium">Clientes Satisfeitos</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-amber-600 mb-2">+50</div>
              <p className="text-gray-600 font-medium">Destinos Visitados</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">100%</div>
              <p className="text-gray-600 font-medium">Dedicação</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}