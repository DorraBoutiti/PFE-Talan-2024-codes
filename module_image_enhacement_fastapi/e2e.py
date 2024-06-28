import pytest
from fastapi.testclient import TestClient
from main import app  

client = TestClient(app)


# Helper function to create base64 encoded image
def create_base64_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


@pytest.mark.parametrize(
    "endpoint",
    [
        "/",
        "/crop/image",
        "/crop/base64",
        "/rotate/image",
        "/rotate/base64",
        "/enhance/base64",
        "/text-guided-enhance",
        "/process-image",
    ],
)
def test_get_root(endpoint):
    response = client.get(endpoint)
    assert response.status_code == 200
    assert response.json() == {"message": "Hello from Module"}


def test_crop_image_file_valid():
    image_path = "testDocs\performance_chart_100_20.png"  # Replace with actual image path
    with open(image_path, "rb") as image_file:
        response = client.post(
            "/crop/image", files={"image": ("filename", image_file, "image/jpeg")}
        )
    assert response.status_code == 200
    assert "cropped_image" in response.json()


def test_crop_image_file_invalid_format():
    with open("testDocs\test_file.txt", "rb") as image_file:
        response = client.post(
            "/crop/image", files={"image": ("filename", image_file, "text/plain")}
        )
    assert response.status_code == 400
    assert response.json() == {"detail": "Unsupported file type"}


def test_crop_image_base64_valid():
    base64_image = create_base64_image("testDocs\performance_chart_100_20.png")
    response = client.post("/crop/base64", json={"image_base64": base64_image})
    assert response.status_code == 200
    assert "cropped_image" in response.json()


def test_crop_image_base64_invalid():
    response = client.post("/crop/base64", json={"image_base64": "not_a_base64_string"})
    assert response.status_code == 500
    assert "detail" in response.json()


def test_rotate_image_valid():
    image_path = "testDocs\performance_chart_100_20.png"  
    with open(image_path, "rb") as image_file:
        response = client.post(
            "/rotate/image", files={"image": ("filename", image_file, "image/jpeg")}
        )
    assert response.status_code == 200
    assert "rotated_image" in response.json()


def test_rotate_image_invalid_format():
    with open("testDocs\test_file.txt", "rb") as image_file:
        response = client.post(
            "/rotate/image", files={"image": ("filename", image_file, "text/plain")}
        )
    assert response.status_code == 400
    assert response.json() == {"detail": "Unsupported file type"}


def test_rotate_image_64_valid():
    base64_image = create_base64_image("testDocs\performance_chart_100_20.png")
    response = client.post("/rotate/base64", json={"image_base64": base64_image})
    assert response.status_code == 200
    assert "rotated_image" in response.json()


def test_rotate_image_64_invalid():
    response = client.post(
        "/rotate/base64", json={"image_base64": "not_a_base64_string"}
    )
    assert response.status_code == 500
    assert "detail" in response.json()


def test_enhance_base64_valid():
    base64_image = create_base64_image("testDocs\performance_chart_100_20.png")
    response = client.post("/enhance/base64", json={"image_base64": base64_image})
    assert response.status_code == 200
    assert "image" in response.json()


def test_enhance_base64_invalid():
    response = client.post(
        "/enhance/base64", json={"image_base64": "not_a_base64_string"}
    )
    assert response.status_code == 500
    assert "detail" in response.json()


def test_text_guided_enhance_valid():
    image_path = "testDocs\performance_chart_100_20.png" 
    with open(image_path, "rb") as image_file:
        response = client.post(
            "/text-guided-enhance",
            files={"image": ("filename", image_file, "image/jpeg")},
            data={"text": "enhance brightness"},
        )
    assert response.status_code == 200
    assert "enhanced_image" in response.json()


def test_text_guided_enhance_invalid_format():
    with open("testDocs\test_file.txt", "rb") as image_file:
        response = client.post(
            "/text-guided-enhance",
            files={"image": ("filename", image_file, "text/plain")},
            data={"text": "enhance brightness"},
        )
    assert response.status_code == 400
    assert response.json() == {"detail": "Unsupported file type"}


def test_process_image_valid():
    base64_image = create_base64_image("testDocs\performance_chart_100_20.png")
    response = client.post("/process-image", json={"image_base64": base64_image})
    assert response.status_code == 200
    assert "processed_image" in response.json()


def test_process_image_invalid():
    response = client.post(
        "/process-image", json={"image_base64": "not_a_base64_string"}
    )
    assert response.status_code == 500
    assert "detail" in response.json()
