import { Shield } from 'lucide-react';

export default function Navigation({ currentPage, onNavigate }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('intro')}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl group-hover:bg-cyan-500/30 transition-all duration-300" />
              <Shield className="w-8 h-8 text-cyan-400 relative transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-audiowide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Obscura
            </span>
          </button>

          <div className="flex gap-2">
            {[
              { id: 'intro', label: 'Home' },
              { id: 'encrypt', label: 'Encrypt' },
              { id: 'decrypt', label: 'Decrypt' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
