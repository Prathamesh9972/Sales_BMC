import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  CheckCircle, 
  AlertCircle, 
  History, 
  BarChart, 
  RefreshCw, 
  Info,
  TrendingUp,
  Users,
  DollarSign,
  Package
} from 'lucide-react';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    total_orders: 10,
    total_spent: 500.0,
    printer_purchases_last_6m: 1,
    return_rate: 0.1,
    average_order_value: 50.0,
    product_diversity: 5,
    region: '1',
    high_value_customer: '0'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('form');
  const [showTooltip, setShowTooltip] = useState(null);

  // Calculate average order value whenever total_orders or total_spent changes
  useEffect(() => {
    if (formData.total_orders > 0) {
      const avgOrderValue = formData.total_spent / formData.total_orders;
      setFormData(prev => ({
        ...prev,
        average_order_value: Math.round(avgOrderValue * 100) / 100
      }));
    }
  }, [formData.total_orders, formData.total_spent]);

  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    // Convert to number for numeric fields
    if (e.target.type === 'number') {
      value = value === '' ? '' : Math.max(0, parseInt(value, 10));
    }

    // Special handling for return rate (0-1)
    if (name === 'return_rate') {
      value = Math.min(1, Math.max(0, parseFloat(value) || 0));
      value = Math.round(value * 100) / 100; // Round to 2 decimal places
    }

    // Ensure product diversity doesn't exceed total orders
    if (name === 'product_diversity') {
      value = Math.min(value, formData.total_orders);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '58f8aa7261e0bcfb1ab85c9b5e124a7bab8a0cc80fca9aeb8d148fcbb0f2ca55'
        },
        body: JSON.stringify({
          ...formData,
          high_value_customer: parseInt(formData.high_value_customer),
          region: parseInt(formData.region)
        })
      });
      
      const data = await response.json();
      setResult(data);
      setHistory([...history, { ...formData, result: data, timestamp: new Date() }]);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      total_orders: 0,
      total_spent: 0,
      printer_purchases_last_6m: 0,
      return_rate: 0,
      average_order_value: 0,
      product_diversity: 0,
      region: '0',
      high_value_customer: '0'
    });
    setResult(null);
  };

  const regions = [
    { value: '0', label: 'Central Region' },
    { value: '1', label: 'East Region' },
    { value: '2', label: 'West Region' },
    { value: '3', label: 'South Region' }
  ];

  const getRegionLabel = (value) => {
    const region = regions.find(r => r.value === value);
    return region ? region.label : 'Unknown Region';
  };

  const formFields = [
    { 
      name: 'total_orders', 
      label: 'Total Orders', 
      type: 'number',
      min: 0,
      tooltip: 'Total number of orders placed by the customer (whole number)',
      icon: Package
    },
    { 
      name: 'total_spent', 
      label: 'Total Spent ($)', 
      type: 'number',
      min: 0,
      tooltip: 'Total amount spent by the customer in USD (whole number)',
      icon: DollarSign
    },
    { 
      name: 'printer_purchases_last_6m', 
      label: 'Recent Printer Purchases', 
      type: 'number',
      min: 0,
      tooltip: 'Number of printers purchased in the last 6 months (whole number)',
      icon: Printer
    },
    { 
      name: 'return_rate', 
      label: 'Return Rate', 
      type: 'number',
      min: 0,
      max: 1,
      step: '0.01',
      tooltip: 'Percentage of items returned (between 0 and 1, e.g., 0.5 = 50%)',
      icon: RefreshCw,
      className: formData.return_rate > 1 || formData.return_rate < 0 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
        : ''
    },
    { 
      name: 'average_order_value', 
      label: 'Average Order Value ($)', 
      type: 'number',
      disabled: true,
      tooltip: 'Auto-calculated: Total Spent / Total Orders',
      icon: TrendingUp
    },
    { 
      name: 'product_diversity', 
      label: 'Product Diversity', 
      type: 'number',
      min: 0,
      tooltip: 'Number of different product categories purchased (cannot exceed total orders)',
      icon: Package
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Printer className="h-8 w-8" />
                    Printer Purchase Predictor
                </h1>
                <p className="text-indigo-100 mt-2 text-lg">
                  Advanced machine learning model for predicting customer purchase behavior
                </p>
              </div>
            </div>
          </div>

          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                activeTab === 'form'
                  ? 'bg-white border-t-2 border-indigo-500 text-indigo-600 shadow'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              Prediction Form
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-white border-t-2 border-indigo-500 text-indigo-600 shadow'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <History className="h-4 w-4" />
              History
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-white border-t-2 border-indigo-500 text-indigo-600 shadow'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart className="h-4 w-4" />
              Analytics
            </button>
          </div>
          
          <div className="p-8">
            {activeTab === 'form' && (
              <div className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {formFields.map((field) => (
                      <div key={field.name} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg -m-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <div className="relative space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <field.icon className="h-4 w-4 text-indigo-500" />
                            {field.label}
                            <div className="relative">
                              <Info
                                className="h-4 w-4 text-gray-400 cursor-help"
                                onMouseEnter={() => setShowTooltip(field.name)}
                                onMouseLeave={() => setShowTooltip(null)}
                              />
                              {showTooltip === field.name && (
                                <div className="absolute z-10 w-48 px-3 py-2 -mt-1 text-sm text-white bg-gray-900 rounded-lg shadow-lg">
                                  {field.tooltip}
                                </div>
                              )}
                            </div>
                          </label>
                          <div className="relative">
                            <input
                              type={field.type}
                              name={field.name}
                              min={field.min}
                              max={field.max}
                              step={field.step}
                              disabled={field.disabled}
                              value={formData[field.name]}
                              onChange={handleChange}
                              className={`block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-200 ease-in-out hover:border-gray-400 disabled:bg-gray-50 disabled:text-gray-500 ${field.className || ''}`}
                            />
                            {field.name === 'return_rate' && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                {(formData.return_rate * 100).toFixed(0)}%
                              </div>
                            )}
                          </div>
                          {field.name === 'return_rate' && (
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={formData.return_rate}
                              onChange={(e) => handleChange({ target: { name: 'return_rate', value: e.target.value } })}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Region Dropdown */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg -m-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <div className="relative space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Users className="h-4 w-4 text-indigo-500" />
                          Region
                          <div className="relative">
                            <Info
                              className="h-4 w-4 text-gray-400 cursor-help"
                              onMouseEnter={() => setShowTooltip('region')}
                              onMouseLeave={() => setShowTooltip(null)}
                            />
                            {showTooltip === 'region' && (
                              <div className="absolute z-10 w-48 px-3 py-2 -mt-1 text-sm text-white bg-gray-900 rounded-lg shadow-lg">
                                Select the geographical region of the customer
                              </div>
                            )}
                          </div>
                        </label>
                        <select
                          name="region"
                          value={formData.region}
                          onChange={handleChange}
                          className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-200 ease-in-out hover:border-gray-400"
                        >
                          {regions.map(region => (
                            <option key={region.value} value={region.value}>
                              {region.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* High Value Customer Toggle */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg -m-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <div className="relative space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Users className="h-4 w-4 text-indigo-500" />
                          High Value Customer
                        </label>
                        <select
                          name="high_value_customer"
                          value={formData.high_value_customer}
                          onChange={handleChange}
                          className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-200 ease-in-out hover:border-gray-400"
                        >
                          <option value="0">No</option>
                          <option value="1">Yes</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-medium rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
                    >
                      {loading ? 'Processing...' : 'Generate Prediction'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-8 py-4 bg-white text-gray-700 text-lg font-medium rounded-lg shadow-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Reset
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                  </div>
                )}

                {result && (
                  <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 border border-indigo-100">
                    <h2 className="text-2xl font-semibold text-indigo-900 flex items-center gap-2 mb-6">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      Prediction Results
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-lg border border-indigo-50">
                        <div className="text-sm text-gray-500 mb-1">Prediction</div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {result.prediction === 1 ? 'Likely to Purchase' : 'Unlikely to Purchase'}
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-lg border border-indigo-50">
                        <div className="text-sm text-gray-500 mb-1">Confidence</div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {(result.probability * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">Prediction History</h2>
                  <span className="text-sm text-gray-500">{history.length} predictions made</span>
                </div>
                {history.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No predictions made yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((entry, index) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-sm text-gray-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                          <div className={`px-4 py-1 rounded-full text-sm font-medium ${
                            entry.result.prediction === 1 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.result.prediction === 1 ? 'Likely' : 'Unlikely'}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="block text-gray-500">Orders</span>
                            <span className="font-medium">{entry.total_orders}</span>
                          </div>
                          <div>
                            <span className="block text-gray-500">Total Spent</span>
                            <span className="font-medium">${entry.total_spent}</span>
                          </div>
                          <div>
                            <span className="block text-gray-500">Confidence</span>
                            <span className="font-medium">{(entry.result.probability * 100).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="block text-gray-500">Region</span>
                            <span className="font-medium">{getRegionLabel(entry.region)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h2>
                {history.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Make some predictions to see analytics</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg shadow-md border border-indigo-100">
                        <div className="text-lg font-medium text-gray-900 mb-2">Success Rate</div>
                        <div className="text-3xl font-bold text-indigo-600">
                          {((history.filter(h => h.result.prediction === 1).length / history.length) * 100).toFixed(1)}%
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Likely purchase predictions</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg shadow-md border border-indigo-100">
                        <div className="text-lg font-medium text-gray-900 mb-2">Average Confidence</div>
                        <div className="text-3xl font-bold text-indigo-600">
                          {(history.reduce((acc, curr) => acc + curr.result.probability, 0) / history.length * 100).toFixed(1)}%
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Mean prediction confidence</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg shadow-md border border-indigo-100">
                        <div className="text-lg font-medium text-gray-900 mb-2">Total Predictions</div>
                        <div className="text-3xl font-bold text-indigo-600">
                          {history.length}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Predictions made so far</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        {history.slice(-5).reverse().map((entry, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                entry.result.prediction === 1 
                                  ? 'bg-green-500' 
                                  : 'bg-red-500'
                              }`} />
                              <span className="text-gray-600">
                                {new Date(entry.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-500">
                                Confidence: {(entry.result.probability * 100).toFixed(1)}%
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entry.result.prediction === 1 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {entry.result.prediction === 1 ? 'Likely' : 'Unlikely'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;