import React, { useState, useEffect } from 'react';
import { mockPlans, formatPrice, formatInterval } from '../lib/mock';
import type { Plan } from '../lib/mock';

// TODO: Replace with actual contract calls
// import { getPlanCount, getPlan, subscribe } from '../lib/massa';

interface PlanListProps {
  showSubscribeButton?: boolean;
}

const PlanList: React.FC<PlanListProps> = ({ showSubscribeButton = true }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<bigint | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual contract calls
      // const planCount = await getPlanCount();
      // const planPromises = [];
      // for (let i = 1n; i <= planCount; i++) {
      //   planPromises.push(getPlan(i));
      // }
      // const planData = await Promise.all(planPromises);
      // setPlans(planData.filter(plan => plan.isActive));
      
      // For now, use mock data
      setTimeout(() => {
        setPlans(mockPlans.filter(plan => plan.isActive));
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error loading plans:', error);
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: bigint) => {
    try {
      setSubscribing(planId);
      
      // TODO: Replace with actual contract call
      // await subscribe(planId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully subscribed to plan ${planId}!`);
      
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      alert('Failed to subscribe to plan. Please try again.');
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
      <div className="text-center p-4">
        <h3>No subscription plans available</h3>
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
              <div className="plan-title">Plan #{plan.id.toString()}</div>
              <div className="plan-price">
                {formatPrice(plan.price, plan.token)}
                <span className="plan-interval">
                  /{formatInterval(plan.interval)}
                </span>
              </div>
            </div>
            
            <div className="plan-details">
              <div className="plan-detail">
                <strong>Creator:</strong>
                <span>{plan.creator.slice(0, 6)}...{plan.creator.slice(-4)}</span>
              </div>
              <div className="plan-detail">
                <strong>Token:</strong>
                <span>{plan.token}</span>
              </div>
              <div className="plan-detail">
                <strong>Billing:</strong>
                <span>Every {formatInterval(plan.interval)}</span>
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
                  'Subscribe'
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
