from flask import Flask, request, jsonify
import torch
from PIL import Image
import io
from torchvision import transforms
import base64
import os
from Generator import Generator
from Transform import Transform

# Function to load the model
def load_model(model_path):
    """
    Load the model from the specified path and return it in evaluation mode.

    Args:
        model_path (str): The path to the model file.

    Returns:
        torch.nn.Module: The loaded model.

    Raises:
        FileNotFoundError: If the model file does not exist.
        RuntimeError: If there is an error loading the model.
    """
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file '{model_path}' does not exist.")

    model = Generator()
    try:
        model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
        model.eval()
    except RuntimeError as e:
        raise RuntimeError(f"Error loading model from '{model_path}': {e}")

    return model

# Load the trained model
model_path = 'weight/G101.pth'
trained_model = load_model(model_path)


def text_guided_enhance(image_file):
    try:
        image = Image.open(image_file.stream).convert('RGB')
        if image is None:
            raise ValueError("Image file is empty")
    except Exception as e:
        raise ValueError("Failed to open image file") from e
    
    original_size = image.size  # Store the original dimensions

    # Preprocess the image
    transform = Transform()
    input_tensor = transform(image).unsqueeze(0)  # Add batch dimension

    # Perform the enhancement
    with torch.no_grad():
        enhanced_tensor = trained_model(input_tensor)
    
    # Convert tensor to PIL image
    enhanced_image = transforms.ToPILImage()(enhanced_tensor.squeeze(0))

    # Resize the enhanced image back to the original size
    enhanced_image = enhanced_image.resize(original_size)

    # Save the enhanced image to a byte stream
    byte_io = io.BytesIO()
    enhanced_image.save(byte_io, 'PNG')
    byte_io.seek(0)

    # Encode the byte stream to a base64 string
    base64_encoded_image = base64.b64encode(byte_io.getvalue()).decode('utf-8')

    return jsonify({"enhanced_image": base64_encoded_image})

