from fastapi.testclient import TestClient
import base64
from main import app

client = TestClient(app)


# Test endpoint "/ocr/predict-by-path" with a local image
def test_predict_by_path():
    image_path = "module_ocr/test_image.png"
    response = client.get(f"/ocr/predict-by-path?image_path={image_path}")
    assert response.status_code == 200
    assert response.json()["resultcode"] == 200
    assert "data" in response.json()


# Test endpoint "/ocr/predict-by-base64" with base64 encoded image
def test_predict_by_base64():
    with open("module_ocr/test_image.png", "rb") as image_file:
        base64_str = base64.b64encode(image_file.read()).decode("utf-8")
    response = client.post(
        "/ocr/predict-by-base64", json={"base64model": {"base64_str": base64_str}}
    )
    assert response.status_code == 200
    assert response.json()["resultcode"] == 200
    assert "data" in response.json()


# Test endpoint "/ocr/predict-by-file" with an uploaded file
def test_predict_by_file():
    files = {"file": open("module_ocr/test_image.png", "rb")}
    response = client.post("/ocr/predict-by-file", files=files)
    assert response.status_code == 200
    assert response.json()["resultcode"] == 200
    assert "data" in response.json()


# Test endpoint "/ocr/predict-by-url" with an image URL
def test_predict_by_url():
    image_url = (
        "https://www.zohowebstatic.com/sites/zweb/images/docscanner/extract-scan1.png"
    )
    response = client.get(f"/ocr/predict-by-url?imageUrl={image_url}")
    assert response.status_code == 200
    assert response.json()["resultcode"] == 200
    assert "data" in response.json()
