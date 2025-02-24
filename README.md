Customer Purchase Prediction Model
📌 Project Overview
This project aims to predict the probability of a customer purchasing specific products based on their transaction history, spending behavior, and demographic details. Instead of using a pivot matrix, we train a multi-label classification model directly on customer features to generate personalized product recommendations and targeted ads.

📂 Project Structure
bash
Copy
Edit

🛠️ Installation & Setup
1️⃣ Clone the Repository:

bash
Copy
Edit
git clone https://github.com/yourusername/Customer-Purchase-Prediction.git
cd Customer-Purchase-Prediction
2️⃣ Install Dependencies:

bash
Copy
Edit
pip install -r requirements.txt
3️⃣ Run Training Script:

bash
Copy
Edit
python train_model.py
4️⃣ Make Predictions:

bash
Copy
Edit
python predict.py
🔍 Data Preprocessing
Feature Engineering:
total_orders: Total orders per customer
total_spent: Total amount spent
avg_order_value: Average transaction amount
return_rate: Percentage of returned products
product_diversity: Number of unique product categories bought
Target Labels (Y): Multi-label classification where each product purchase is a separate binary output.
🤖 Model Training
Uses Random Forest Classifier wrapped in MultiOutputClassifier for multi-label classification.
train_test_split() used to split 80% training, 20% testing.
The trained model is saved as models/trained_model.pkl for future use.
🎯 Prediction & Recommendations
Given a customer’s spending history and behavior, the model predicts the probability of purchasing each product.
Customers with higher probability (>70%) for a product are shown ads for that product.
The prediction script (predict.py) generates personalized recommendations.
🚀 API Deployment (Optional)
To serve predictions as an API using FastAPI, run:

bash
Copy
Edit
uvicorn app:app --reload
Then access it via:

http
Copy
Edit
http://127.0.0.1:8000/predict?customer_id=AA-10480
📌 Future Improvements
✅ Use Deep Learning models (Neural Networks, Transformers) for better accuracy.
✅ Implement real-time data ingestion for live predictions.
✅ Optimize recommendations using collaborative filtering techniques.

📜 License
This project is licensed under the MIT License.



--------------------------------------------------------------------------



# Printer Purchase Prediction - Impact Analysis Documentation

## Overview
This document explains how the prediction model analyzes and calculates the impact of each parameter on the final prediction result.

## Parameter Weights
Each parameter has an assigned weight that determines its importance in the prediction:

```javascript
const weights = {
  total_orders: 0.15,        // 15% impact
  total_spent: 0.20,         // 20% impact
  printer_purchases_last_6m: 0.25,  // 25% impact (highest weight)
  return_rate: -0.15,        // 15% negative impact
  average_order_value: 0.10, // 10% impact
  product_diversity: 0.10,   // 10% impact
  region: 0.025,            // 2.5% impact
  high_value_customer: 0.025 // 2.5% impact
}
```

## Baseline Values
The system compares input values against these baseline values:

```javascript
const baselines = {
  total_orders: 5,
  total_spent: 250,
  printer_purchases_last_6m: 0,
  return_rate: 0.05,
  average_order_value: 50,
  product_diversity: 2,
  region: '1',
  high_value_customer: '0'
}
```

## How Impact is Calculated

### 1. Numerical Parameters
For parameters like total_orders, total_spent, etc.:
- Impact = (Current Value - Baseline Value) × Weight
- Example: If total_orders = 10
  - Impact = (10 - 5) × 0.15 = 0.75 (positive impact)

### 2. Return Rate (Special Case)
- Impact is calculated inversely because lower return rates are better
- Impact = (Baseline Value - Current Value) × Weight
- Example: If return_rate = 0.03
  - Impact = (0.05 - 0.03) × 0.15 = 0.003 (positive impact)

### 3. Categorical Parameters (region, high_value_customer)
- Impact is binary (either matches baseline or doesn't)
- Impact = Weight (if different from baseline)
- Example: If region changes from '1' to '2'
  - Impact = 0.025 (full weight applied)

## Impact Direction
The system classifies impact into three categories:
1. Positive (> 0): Parameter increases likelihood of purchase
2. Negative (< 0): Parameter decreases likelihood of purchase
3. Neutral (= 0): Parameter has no effect

## Visual Indicators
In the UI, impacts are shown with:
- 🔼 Green arrow up: Positive impact
- 🔽 Red arrow down: Negative impact
- ➖ Gray dash: Neutral impact

## Example Impact Analysis

Consider this input:
```javascript
{
  total_orders: 10,          // Higher than baseline (positive)
  total_spent: 500,         // Higher than baseline (positive)
  printer_purchases_last_6m: 1,  // Higher than baseline (positive)
  return_rate: 0.03,        // Lower than baseline (positive)
  average_order_value: 75,  // Higher than baseline (positive)
  product_diversity: 4,     // Higher than baseline (positive)
  region: '2',              // Different from baseline (impact applied)
  high_value_customer: '1'  // Different from baseline (impact applied)
}
```

Impact Calculation:
1. total_orders: (10 - 5) × 0.15 = +0.75
2. total_spent: (500 - 250) × 0.20 = +50.0
3. printer_purchases: (1 - 0) × 0.25 = +0.25
4. return_rate: (0.05 - 0.03) × -0.15 = +0.003
5. avg_order_value: (75 - 50) × 0.10 = +2.5
6. product_diversity: (4 - 2) × 0.10 = +0.2
7. region: 0.025 (different from baseline)
8. high_value_customer: 0.025 (different from baseline)

## Understanding the History View

The history view shows:
1. Parameter values at prediction time
2. Impact score for each parameter
3. Visual indicators showing positive/negative impact
4. Overall confidence score
5. Final prediction result

## Tips for Optimal Predictions

1. High Impact Parameters:
   - printer_purchases_last_6m (25% weight)
   - total_spent (20% weight)
   - total_orders (15% weight)

2. Negative Factors:
   - High return_rate decreases purchase likelihood
   - Low product_diversity may indicate limited interest

3. Positive Indicators:
   - Recent printer purchases
   - High total spent
   - Low return rate
   - High product diversity

## Code Implementation

The impact calculation is implemented in the `calculateParameterImpact` function:

```javascript
const calculateParameterImpact = (data) => {
  let impacts = {};
  
  Object.keys(weights).forEach(param => {
    let impact = 0;
    
    if (param === 'return_rate') {
      // Lower is better for return rate
      impact = (baselines[param] - data[param]) * weights[param];
    } else if (param === 'region' || param === 'high_value_customer') {
      // Categorical variables
      impact = data[param] === baselines[param] ? 0 : weights[param];
    } else {
      // Higher is better for other parameters
      impact = (data[param] - baselines[param]) * weights[param];
    }
    
    impacts[param] = {
      value: impact,
      direction: impact > 0 ? 'positive' : impact < 0 ? 'negative' : 'neutral'
    };
  });

  return impacts;
};
```

This impact analysis is used throughout the application to:
1. Show real-time parameter effects
2. Store historical impact data
3. Generate analytics
4. Help users understand prediction results