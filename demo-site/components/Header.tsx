import Link from 'next/link';
import { useState } from 'react';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-polkadotDark text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-polkadotPink to-polkadotPurple rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-xl">
              Polkadot <span className="text-polkadotPink">Child Safety</span>
            </span>
          </Link>

          <button
            className="md:hidden p-2 hover:bg-polkadotPurple rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex space-x-6 items-center">
            <Link
              href="/demo"
              className="hover:text-polkadotPink transition-colors font-medium"
            >
              Demo
            </Link>
            <Link
              href="/about"
              className="hover:text-polkadotPink transition-colors font-medium"
            >
              About
            </Link>
            <a
              href="https://github.com/polkadot/child-safety-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-polkadotPink transition-colors font-medium flex items-center"
              aria-label="GitHub repository"
            >
              GitHub
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-4 pb-2 space-y-3 animate-slideIn">
            <Link
              href="/demo"
              className="block py-2 px-4 hover:bg-polkadotPurple rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              href="/about"
              className="block py-2 px-4 hover:bg-polkadotPurple rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <a
              href="https://github.com/polkadot/child-safety-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 px-4 hover:bg-polkadotPurple rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              GitHub
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
