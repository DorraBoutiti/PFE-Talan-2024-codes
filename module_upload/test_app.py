import unittest
from server import app
from io import BytesIO

class TestApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_hello_world(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode(), 'Hello, World!')

    def test_image_to_base64_valid_image(self):
        # Provide a valid image file
        with open('testDocs/Image_test.png', 'rb') as f:
            data = {'image': (f, 'testDocs/Image_test.png')}
            response = self.app.post('/image-to-base64', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)
            self.assertTrue('base64' in response.json)

    def test_image_to_base64_no_image(self):
        # No image provided
        response = self.app.post('/image-to-base64')
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json)

    # Add more test cases for different scenarios of image_to_base64 endpoint

    def test_detect_file_type_valid_file(self):
        # Provide a valid file
        with open('testDocs/test_file.txt', 'rb') as f:
            data = {'file': (f, 'testDocs/test_file.txt')}
            response = self.app.post('/detect-file-type', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)
            self.assertTrue('file_type' in response.json)

    # Add more test cases for different scenarios of detect_file_type endpoint

    def test_pdf_to_images_valid_pdf(self):
        # Provide a valid PDF file
        with open('testDocs/pdf-test.pdf', 'rb') as f:
            data = {'pdf': (f, 'testDocs/pdf-test.pdf')}
            response = self.app.post('/pdf-to-images', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)
            self.assertTrue('images' in response.json)

    # Add more test cases for different scenarios of pdf_to_images endpoint

    def test_docx_to_images_valid_docx(self):
        # Provide a valid DOCX file
        with open('testDocs/Test-docx.docx', 'rb') as f:
            data = {'docx': (f, 'testDocs/Test-docx.docx')}
            response = self.app.post('/docx-to-images', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)
            self.assertTrue('images' in response.json)    
    

    def test_image_to_base64_success(self):
        with open('testDocs/Image_test.png', 'rb') as f:
            response = self.app.post('/image-to-base64', data={'image': f})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'base64', response.data)

    def test_image_to_base64_no_file(self):
        response = self.app.post('/image-to-base64')
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'No image file provided', response.data)

    def test_image_to_base64_invalid_file(self):
        with open('testDocs/test_file.txt', 'rb') as f:
            response = self.app.post('/image-to-base64', data={'image': f})
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'File is not a valid image', response.data)

    def test_detect_file_type_success(self):
        with open('testDocs/pdf-test.pdf', 'rb') as f:
            response = self.app.post('/detect-file-type', data={'file': f})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'application/pdf', response.data)

    def test_detect_file_type_no_file(self):
        response = self.app.post('/detect-file-type')
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'No file provided', response.data)

    def test_pdf_to_images_success(self):
        with open('testDocs/pdf-test.pdf', 'rb') as f:
            response = self.app.post('/pdf-to-images', data={'pdf': f})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'images', response.data)

    def test_pdf_to_images_no_pdf(self):
        response = self.app.post('/pdf-to-images')
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'No PDF file provided', response.data)

    def test_docx_to_images_success(self):
        with open('testDocs/Test-docx.docx', 'rb') as f:
            response = self.app.post('/docx-to-images', data={'docx': f})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'images', response.data)

    def test_docx_to_images_no_docx(self):
        response = self.app.post('/docx-to-images')
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'No DOCX file provided', response.data)
    
    def test_pdf_invalid_format(self):
        # Provide a non-PDF file
        with open('testDocs/test_file.txt', 'rb') as f:
            data = {'pdf': (f, 'non_pdf_file.txt')}
            response = self.app.post('/pdf-to-images', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 400)
            self.assertTrue('error' in response.json)
            self.assertEqual(response.json['error'], 'Invalid file format. Must be a PDF file')

    def test_empty_pdf_file(self):
        # Provide an empty PDF file
        with open('testDocs/empty_pdf1.pdf', 'rb') as f:
            data = {'pdf': (f, 'empty_pdf.pdf')}
            response = self.app.post('/pdf-to-images', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'images', response.data)
    
    def test_pdf_to_images_empty_filename(self):
        # Empty filename provided for PDF file
        data = {'pdf': (BytesIO(b''), '')}
        response = self.app.post('/pdf-to-images', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json)
        self.assertEqual(response.json['error'], 'No PDF file provided')
        

    def test_pdf_to_images_internal_server_error(self):
        # Simulate an internal server error by passing invalid PDF data
        with open('testDocs/test_file.txt', 'rb') as f:            
            response = self.app.post('/pdf-to-images', data={'pdf': (f, 'empty_pdf.pdf')})
            self.assertEqual(response.status_code, 500)
            self.assertIn(b'code=7: no objects found', response.data)

        
    def test_docx_to_images_internal_server_error(self):
        with open('testDocs/test_file.txt', 'rb') as f:
            data = {'docx': (f, 'testDocs/test_file.txt')}
            response = self.app.post('/docx-to-images', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 500)
            self.assertIn(b'File is not a zip file', response.data)

if __name__ == '__main__':
    unittest.main()
