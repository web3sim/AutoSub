import React, { useState } from 'react';
import { createPlan, timeToMilliseconds } from '../lib/massa';

const CreatorPage: React.FC = () => {
  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    price: '',
    intervalValue: '',
    intervalUnit: 'days',
    token: 'MAS',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const intervalUnits = [
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.price || !formData.intervalValue) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setSuccess(false);

      // Convert price to smallest unit (assuming 6 decimals for MAS)
      const priceInSmallestUnit = BigInt(Math.floor(parseFloat(formData.price) * 1_000_000));
      
      // Convert interval to milliseconds
      const intervalMs = timeToMilliseconds(
        parseInt(formData.intervalValue),
        formData.intervalUnit
      );

      // Create the plan using the real Web3 function
      const planId = await createPlan(
        formData.planName || 'Unnamed Plan',
        formData.description || 'No description provided',
        Number(priceInSmallestUnit), // Convert bigint to number
        intervalMs
      );
      
      console.log('Plan created with ID:', planId);
      
      setSuccess(true);
      setFormData({
        planName: '',
        description: '',
        price: '',
        intervalValue: '',
        intervalUnit: 'days',
        token: 'MAS',
      });

      alert(`Plan created successfully! Transaction: ${planId}`);
      
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="hero">
        <h2>Create Subscription Plan</h2>
        <p>Set up a new recurring payment plan for your services or products.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          {success && (
            <div 
              className="mb-4 p-4" 
              style={{ 
                backgroundColor: '#dcfce7', 
                color: '#166534', 
                borderRadius: '4px',
                textAlign: 'center' 
              }}
            >
              Plan created successfully! Your plan is now live and available for subscriptions.
            </div>
          )}

          <div className="form-group">
            <label htmlFor="planName" className="form-label">
              Plan Name *
            </label>
            <input
              type="text"
              id="planName"
              name="planName"
              value={formData.planName}
              onChange={handleInputChange}
              placeholder="e.g., Premium Subscription"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              placeholder="Describe what subscribers will get..."
              className="form-input"
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price per billing cycle *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="1.0"
              step="0.000001"
              min="0"
              className="form-input"
              required
            />
            <small className="mt-1" style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Enter the price in {formData.token} tokens
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">
              Billing Interval *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                name="intervalValue"
                value={formData.intervalValue}
                onChange={handleInputChange}
                placeholder="1"
                min="1"
                className="form-input"
                style={{ flex: '1' }}
                required
              />
              <select
                name="intervalUnit"
                value={formData.intervalUnit}
                onChange={handleInputChange}
                className="form-input"
                style={{ flex: '1' }}
                required
              >
                {intervalUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            <small className="mt-1" style={{ color: '#64748b', fontSize: '0.875rem' }}>
              How often subscribers will be charged
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="token" className="form-label">
              Payment Token *
            </label>
            <select
              id="token"
              name="token"
              value={formData.token}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="MAS">MAS (Native Token)</option>
              <option value="" disabled>
                Other tokens (coming soon)
              </option>
            </select>
            <small className="mt-1" style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Currently only MAS token is supported
            </small>
          </div>

          <div className="form-group">
            <div className="card" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Plan Preview</h4>
              <div className="plan-detail">
                <strong>Price:</strong>
                <span>
                  {formData.price || '0'} {formData.token}
                </span>
              </div>
              <div className="plan-detail">
                <strong>Billing:</strong>
                <span>
                  Every {formData.intervalValue || '1'} {formData.intervalUnit}
                </span>
              </div>
              <div className="plan-detail">
                <strong>Token:</strong>
                <span>{formData.token}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                Creating Plan...
              </>
            ) : (
              'Create Plan'
            )}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>How It Works</h3>
        <div style={{ lineHeight: '1.6', color: '#64748b' }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong>1. Create Your Plan:</strong> Set your price, billing interval, and payment token.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>2. Share Your Plan:</strong> Users can discover and subscribe to your plan.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>3. Automatic Payments:</strong> Massa's deferred calls handle recurring payments automatically.
          </p>
          <p>
            <strong>4. Manage Subscriptions:</strong> View and manage all your plan subscriptions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatorPage;
