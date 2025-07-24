import { Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CreatorPage from './pages/CreatorPage';
import SubscriberPage from './pages/SubscriberPage.tsx';
import PlanList from './components/PlanList';
import { 
  isBearbyInstalled, 
  isWalletConnected, 
  connectWallet, 
  disconnectWallet, 
  getCurrentAddress 
} from './lib/massa';

// Helper function to format wallet address
const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Function to check and update wallet status
  const checkWalletStatus = async () => {
    try {
      const connected = await isWalletConnected();
      setWalletConnected(connected);
      
      if (connected) {
        const address = await getCurrentAddress();
        setWalletAddress(address);
      } else {
        setWalletAddress(null);
      }
    } catch (error) {
      console.error('Error checking wallet status:', error);
      setWalletConnected(false);
      setWalletAddress(null);
    }
  };

  useEffect(() => {
    // Check wallet status on component mount
    checkWalletStatus();
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      if (!isBearbyInstalled()) {
        alert('Bearby wallet is not installed. Please install it from https://bearby.io/');
        return;
      }

      const connected = await connectWallet();
      if (connected) {
        checkWalletStatus();
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      alert(`Failed to connect wallet: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      checkWalletStatus();
    } catch (error: any) {
      console.error('Failed to disconnect wallet:', error);
      alert(`Failed to disconnect wallet: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Wallet Connection */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                AutoSub
              </Link>
              <span className="ml-2 text-sm text-gray-500">
                On-Chain Subscriptions
              </span>
            </div>
            
            {/* Wallet Connection */}
            <div className="flex items-center space-x-4">
              {walletConnected && walletAddress ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <div className="text-gray-600">Connected:</div>
                    <div className="font-mono text-blue-600">
                      {formatAddress(walletAddress)}
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectWallet}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Bearby Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-12 items-center">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/creator" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Create Plans
            </Link>
            <Link 
              to="/subscriber" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              My Subscriptions
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Wallet Connection Warning */}
        {!walletConnected && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Wallet Connection Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Please connect your Bearby wallet to use AutoSub features. Make sure you have the Bearby browser extension installed.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route 
            path="/" 
            element={
              <div>
                <section className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">On-Chain Subscription Protocol</h2>
                  <p className="text-lg text-gray-600">
                    Create and manage recurring subscriptions on Massa Network. 
                    Fully decentralized, transparent, and automated.
                  </p>
                </section>
                <PlanList />
              </div>
            } 
          />
          <Route path="/creator" element={<CreatorPage />} />
          <Route path="/subscriber" element={<SubscriberPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            AutoSub - Fully On-Chain Subscription Protocol on Massa Network
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
