@app.route('/chatbot/message', methods=['POST'])
def chatbot1_endpoint():
    # Logic to handle requests and responses for chatbot1
    return jsonify(response_data)

@app.route('/rag/message', methods=['POST'])
def chatbot2_endpoint():
    # Logic to handle requests and responses for chatbot2
    return jsonify(response_data)

# Define routes for other chatbots similarly
