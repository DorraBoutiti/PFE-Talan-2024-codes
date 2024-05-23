import torch
from PIL import Image
import io
from torchvision import transforms
import base64

def enhance_image(image_file):
    try:
        image = Image.open(image_file.stream).convert('RGB')
        if image is None:
            raise ValueError("Image file is empty")

        # Load your Real-ESRGAN model here
        model = torch.load('../weight/RealESRGAN_x4.pth', map_location=torch.device('cpu'))
        model.eval()

        transform = transforms.ToTensor()
        input_tensor = transform(image).unsqueeze(0)  # Add batch dimension

        with torch.no_grad():
            enhanced_tensor = model(input_tensor)
        
        enhanced_image = transforms.ToPILImage()(enhanced_tensor.squeeze(0))

        byte_io = io.BytesIO()
        enhanced_image.save(byte_io, 'PNG')
        byte_io.seek(0)

        base64_encoded_image = base64.b64encode(byte_io.getvalue()).decode('utf-8')
        return base64_encoded_image

    except Exception as e:
        raise ValueError("Failed to enhance image") from e
