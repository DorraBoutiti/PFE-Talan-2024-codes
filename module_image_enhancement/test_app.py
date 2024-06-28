import unittest
from unittest.mock import patch
import json
from app.server import app
import base64
from io import BytesIO
from PIL import Image


class TestFlaskRoutes(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def test_hello_route(self):
        response = self.app.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode("utf-8"), "Hello from Module")

    def test_no_image_file(self):
        response = self.app.post(
            "/crop/image", content_type="multipart/form-data", data={}
        )
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data.decode("utf-8"))
        self.assertIn("error", data)

    def test_valid_image_file(self):
        image_file = open("./testDocs/cin_olfa_png.PNG", "rb")
        response = self.app.post(
            "/crop/image",
            content_type="multipart/form-data",
            data={"image": image_file},
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode("utf-8"))
        self.assertIn("cropped_image", data)

    def test_invalid_image_file(self):
        image_file = open("./testDocs/sample1.txt", "rb")
        response = self.app.post(
            "/crop/image",
            content_type="multipart/form-data",
            data={"image": image_file},
        )
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data.decode("utf-8"))
        self.assertIn("error", data)

    def test_crop_image_base64_invalid_content_type(self):
        with app.test_client() as client:
            response = client.post("/crop/base64", data={}, content_type="text/plain")
            assert response.status_code == 400
            assert response.json == {"error": "Invalid content type"}

    def test_crop_image_base64_missing_base64_string(self):
        with app.test_client() as client:
            response = client.post("/crop/base64", json={})
            assert response.status_code == 400
            assert response.json == {"error": "Base64 string required"}

    def test_crop_image_base64_success(self):
        with app.test_client() as client:
            image_base64 = base64.b64encode(b"dummy image").decode("utf-8")
            response = client.post("/crop/base64", json={"image_base64": image_base64})
            assert response.status_code == 200
            assert "cropped_image" in response.json

    def test_crop_image_base64_exception(self):
        with app.test_client() as client, patch('app.crop.crop_image') as mock_crop_image:
            mock_crop_image.side_effect = Exception("Failed to crop image")
            response = client.post('/crop/base64', json={'image_base64': "base64_string"})
            print(response.status_code)
            print(response.data)
            assert response.status_code == 500
            assert response.json == {"error": "Failed to crop image"}

    def test_crop_image_base64_value_error(self):
        with app.test_client() as client, patch('app.crop.crop_image') as mock_crop_image:
            mock_crop_image.side_effect = ValueError("Invalid base64 string")
            response = client.post('/crop/base64', json={'image_base64': "base64_string"})
            print(response.status_code)
            print(response.data)
            assert response.status_code == 400
            assert response.json == {"error": "Invalid base64 string"}

    @patch("main.correct_image_orientation")
    def test_rotate_image_with_valid_image(self, mock_correct_image_orientation):
        mock_correct_image_orientation.return_value = PILImage.new("RGB", (100, 100))
        image_file = BytesIO(b"dummy image")
        response = self.app.post(
            "/rotate/image",
            data={"image": image_file},
            content_type="multipart/form-data",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"rotated_image": "dummy_base64_string"})

    def test_rotate_image_with_no_image(self):
        response = self.app.post("/rotate/image", content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json, {"error": "Image required"})

    @patch("main.correct_image_orientation")
    def test_rotate_image_with_image_correction_failure(
        self, mock_correct_image_orientation
    ):
        mock_correct_image_orientation.return_value = None
        image_file = BytesIO(b"dummy image")
        response = self.app.post(
            "/rotate/image",
            data={"image": image_file},
            content_type="multipart/form-data",
        )
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json, {"error": "Image correction failed"})

    @patch("main.correct_image_orientation")
    def test_rotate_image_with_exception(self, mock_correct_image_orientation):
        mock_correct_image_orientation.side_effect = Exception(
            "Failed to correct image"
        )
        image_file = BytesIO(b"dummy image")
        response = self.app.post(
            "/rotate/image",
            data={"image": image_file},
            content_type="multipart/form-data",
        )
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json, {"error": "Failed to correct image"})

    def test_rotate_image_64_no_image():
        with app.test_client() as client:
            response = client.post('/rotate/base64', json={})
            assert response.status_code == 400
            assert response.json == {"error": "Image required"}

    def test_rotate_image_64_invalid_base64():
        with app.test_client() as client:
            response = client.post('/rotate/base64', json={'image': 'invalid_base64'})
            assert response.status_code == 500
            assert response.json == {"error": "Invalid base64-encoded string"}

    def test_rotate_image_64_success():
        with app.test_client() as client:
            image_data = base64.b64encode(b'dummy image').decode('utf-8')
            response = client.post('/rotate/base64', json={'image': image_data})
            assert response.status_code == 200
            assert 'rotated_image' in response.json

    def test_rotate_image_64_exception():
        with app.test_client() as client, patch('main.correct_image_orientation') as mock_correct_image_orientation:
            mock_correct_image_orientation.side_effect = Exception("Failed to correct image")
            image_data = base64.b64encode(b'dummy image').decode('utf-8')
            response = client.post('/rotate/base64', json={'image': image_data})
            assert response.status_code == 500
            assert response.json == {"error": "Failed to correct image"}
            
    def test_enhance_missing_image():
        with app.test_client() as client:
            response = client.post("/enhance/base64", json={})
            assert response.status_code == 400
            assert response.json == {"error": "Image required"}
    
    def test_enhance_invalid_base64():
        with app.test_client() as client:
            response = client.post("/enhance/base64", json={"image": "invalid_base64"})
            assert response.status_code == 500
            assert response.json == {"error": "Invalid base64-encoded string"}

    def test_enhance_success():
        with app.test_client() as client:
            with patch("app.realesrgan.process_pil") as mock_process_pil:
                mock_process_pil.return_value = Image.new("RGB", (10, 10))
                response = client.post(
                    "/enhance/base64",
                    json={"image": base64.b64encode(b"test").decode("utf-8")},
                )
                assert response.status_code == 200
                assert response.json == {"image": base64.b64encode(b"test").decode("utf-8")}

    def test_enhance_exception():
        with app.test_client() as client:
            with patch("app.realesrgan.process_pil") as mock_process_pil:
                mock_process_pil.side_effect = Exception("Failed to process image")
                response = client.post(
                    "/enhance/base64",
                    json={"image": base64.b64encode(b"test").decode("utf-8")},
                )
                assert response.status_code == 500
                assert response.json == {"error": "Failed to process image"}


if __name__ == "__main__":
    unittest.main()
