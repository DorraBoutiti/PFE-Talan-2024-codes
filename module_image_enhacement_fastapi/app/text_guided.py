import torch
from PIL import Image
import io
from torchvision import transforms
import base64
import os
from .Generator import Generator
from .Transform import Transform
from fastapi.responses import JSONResponse

def load_model(model_path: str) -> torch.nn.Module:
    """
    Charge le modèle depuis le chemin spécifié et le retourne en mode évaluation.

    Args:
        model_path (str): Chemin vers le fichier du modèle.

    Returns:
        torch.nn.Module: Le modèle chargé.

    Raises:
        FileNotFoundError: Si le fichier du modèle n'existe pas.
        RuntimeError: En cas d'erreur lors du chargement du modèle.
    """
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Le fichier du modèle '{model_path}' n'existe pas.")

    model = Generator()
    try:
        model.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
        model.eval()
    except RuntimeError as e:
        raise RuntimeError(
            f"Erreur lors du chargement du modèle depuis '{model_path}': {e}"
        )

    return model


# Charger le modèle entraîné
model_path = "weight/G101.pth"
trained_model = load_model(model_path)
def text_guided_enhance(image_file) -> JSONResponse:
    """
    Améliore une image en utilisant un modèle de deep learning et retourne l'image améliorée encodée en base64.

    Args:
        image_file: Fichier image à améliorer.

    Returns:
        JSONResponse: JSON contenant l'image améliorée encodée en base64.

    Raises:
        ValueError: Si l'image ne peut pas être ouverte ou est vide.
    """
    try:
        image = Image.open(image_file.stream).convert("RGB")
    except Exception as e:
        raise ValueError("Échec de l'ouverture du fichier image") from e

    original_size = image.size  # Stocker les dimensions originales

    # Prétraiter l'image
    transform = Transform()
    input_tensor = transform(image).unsqueeze(0)  # Ajouter la dimension de batch

    # Effectuer l'amélioration
    with torch.no_grad():
        enhanced_tensor = trained_model(input_tensor)

    # Convertir le tenseur en image PIL
    enhanced_image = transforms.ToPILImage()(enhanced_tensor.squeeze(0))

    # Redimensionner l'image améliorée aux dimensions originales
    enhanced_image = enhanced_image.resize(original_size)

    # Sauvegarder l'image améliorée dans un flux de bytes
    byte_io = io.BytesIO()
    enhanced_image.save(byte_io, "PNG")
    byte_io.seek(0)

    # Encoder le flux de bytes en chaîne base64
    base64_encoded_image = base64.b64encode(byte_io.getvalue()).decode("utf-8")

    return JSONResponse({"enhanced_image": base64_encoded_image})
