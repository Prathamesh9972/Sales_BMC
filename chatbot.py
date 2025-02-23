import gradio as gr
import joblib
import pandas as pd

# ✅ Load the trained model
model_path = "BMC/xgboost_model.pkl"
multi_target_model = joblib.load(model_path)

# ✅ Load customer data for recommendations
customers = pd.read_json("BMC/merged_data.json")  # Adjust format if using JSON
model_accuracy = 0.78  # Example accuracy, replace with actual

# ✅ Define chatbot response function
def chatbot_response(user_input):
    user_input = user_input.lower()

    # 🔹 Respond to accuracy-related queries
    if "accuracy" in user_input or "model performance" in user_input:
        return f"🎯 The model achieved an accuracy of {model_accuracy:.2f}."

    # 🔹 Predict customer recommendations
    elif "recommend" in user_input or "prediction" in user_input:
        return "Provide a Customer ID to get predictions. Example: 'Predict for AA-10480'"

    # 🔹 Handle specific customer predictions
    elif "predict for" in user_input:
        customer_id = user_input.split()[-1]  # Extract ID from query
        if customer_id in customers["Customer ID"].values:
            customer_features = customers[customers["Customer ID"] == customer_id].drop("Customer ID", axis=1)
            predictions = multi_target_model.predict(customer_features)
            return f"📌 Predicted product purchases for {customer_id}: {predictions}"
        else:
            return "⚠️ Customer ID not found. Please enter a valid one."

    # 🔹 Handle unknown queries
    else:
        return "🤖 I can answer questions about model performance and predictions! Try asking: 'What is the model accuracy?' or 'Predict for AA-10480'."

# ✅ Create a Gradio Chatbot Interface
chatbot = gr.Interface(
    fn=chatbot_response,
    inputs=gr.Textbox(lines=2, placeholder="Ask me about model accuracy, predictions, etc."),
    outputs="text",
    title="🛒 Customer Purchase Prediction Chatbot",
    description="Ask me about model accuracy, customer recommendations, and purchase predictions.",
)

# ✅ Run the chatbot
if __name__ == "__main__":
    chatbot.launch()
