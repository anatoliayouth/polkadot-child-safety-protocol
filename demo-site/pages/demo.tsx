import Head from 'next/head';
import Header from '../components/Header';
import GuardianPanel from '../components/GuardianPanel';
import RegistryPanel from '../components/RegistryPanel';
import SimulatePanel from '../components/SimulatePanel';
import { useDemoState } from '../context/DemoState';
import { formatAddress } from '../hooks/useMockContracts';

const DemoPage = () => {
  const { state } = useDemoState();

  return (
    <>
      <Head>
        <title>Polkadot Child Safety MVP - Demo</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-polkadotDark via-polkadotIndigo to-polkadotDark">
        <Header />

        <main className="container mx-auto px-4 py-12 space-y-10">
          <section className="grid gap-4 md:grid-cols-2 bg-white dark:bg-polkadotIndigo rounded-2xl shadow-2xl p-6 border border-transparent hover:border-polkadotPink transition-colors" aria-label="Connected accounts">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-polkadotPink to-polkadotPurple flex items-center justify-center text-white text-2xl">
                👨‍👧‍👦
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-400 uppercase tracking-wide">Guardian Account</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white break-words font-mono">
                  {formatAddress(state.guardian, 12, 10)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-polkadotPurple to-polkadotPink flex items-center justify-center text-white text-2xl">
                🧒
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-400 uppercase tracking-wide">Child Account</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white break-words font-mono">
                  {formatAddress(state.child, 12, 10)}
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-3" aria-label="Demo controls">
            <div className="lg:col-span-1">
              <GuardianPanel />
            </div>
            <div className="lg:col-span-1 order-last lg:order-none">
              <SimulatePanel />
            </div>
            <div className="lg:col-span-1">
              <RegistryPanel />
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default DemoPage;
