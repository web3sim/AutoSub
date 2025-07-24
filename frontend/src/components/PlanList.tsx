import React, { useState, useEffect } from 'react';
import { getPlans, subscribeToPlan, isWalletConnected } from '../lib/massa';
import type { SubscriptionPlan } from '../lib/massa';

interface PlanListProps {
  showSubscribeButton?: boolean;
}

// Utility functions for formatting
const formatPrice = (priceInNanoMAS: number): string => {
  const priceInMAS = priceInNanoMAS / 1_000_000_000; // Convert nanoMAS to MAS
  return `${priceInMAS.toFixed(2)} MAS`;
};

const formatDuration = (durationInMs: number): string => {
  const days = Math.floor(durationInMs / (24 * 60 * 60 * 1000));
  if (days >= 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  return `${days} day${days > 1 ? 's' : ''}`;
};

const PlanList: React.FC<PlanListProps> = ({ showSubscribeButton = true }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const planData = await getPlans();
      setPlans(planData.filter(plan => plan.isActive));
      setLoading(false);
    } catch (error) {
      console.error('Error loading plans:', error);
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    try {
      // Check if wallet is connected
      if (!isWalletConnected()) {
        alert('Please connect your wallet first to subscribe to a plan.');
        return;
      }

      setSubscribing(planId);
      
      // Call the real subscription function
      const result = await subscribeToPlan(planId);
      console.log('Subscription result:', result);
      
      alert(`Successfully subscribed to plan ${planId}! Subscription ID: ${result.subscriptionId}`);
      
      // Reload plans to reflect any changes
      await loadPlans();
      
    } catch (error: any) {
      console.error('Error subscribing to plan:', error);
      alert(`Failed to subscribe to plan: ${error.message || 'Unknown error'}`);
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="card text-center">
        <h3>No Subscription Plans Available</h3>
        <p>Check back later for new plans!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Available Subscription Plans</h2>
      <div className="card-grid">
        {plans.map((plan) => (
          <div key={plan.id.toString()} className="card plan-card">
            <div className="plan-header">
              <div className="plan-title">{plan.name || `Plan #${plan.id}`}</div>
              <div className="plan-price">
                {formatPrice(plan.price)}
                <span className="plan-interval">
                  /{formatDuration(plan.duration)}
                </span>
              </div>
            </div>
            
            <div className="plan-details">
              {plan.description && (
                <div className="plan-detail">
                  <strong>Description:</strong>
                  <span>{plan.description}</span>
                </div>
              )}
              <div className="plan-detail">
                <strong>Creator:</strong>
                <span>{plan.creatorAddress.slice(0, 6)}...{plan.creatorAddress.slice(-4)}</span>
              </div>
              <div className="plan-detail">
                <strong>Duration:</strong>
                <span>{formatDuration(plan.duration)}</span>
              </div>
              <div className="plan-detail">
                <strong>Status:</strong>
                <span className={`status ${plan.isActive ? 'status-active' : 'status-inactive'}`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {showSubscribeButton && plan.isActive && (
              <button
                className="btn btn-primary btn-full"
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing === plan.id}
              >
                {subscribing === plan.id ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                    Subscribing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanList;
