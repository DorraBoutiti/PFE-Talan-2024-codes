from PIL import Image
from torchvision import transforms 

MEAN = (0.5, 0.5, 0.5)
STD = (0.5, 0.5, 0.5)

class Transform:
    def __init__(self, mean=MEAN, std=STD):
        self.data_transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize(mean, std)
        ])
        
    def __call__(self, img: Image.Image):
        return self.data_transform(img)
