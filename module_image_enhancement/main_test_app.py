import unittest
import json
import base64
from io import BytesIO
from PIL import Image
from app.server import app  # Ensure your app instance is imported correctly

class TestEndpoint(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def create_image(self, color=(255, 0, 0), size=(100, 100)):
        img = Image.new('RGB', size, color=color)
        img_byte_arr = BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        return img_byte_arr

    def create_base64_image(self, color=(0, 0, 255), size=(100, 100)):
        img_byte_arr = self.create_image(color, size)
        base64_image = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')
        return base64_image

    def test_crop_image_file(self):
        img_byte_arr = self.create_image()

        response = self.app.post('/crop/image', content_type='multipart/form-data', data={
            'image': (img_byte_arr, 'test.png')
        })

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode('utf-8'))
        self.assertIn('cropped_image', data)
        self.assertIsInstance(data['cropped_image'], str)

    def test_crop_image_base64(self):
        base64_image = self.create_base64_image()

        response = self.app.post('/crop/base64', json={
            'image_base64': base64_image
        })

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode('utf-8'))
        self.assertIn('cropped_image', data)
        self.assertIsInstance(data['cropped_image'], str)

    def test_crop_no_image_file(self):
        response = self.app.post('/crop/image', content_type='multipart/form-data', data={})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data.decode('utf-8'))
        self.assertIn('error', data)

    def test_crop_no_base64_string(self):
        response = self.app.post('/crop/base64', json={})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data.decode('utf-8'))
        self.assertIn('error', data)

    def test_crop_invalid_base64_string(self):
        response = self.app.post('/crop/base64', json={
            'image_base64': 'invalid_base64'
        })
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data.decode('utf-8'))
        self.assertIn('error', data)

    # def test_crop_invalid_coordinates(self):
    #     img_byte_arr = self.create_image()

    #     response = self.app.post('/crop/image', content_type='multipart/form-data', data={
    #         'image': (img_byte_arr, 'test.png'),
    #         'coordinates': json.dumps({'x': -10, 'y': -10, 'width': 110, 'height': 110})
    #     })

    #     self.assertEqual(response.status_code, 400)
    #     data = json.loads(response.data.decode('utf-8'))
    #     self.assertIn('error', data)

    def test_crop_empty_payload(self):
        response = self.app.post('/crop/image', content_type='multipart/form-data', data={})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data.decode('utf-8'))
        self.assertIn('error', data)

        response = self.app.post('/crop/base64', json={})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data.decode('utf-8'))
        self.assertIn('error', data)

if __name__ == '__main__':
    unittest.main()