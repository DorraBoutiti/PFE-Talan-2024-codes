import unittest
from flask_testing import TestCase
from server import app

class TestHrDocumentAnalyzer(TestCase):

    def create_app(self):
        app.config['TESTING'] = True
        return app

    def test_hello_world(self):
        # Test the '/' endpoint to ensure it returns a 200 status code and the expected response body.
        response = self.client.get('/')
        self.assert200(response)
        self.assertEqual(response.data.decode(), 'Hello, World!')

    def test_image_to_base64_success(self):
        with open("./testDocs/Image_test.png", "rb") as img:
            response = self.client.post('/image-to-base64', content_type='multipart/form-data', data={'image': img})
            self.assert200(response)
            self.assertIn('base64', response.json)

    def test_image_to_base64_no_file(self):
        response = self.client.post('/image-to-base64', content_type='multipart/form-data')
        self.assert400(response)
        self.assertIn('error', response.json)

    def test_image_to_base64_invalid_image(self):
        with open("./testDocs/test_file.txt", "rb") as img:
            response = self.client.post('/image-to-base64', content_type='multipart/form-data', data={'image': img})
            self.assert400(response)
            self.assertIn('error', response.json)

    def test_detect_file_type_success(self):
        with open("./testDocs/test_file.txt", "rb") as file:
            response = self.client.post('/detect-file-type', content_type='multipart/form-data', data={'file': file})
            self.assert200(response)
            self.assertIn('file_type', response.json)

    def test_detect_file_type_no_file(self):
        response = self.client.post('/detect-file-type', content_type='multipart/form-data')
        self.assert400(response)
        self.assertIn('error', response.json)

    def test_pdf_to_images_success(self):
        with open("./testDocs/TestPDF.pdf", "rb") as pdf:
            response = self.client.post('/pdf-to-images', content_type='multipart/form-data', data={'pdf': pdf})
            self.assert200(response)
            self.assertIn('images', response.json)
            self.assertIsInstance(response.json['images'], list)
            self.assertGreater(len(response.json['images']), 0)

    def test_pdf_to_images_no_pdf(self):
        response = self.client.post('/pdf-to-images', content_type='multipart/form-data')
        self.assert400(response)
        self.assertIn('error', response.json)

    def test_docx_to_images_success(self):
        with open("./testDocs/Test-docx.docx", "rb") as docx_file:
            response = self.client.post('/docx-to-images', content_type='multipart/form-data', data={'docx': docx_file})
            self.assert200(response)
            self.assertIn('images', response.json)
            self.assertIsInstance(response.json['images'], list)
            self.assertGreater(len(response.json['images']), 0)

    def test_docx_to_images_no_docx(self):
        response = self.client.post('/docx-to-images', content_type='multipart/form-data')
        self.assert400(response)
        self.assertIn('error', response.json)




if __name__ == '__main__':
    unittest.main()

