import React, { useState, useEffect } from 'react';
import { 
  mockSubscriptions, 
  mockPlans, 
  formatPrice, 
  formatDate, 
  getTimeUntilPayment,
  getMockPlan 
} from '../lib/mock';
import type { Subscription } from '../lib/mock';

// Use mockPlans for display
console.log('Available plans:', mockPlans);

// TODO: Replace with actual contract calls
// import { getSubscriptionsByUser, cancelSubscription } from '../lib/massa';

const SubscriberPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<bigint | null>(null);

  // Mock user address - in real app, get from wallet connection
  const userAddress = '0x4567890123456789012345678901234567890123';

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual contract calls
      // const userSubs = await getSubscriptionsByUser(userAddress);
      // setSubscriptions(userSubs);
      
      // For now, use mock data
      setTimeout(() => {
        const userSubs = mockSubscriptions.filter(
          sub => sub.subscriber === userAddress
        );
        setSubscriptions(userSubs);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subId: bigint) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      setCancelling(subId);
      
      // TODO: Replace with actual contract call
      // await cancelSubscription(subId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subId ? { ...sub, isActive: false } : sub
        )
      );
      
      alert('Subscription cancelled successfully');
      
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="hero">
        <h2>My Subscriptions</h2>
        <p>Manage your active and past subscriptions.</p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="card text-center">
          <h3>No Subscriptions Found</h3>
          <p>You haven't subscribed to any plans yet.</p>
          <a href="/" className="btn btn-primary">
            Browse Available Plans
          </a>
        </div>
      ) : (
        <div className="card-grid">
          {subscriptions.map((subscription) => {
            const plan = getMockPlan(subscription.planId);
            if (!plan) return null;

            return (
              <div key={subscription.id.toString()} className="card">
                <div className="plan-header">
                  <div className="plan-title">
                    Plan #{plan.id.toString()}
                  </div>
                  <div className="plan-price">
                    {formatPrice(plan.price, plan.token)}
                    <span className="plan-interval">
                      /billing cycle
                    </span>
                  </div>
                </div>

                <div className="plan-details">
                  <div className="plan-detail">
                    <strong>Status:</strong>
                    <span className={`status ${subscription.isActive ? 'status-active' : 'status-inactive'}`}>
                      {subscription.isActive ? 'Active' : 'Cancelled'}
                    </span>
                  </div>
                  
                  <div className="plan-detail">
                    <strong>Created:</strong>
                    <span>{formatDate(subscription.createdAt)}</span>
                  </div>
                  
                  <div className="plan-detail">
                    <strong>Payments Made:</strong>
                    <span>{subscription.paymentCount.toString()}</span>
                  </div>
                  
                  {subscription.isActive && (
                    <div className="plan-detail">
                      <strong>Next Payment:</strong>
                      <span>{getTimeUntilPayment(subscription.nextPaymentTime)}</span>
                    </div>
                  )}
                  
                  <div className="plan-detail">
                    <strong>Creator:</strong>
                    <span>
                      {plan.creator.slice(0, 6)}...{plan.creator.slice(-4)}
                    </span>
                  </div>
                </div>

                {subscription.isActive && (
                  <button
                    className="btn btn-danger btn-full"
                    onClick={() => handleCancelSubscription(subscription.id)}
                    disabled={cancelling === subscription.id}
                  >
                    {cancelling === subscription.id ? (
                      <>
                        <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                        Cancelling...
                      </>
                    ) : (
                      'Cancel Subscription'
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Subscription Management</h3>
        <div style={{ lineHeight: '1.6', color: '#64748b' }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Active Subscriptions:</strong> Payments are automatically processed according to the billing schedule.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Cancellation:</strong> You can cancel your subscription at any time. No future payments will be processed.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Payment History:</strong> All payments are recorded on-chain and can be verified on the blockchain.
          </p>
          <p>
            <strong>Refunds:</strong> Cancellation does not include refunds for already processed payments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriberPage;
