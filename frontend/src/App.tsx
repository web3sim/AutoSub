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
      console.log('Checking if Bearby is installed...');
      
      if (!isBearbyInstalled()) {
        const message = 'Bearby wallet is not installed. Please install it from the Chrome Web Store and refresh the page.';
        console.error(message);
        alert(message);
        return;
      }

      console.log('Bearby found, attempting to connect...');
      const connected = await connectWallet();
      
      if (connected) {
        console.log('Wallet connected successfully:', connected);
        await checkWalletStatus();
      } else {
        console.warn('Wallet connection returned null');
        alert('Failed to connect wallet. Please try again.');
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      alert(`Failed to connect wallet: ${error.message || 'Unknown error'}`);
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header with Wallet Connection */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <Link to="/" className="logo">
              <h1>AutoSub</h1>
              <div>
                <div className="logo-subtitle">On-Chain Subscriptions</div>
              </div>
            </Link>
          </div>
            
            {/* Wallet Connection */}
            <div className="wallet-section">
              {walletConnected && walletAddress ? (
                <>
                  <div className="wallet-info">
                    <div className="wallet-label">Connected Wallet</div>
                    <div className="wallet-address">
                      {formatAddress(walletAddress)}
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectWallet}
                    className="wallet-btn disconnect"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="wallet-btn"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Bearby Wallet'}
                </button>
              )}
            </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div className="container">
          <div className="nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/creator" className="nav-link">
              Create Plans
            </Link>
            <Link to="/subscriber" className="nav-link">
              My Subscriptions
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {/* Wallet Connection Warning */}
          {!walletConnected && (
            <div className="card" style={{ 
              backgroundColor: '#fef3c7', 
              border: '1px solid #f59e0b', 
              marginBottom: '2rem',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ color: '#f59e0b', marginTop: '0.125rem' }}>
                  ⚠️
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
                    🦊 Wallet Connection Required
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#b45309' }}>
                    <p>Please connect your <strong>Bearby wallet</strong> to use AutoSub features. Make sure you have the Bearby browser extension installed.</p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                      <a href="https://bearby.io" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                        Download Bearby Extension →
                      </a>
                    </p>
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
                  <section className="hero">
                    <h2>On-Chain Subscription Protocol</h2>
                    <p>
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
        </div>
      </main>      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center' }}>
              © 2024 AutoSub - Decentralized Subscription Platform
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ height: '8px', width: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                Built on Massa
              </span>
              <span style={{ fontSize: '0.75rem' }}>
                {walletConnected ? '🔗 Connected' : '⚠️ Not Connected'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
