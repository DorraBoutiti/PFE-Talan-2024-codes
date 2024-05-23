from PIL import Image
import io
import base64
import cv2
import numpy as np

def crop_image(image_file=None, image_base64=None):
    try:
        if image_file:
            image = Image.open(image_file).convert('RGB')
        elif image_base64:
            try:
                image_data = base64.b64decode(image_base64)
            except base64.binascii.Error:
                raise ValueError("Invalid base64 string")
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
        else:
            raise ValueError("No image data provided")

        # Convert PIL image to numpy array
        image_np = np.array(image)

        # Convert to grayscale
        gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)

        # Apply threshold to get a binary image
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # Find contours
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        if not contours:
            raise ValueError("No contours found")

        # Get the largest contour which is assumed to be the document
        largest_contour = max(contours, key=cv2.contourArea)

        # Get bounding box for the largest contour
        x, y, w, h = cv2.boundingRect(largest_contour)

        if x < 0 or y < 0 or w <= 0 or h <= 0:
            raise ValueError("Invalid coordinates")

        # Crop the image using the bounding box
        cropped_image_np = image_np[y:y+h, x:x+w]

        # Convert cropped numpy array back to PIL image
        cropped_image = Image.fromarray(cropped_image_np)

        # Save cropped image to byte stream
        byte_io = io.BytesIO()
        cropped_image.save(byte_io, 'PNG')
        byte_io.seek(0)

        # Encode the byte stream to a base64 string
        base64_encoded_image = base64.b64encode(byte_io.getvalue()).decode('utf-8')
        return base64_encoded_image

    except Exception as e:
        raise ValueError(f"Failed to crop image: {str(e)}")
