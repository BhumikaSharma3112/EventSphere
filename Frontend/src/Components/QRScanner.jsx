import React, { useState } from 'react';
import { Camera, Scan, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

const QRScanner = ({ onScan }) => {
  const [code, setCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    onScan(code.trim());
    setCode('');
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Fire confetti and scan
      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF0F1', '#FAF6EE']
      });
      // Scan the typed code or a mock code if empty
      onScan(code.trim() || 'mock_ticket_code_simulated');
    }, 2000);
  };

  return (
    <div className="bg-luxury-cream/45 border border-[#E5D3B3]/45 rounded-3xl p-6 flex flex-col items-center">
      
      {/* Scan Frame */}
      <div className="relative w-64 h-64 border-2 border-dashed border-[#E5D3B3] rounded-3xl overflow-hidden flex flex-col items-center justify-center bg-white shadow-sm mb-6">
        
        {/* Animated Laser Line */}
        {isScanning && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-luxury-gold shadow-md shadow-luxury-gold animate-bounce z-10" style={{ animationDuration: '2.5s' }} />
        )}

        {isScanning ? (
          <div className="flex flex-col items-center gap-2">
            <Scan className="h-10 w-10 text-luxury-gold animate-pulse" />
            <span className="text-[10px] tracking-widest uppercase font-semibold text-luxury-gold animate-pulse">
              Scanning Pass...
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Camera className="h-10 w-10 text-luxury-muted" />
            <button
              onClick={handleSimulateScan}
              className="px-4 py-2 bg-luxury-gold hover:bg-luxury-gold-dark text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm cursor-pointer"
            >
              Simulate Camera Scan
            </button>
          </div>
        )}
      </div>

      {/* Manual Input Fallback */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs flex items-center gap-2 border border-[#E5D3B3]/40 bg-white rounded-2xl p-1 shadow-sm">
        <input
          type="text"
          placeholder="Or enter ticket code manually..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-transparent border-none text-xs px-3 focus:outline-none placeholder-luxury-muted text-luxury-dark font-medium"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-luxury-beige/50 hover:bg-luxury-gold hover:text-white text-luxury-dark transition-all cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      
    </div>
  );
};

export default QRScanner;
