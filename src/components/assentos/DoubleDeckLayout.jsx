import React from "react";
import { Armchair } from "lucide-react";

export default function DoubleDeckLayout({ 
  clientePorPoltrona, 
  searchTerm, 
  onSeatClick, 
  renderSeatInfo 
}) {
  
  const renderSeat = (seatNumber, isWide = false) => {
    if (!seatNumber) return <div className="w-16 h-16" />;
    
    const cliente = clientePorPoltrona[seatNumber];
    const isOccupied = !!cliente;
    const matchesSearch = !searchTerm || 
      (cliente && (
        cliente.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cpf?.includes(searchTerm) ||
        (cliente.poltrona && cliente.poltrona.toString().includes(searchTerm))
      )) || 
      (!isOccupied && seatNumber.toString().includes(searchTerm));

    return (
      <div className="relative group">
        <button
          onClick={() => onSeatClick(seatNumber)}
          title={isOccupied ? cliente.nome_completo : `Poltrona ${seatNumber} disponível`}
          className={`
            ${isWide ? 'w-36' : 'w-16'} h-16 rounded-lg border-2 transition-all duration-200
            flex flex-col items-center justify-center p-1
            ${isOccupied 
              ? 'bg-green-100 border-green-500 hover:bg-green-200' 
              : 'bg-sky-500 border-sky-600 hover:bg-sky-600'
            }
            ${!matchesSearch && searchTerm ? 'opacity-30' : ''}
          `}
        >
          <Armchair className={`w-4 h-4 ${isOccupied ? 'text-green-700' : 'text-white'}`} />
          <span className={`text-sm font-bold ${isOccupied ? 'text-gray-700' : 'text-white'}`}>{seatNumber}</span>
        </button>
        {isOccupied && (
          <div className="hidden group-hover:block">
            {renderSeatInfo(cliente)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
      {/* PISO SUPERIOR (1-48) */}
      <div className="flex-1 max-w-md">
        <div className="bg-gradient-to-b from-sky-100 to-sky-50 p-6 rounded-t-[80px] rounded-b-3xl border-4 border-sky-400">
          <h3 className="text-center font-bold text-sky-900 mb-4 text-lg">
            🔼 PISO SUPERIOR
          </h3>
          
          <div className="space-y-2">
            {/* Fileira 1-2 | 4-3 */}
            <div className="flex gap-3 justify-center">
              <div className="flex gap-1">
                {renderSeat(1)}
                {renderSeat(2)}
              </div>
              <div className="w-8 border-x-2 border-dashed border-sky-300" />
              <div className="flex gap-1">
                {renderSeat(4)}
                {renderSeat(3)}
              </div>
            </div>

            {/* Fileira 5-6 | 7-8 */}
            <div className="flex gap-3 justify-center">
              <div className="flex gap-1">
                {renderSeat(5)}
                {renderSeat(6)}
              </div>
              <div className="w-8 border-x-2 border-dashed border-sky-300" />
              <div className="flex gap-1">
                {renderSeat(7)}
                {renderSeat(8)}
              </div>
            </div>

            {/* Fileira 9-10 | 11-12 */}
            <div className="flex gap-3 justify-center">
              <div className="flex gap-1">
                {renderSeat(9)}
                {renderSeat(10)}
              </div>
              <div className="w-8 border-x-2 border-dashed border-sky-300" />
              <div className="flex gap-1">
                {renderSeat(11)}
                {renderSeat(12)}
              </div>
            </div>

            {/* ENTRADA + GELADEIRA */}
            <div className="flex gap-3 justify-center items-center">
              <div className="flex gap-1">
                {renderSeat(13)}
                {renderSeat(14)}
              </div>
              <div className="w-8" />
              <div className="flex flex-col gap-2">
                <div className="w-[136px] bg-yellow-100 border-2 border-yellow-400 rounded-lg py-1 text-center">
                  <p className="text-[10px] font-bold text-yellow-900">ENTRADA →</p>
                </div>
                <div className="w-[136px] bg-cyan-100 border-2 border-cyan-400 rounded-lg py-1 text-center">
                  <p className="text-[10px] font-bold text-cyan-900">GELADEIRA/LAVA LAVA</p>
                </div>
              </div>
            </div>

            {/* Fileira 15-16 (esquerda) */}
            <div className="flex gap-3 justify-center">
              <div className="flex gap-1">
                {renderSeat(15)}
                {renderSeat(16)}
              </div>
              <div className="w-8 border-x-2 border-dashed border-sky-300" />
              <div className="w-[136px]" /> {/* Empty */}
            </div>

            {/* Fileira 17-18 | 20-19 */}
            <div className="flex gap-3 justify-center">
              <div className="flex gap-1">
                {renderSeat(17)}
                {renderSeat(18)}
              </div>
              <div className="w-8 border-x-2 border-dashed border-sky-300" />
              <div className="flex gap-1">
                {renderSeat(20)}
                {renderSeat(19)}
              </div>
            </div>

            {/* Fileira 21-22 | 24-23 */}
            <div className="flex gap-3 justify-center">
              <div className="flex gap-1">
                {renderSeat(21)}
                {renderSeat(22)}
              </div>
              <div className="w-8 border-x-2 border-dashed border-sky-300" />
              <div className="flex gap-1">
                {renderSeat(24)}
                {renderSeat(23)}
              </div>
            </div>

            {/* Fileira 25-26 | 28-27 */}
            <div className="flex gap-3 justify-center">
              <div className="flex gap-1">
                {renderSeat(25)}
                {renderSeat(26)}
              </div>
              <div className="w-8 border-x-2 border-dashed border-sky-300" />
              <div className="flex gap-1">
                {renderSeat(28)}
                {renderSeat(27)}
              </div>
            </div>

            {/* Fileira 29-30 | 32-31 */}
            <div className="flex gap-3 justify-center">
              <div className="flex gap-1">
                {renderSeat(29)}
                {renderSeat(30)}
              </div>
              <div className="w-8 border-x-2 border-dashed border-sky-300" />
              <div className="flex gap-1">
                {renderSeat(32)}
                {renderSeat(31)}
              </div>
            </div>

            {/* Fileira 33-34 | 36-35 */}
            <div className="flex gap-3 justify-center">
              <div className="flex gap-1">
                {renderSeat(33)}
                {renderSeat(34)}
              </div>
              <div className="w-8 border-x-2 border-dashed border-sky-300" />
              <div className="flex gap-1">
                {renderSeat(36)}
                {renderSeat(35)}
              </div>
            </div>

            {/* Fileira 37-38 | 40-39 */}
            <div className="flex gap-3 justify-center">
              <div className="flex gap-1">
                {renderSeat(37)}
                {renderSeat(38)}
              </div>
              <div className="w-8 border-x-2 border-dashed border-sky-300" />
              <div className="flex gap-1">
                {renderSeat(40)}
                {renderSeat(39)}
              </div>
            </div>

            {/* Fileira 41-42 | 44-43 */}
            <div className="flex gap-3 justify-center">
              <div className="flex gap-1">
                {renderSeat(41)}
                {renderSeat(42)}
              </div>
              <div className="w-8 border-x-2 border-dashed border-sky-300" />
              <div className="flex gap-1">
                {renderSeat(44)}
                {renderSeat(43)}
              </div>
            </div>

            {/* Fileira 45-46 | 48-47 */}
            <div className="flex gap-3 justify-center">
              <div className="flex gap-1">
                {renderSeat(45)}
                {renderSeat(46)}
              </div>
              <div className="w-8 border-x-2 border-dashed border-sky-300" />
              <div className="flex gap-1">
                {renderSeat(48)}
                {renderSeat(47)}
              </div>
            </div>

            {/* BEBEDOURO / GELADEIRA */}
            <div className="bg-cyan-100 border-2 border-cyan-400 rounded-lg py-2 text-center mt-2">
              <p className="text-xs font-bold text-cyan-900">🧊 BEBEDOURO / GELADEIRA</p>
            </div>
          </div>
        </div>
      </div>

      {/* PISO INFERIOR (49-57) */}
      <div className="flex-1 max-w-md">
        <div className="bg-gradient-to-b from-orange-100 to-orange-50 p-6 rounded-t-[80px] rounded-b-3xl border-4 border-orange-400">
          <h3 className="text-center font-bold text-orange-900 mb-4 text-lg">
            🔽 PISO INFERIOR
          </h3>
          
          <div className="space-y-3">
            {/* MOTORISTA 1 */}
            <div className="bg-gray-800 text-white rounded-lg py-3 text-center font-bold">
              🚗 MOTORISTA 1
            </div>

            {/* Espaço */}
            <div className="h-8" />

            {/* ESCADA (direita) */}
            <div className="flex justify-end">
              <div className="w-[180px] bg-purple-100 border-2 border-purple-400 rounded-lg py-2 text-center">
                <p className="text-xs font-bold text-purple-900">🪜 ESCADA</p>
              </div>
            </div>

            {/* BANHEIRO + ENTRADA */}
            <div className="flex gap-3 justify-between">
              <div className="w-[110px] bg-teal-100 border-2 border-teal-400 rounded-lg py-2 text-center">
                <p className="text-xs font-bold text-teal-900">🚻 BANHEIRO</p>
              </div>
              <div className="w-[110px] bg-yellow-100 border-2 border-yellow-400 rounded-lg py-2 text-center">
                <p className="text-xs font-bold text-yellow-900">🚪 ENTRADA</p>
              </div>
            </div>

            {/* 49-50 | 51 (largo) */}
            <div className="flex gap-3 justify-between items-center">
              <div className="flex gap-1">
                {renderSeat(49)}
                {renderSeat(50)}
              </div>
              {renderSeat(51, true)}
            </div>

            {/* 52-53 | 54 (largo) */}
            <div className="flex gap-3 justify-between items-center">
              <div className="flex gap-1">
                {renderSeat(52)}
                {renderSeat(53)}
              </div>
              {renderSeat(54, true)}
            </div>

            {/* 55-56 | 57 (largo) */}
            <div className="flex gap-3 justify-between items-center">
              <div className="flex gap-1">
                {renderSeat(55)}
                {renderSeat(56)}
              </div>
              {renderSeat(57, true)}
            </div>

            {/* BEBEDOURO / LIXEIRA */}
            <div className="bg-green-100 border-2 border-green-400 rounded-lg py-3 text-center">
              <p className="text-xs font-bold text-green-900">💧 BEBEDOURO / LIXEIRA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}