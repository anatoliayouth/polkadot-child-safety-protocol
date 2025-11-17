import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

const Home = () => {
  return (
    <>
      <Head>
        <title>Polkadot Child Safety MVP - Home</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-polkadotDark via-polkadotIndigo to-polkadotDark">
        <Header />

        <main className="container mx-auto px-4 py-16">
          <section className="text-center mb-16 pt-8">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-polkadotPink to-polkadotPurple rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold text-3xl">P</span>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-polkadotPink to-polkadotPurple bg-clip-text text-transparent">
              Polkadot Child Safety MVP
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Guardian-controlled safety policies meet Web3. Set spending rules and query safety registries before sensitive actions.
            </p>

            <Link
              href="/demo"
              className="inline-block px-8 py-4 bg-polkadotPink hover:bg-pink-600 text-white text-lg font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              🚀 View Interactive Demo
            </Link>
          </section>

          <section className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-polkadotIndigo to-polkadotPurple rounded-2xl p-8 shadow-2xl">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-3 text-white">The Problem</h2>
              <p className="text-gray-200">
                Minors and vulnerable users need protection in decentralized applications. Traditional Web3 lacks guardian-enforced controls, leaving users exposed to scams, excessive spending, and dangerous interactions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-polkadotPurple to-polkadotIndigo rounded-2xl p-8 shadow-2xl">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-3 text-white">The Solution</h2>
              <p className="text-gray-200">
                Guardians set spending caps and allowlists via smart contracts. dApps query a decentralized safety registry before sensitive actions. Violations are blocked on-chain, ensuring true guardian enforcement.
              </p>
            </div>
          </section>

          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-polkadotIndigo rounded-xl p-6 text-center">
                <div className="text-5xl mb-3">👨‍👧‍👦</div>
                <h3 className="text-xl font-semibold mb-2 text-white">1. Guardian Sets Policy</h3>
                <p className="text-gray-300 text-sm">
                  Guardians configure spend caps, allowlists, and guardian permissions through ink! smart contracts.
                </p>
              </div>
              <div className="bg-polkadotIndigo rounded-xl p-6 text-center">
                <div className="text-5xl mb-3">🛡️</div>
                <h3 className="text-xl font-semibold mb-2 text-white">2. Registry Flags Threats</h3>
                <p className="text-gray-300 text-sm">
                  Community-maintained safety registry flags known scams and compromised wallets across the network.
                </p>
              </div>
              <div className="bg-polkadotIndigo rounded-xl p-6 text-center">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="text-xl font-semibold mb-2 text-white">3. dApp Queries</h3>
                <p className="text-gray-300 text-sm">
                  Before executing transactions, dApps query the guardian policy and safety registry to enforce rules.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-polkadotPurple to-polkadotIndigo rounded-2xl p-8 max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-center mb-6 text-white">Tech Stack</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: '🦑', name: 'ink! Smart Contracts', desc: 'Rust-based contract logic' },
                { icon: '⚙️', name: 'Polkadot Substrate', desc: 'Blockchain infrastructure' },
                { icon: '🆔', name: 'KILT Protocol', desc: 'Decentralized identifiers' },
                { icon: '⚛️', name: 'Next.js + React', desc: 'Frontend interface' }
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="bg-polkadotDark rounded-xl px-6 py-4 text-center min-w-[140px] hover:scale-105 transition-transform"
                >
                  <div className="text-3xl mb-2">{tech.icon}</div>
                  <div className="font-semibold text-white text-sm">{tech.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{tech.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to explore?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/demo"
                className="px-8 py-4 bg-polkadotPink hover:bg-pink-600 text-white text-lg font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Try the Demo
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white text-lg font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95"
              >
                Learn More
              </Link>
            </div>
          </section>
        </main>

        <footer className="border-t border-gray-700 py-8 mt-16">
          <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
            <p>Polkadot Child Safety MVP &copy; 2024</p>
            <p className="mt-2">Built with ink!, Polkadot, KILT, and Next.js</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
