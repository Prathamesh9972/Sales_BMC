Customer Purchase Prediction Model
📌 Project Overview
This project aims to predict the probability of a customer purchasing specific products based on their transaction history, spending behavior, and demographic details. Instead of using a pivot matrix, we train a multi-label classification model directly on customer features to generate personalized product recommendations and targeted ads.

📂 Project Structure
bash
Copy
Edit
📁 Customer-Purchase-Prediction  
│── 📜 README.md                  # Project documentation  
│── 📜 requirements.txt            # Required dependencies  
│── 📜 train_model.py              # Model training script  
│── 📜 predict.py                  # Generate predictions for customers  
│── 📜 app.py                       # API for real-time recommendations  
│── 📂 data/  
│    ├── customers_info.json       # Customer details  
│    ├── customer_transaction_info.json  # Order history  
│    ├── product_info.json         # Product catalog  
│    ├── orders_returned_info.json # Returned orders  
│    ├── region_seller_info.json   # Regional data  
│── 📂 models/  
│    ├── trained_model.pkl         # Saved trained model  
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

