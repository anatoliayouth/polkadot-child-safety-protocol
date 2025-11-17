import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>Polkadot Child Safety MVP - About</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-polkadotDark via-polkadotIndigo to-polkadotDark">
        <Header />

        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-polkadotPink to-polkadotPurple bg-clip-text text-transparent text-center">
            How It Works
          </h1>

          <section className="bg-white dark:bg-polkadotIndigo rounded-2xl shadow-2xl p-8 mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Architecture Overview</h2>
            <div className="bg-polkadotDark rounded-xl p-6 mb-4 font-mono text-sm overflow-x-auto">
              <pre className="text-gray-300 whitespace-pre">
{`┌──────────────────────────────────────────────────────────┐
│                                                          │
│                   dApp / Frontend Layer                  │
│            (Guardian Dashboard, Web3 DApps)              │
│                                                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │  Query Safety & Policy
                     │
         ┌───────────▼──────────────────────────┐
         │                                      │
         │      Polkadot / Substrate Chain      │
         │                                      │
         │  ┌────────────────────────────────┐  │
         │  │   Guardian Policy Contract     │  │
         │  │  (ink! Smart Contract)         │  │
         │  │                                │  │
         │  │  - Spend caps                  │  │
         │  │  - Allowlists                  │  │
         │  │  - Guardian roles              │  │
         │  └────────────────────────────────┘  │
         │                                      │
         │  ┌────────────────────────────────┐  │
         │  │   Safety Registry Contract     │  │
         │  │  (ink! Smart Contract)         │  │
         │  │                                │  │
         │  │  - Flagged addresses           │  │
         │  │  - Unflag operations           │  │
         │  │  - Community reporting         │  │
         │  └────────────────────────────────┘  │
         │                                      │
         └──────────────────────────────────────┘
                     │
                     │  KILT DID Integration
                     │
         ┌───────────▼──────────────────────────┐
         │                                      │
         │       KILT Protocol (DIDs)           │
         │                                      │
         │  - Decentralized identifiers         │
         │  - Guardian credentials              │
         │  - Child identity attestations       │
         │                                      │
         └──────────────────────────────────────┘`}
              </pre>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The Polkadot Child Safety MVP combines multiple layers:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
              <li>
                <strong className="text-gray-900 dark:text-white">Frontend Layer:</strong> Guardian Dashboard and Web3 dApps query policies before sensitive actions
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Smart Contract Layer:</strong> ink! contracts on Substrate store and enforce rules
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Identity Layer:</strong> KILT DIDs provide decentralized identity and attestations
              </li>
            </ul>
          </section>

          <section className="bg-white dark:bg-polkadotIndigo rounded-2xl shadow-2xl p-8 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Component Details</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-polkadotPink pl-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Guardian Policy Contract
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Written in ink! (Rust for smart contracts), this contract manages:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 ml-4">
                  <li><strong>Spend Caps:</strong> Maximum DOT a child account can spend in a period</li>
                  <li><strong>Allowlists:</strong> Pre-approved addresses the child can transact with</li>
                  <li><strong>Guardian Roles:</strong> Admin, moderator, and viewer permissions</li>
                  <li><strong>Policy Enforcement:</strong> On-chain validation before transactions</li>
                </ul>
              </div>

              <div className="border-l-4 border-polkadotPurple pl-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Safety Registry Contract
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  A decentralized registry that:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 ml-4">
                  <li><strong>Flags Addresses:</strong> Community reports scams, compromised wallets, and malicious contracts</li>
                  <li><strong>Stores Reasons:</strong> Each flag includes context (e.g., "known phishing site")</li>
                  <li><strong>Enables Unflagging:</strong> Addresses can be cleared after resolution</li>
                  <li><strong>Provides Queries:</strong> dApps check addresses before transactions</li>
                </ul>
              </div>

              <div className="border-l-4 border-polkadotIndigo pl-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  KILT DID Integration
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  KILT Protocol provides:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 ml-4">
                  <li><strong>Decentralized Identifiers (DIDs):</strong> Unique identities for guardians and children</li>
                  <li><strong>Attestations:</strong> Verifiable credentials (e.g., "John is guardian of Alice")</li>
                  <li><strong>Privacy:</strong> Identity data stored off-chain with on-chain verification</li>
                  <li><strong>Interoperability:</strong> DIDs work across Polkadot parachains</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-polkadotIndigo rounded-2xl shadow-2xl p-8 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">dApp Query Flow</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-polkadotPink text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">User initiates transaction:</strong> Child attempts to send DOT to an address
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-polkadotPurple text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">dApp queries Safety Registry:</strong> Is the target address flagged?
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-polkadotIndigo text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">dApp queries Guardian Policy:</strong> Is the address in the allowlist? Does it exceed the spend cap?
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">Decision:</strong> If all checks pass, transaction proceeds. Otherwise, it&apos;s blocked with a clear reason.
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-polkadotPurple to-polkadotIndigo rounded-2xl shadow-2xl p-8 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-white">Tech Stack</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Backend / Blockchain</h3>
                <ul className="space-y-2 text-gray-200">
                  <li className="flex items-center">
                    <span className="mr-2">🦑</span>
                    <strong className="mr-2">ink!:</strong> Rust-based smart contracts
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">⚙️</span>
                    <strong className="mr-2">Substrate:</strong> Polkadot blockchain framework
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🆔</span>
                    <strong className="mr-2">KILT:</strong> Decentralized identifiers
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🔗</span>
                    <strong className="mr-2">polkadot.js:</strong> Blockchain interaction library
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Frontend</h3>
                <ul className="space-y-2 text-gray-200">
                  <li className="flex items-center">
                    <span className="mr-2">⚛️</span>
                    <strong className="mr-2">Next.js:</strong> React framework with SSR
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🎨</span>
                    <strong className="mr-2">Tailwind CSS:</strong> Utility-first styling
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">📘</span>
                    <strong className="mr-2">TypeScript:</strong> Type-safe JavaScript
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🍞</span>
                    <strong className="mr-2">React Toastify:</strong> User notifications
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">Ready to Try It?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/demo"
                className="px-8 py-4 bg-polkadotPink hover:bg-pink-600 text-white text-lg font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Try the Demo
              </Link>
              <a
                href="https://github.com/polkadot/child-safety-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white text-lg font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" />
                </svg>
                View on GitHub
              </a>
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

export default AboutPage;
