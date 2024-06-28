import unittest
from server import app
from io import BytesIO

class TestApp(unittest.TestCase):
    def setUp(self):
        """
        Set up the test case by creating a test client for the Flask application.

        This method is called before each test case is executed. It initializes the `self.app` attribute with a test client for the Flask application. The test client allows you to send HTTP requests to the application and verify the responses.

        Parameters:
            None

        Returns:
            None
        """

    def test_hello_world(self):
        """
        Test the '/' route of the Flask application.

        This function sends a GET request to the '/' route of the Flask application and checks if the response status code is 200 and if the response data is equal to 'Hello, World!'.

        Parameters:
            self (TestApp): The instance of the TestApp class.

        Returns:
            None
        """
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode(), 'Hello, World!')

    def test_image_to_base64_valid_image(self):
        """
        Test the '/image-to-base64' endpoint with a valid image file.

        This function tests the '/image-to-base64' endpoint by providing a valid image file. It opens the file 'testDocs/Image_test.png' in binary mode and creates a dictionary with the image file and its name. It then sends a POST request to the '/image-to-base64' endpoint with the image data and the content type set to 'multipart/form-data'. The function asserts that the response status code is 200 and that the 'base64' key is present in the response JSON.

        Parameters:
            self (TestApp): The current instance of the TestApp class.

        Returns:
            None
        """
        with open('testDocs/Image_test.png', 'rb') as f:
            data = {'image': (f, 'testDocs/Image_test.png')}
            response = self.app.post('/image-to-base64', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)
            self.assertTrue('base64' in response.json)

    def test_image_to_base64_no_image(self):
        """
        Test case to verify the behavior of the `test_image_to_base64_no_image` function.

        This test case checks if the function handles the scenario when no image is provided.
        It sends a POST request to the '/image-to-base64' endpoint without providing an image.
        The function then asserts that the response status code is 400 and that the 'error' key
        is present in the response JSON.

        Parameters:
        - self: The instance of the test case class.

        Returns:
        - None
        """
        response = self.app.post('/image-to-base64')
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json)

    def test_detect_file_type_valid_file(self):
        """
        Test case for detecting the file type of a valid file.

        This test case ensures that the '/detect-file-type' endpoint correctly detects the file type of a valid file.

        Steps:
        1. Open the file 'testDocs/test_file.txt' in binary read mode.
        2. Create a dictionary 'data' with the file as the value and its name as the key.
        3. Send a POST request to '/detect-file-type' endpoint with the 'data' dictionary as the payload and 'multipart/form-data' content type.
        4. Assert that the response status code is 200.
        5. Assert that the response JSON contains the key 'file_type'.

        Returns:
        None
        """
        with open('testDocs/test_file.txt', 'rb') as f:
            data = {'file': (f, 'testDocs/test_file.txt')}
            response = self.app.post('/detect-file-type', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)
            self.assertTrue('file_type' in response.json)

    def test_pdf_to_images_valid_pdf(self):
        """
        Test case to verify that the '/pdf-to-images' endpoint returns a 200 status code and a 'images' key in the response JSON when provided with a valid PDF file.

        This test case uses the Flask test client to send a POST request to the '/pdf-to-images' endpoint with a valid PDF file. The response status code is checked to ensure it is 200. The response JSON is then checked to ensure it contains a 'images' key.

        Parameters:
            self (TestApp): The test case instance.

        Returns:
            None
        """
        with open('testDocs/pdf-test.pdf', 'rb') as f:
            data = {'pdf': (f, 'testDocs/pdf-test.pdf')}
            response = self.app.post('/pdf-to-images', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)
            self.assertTrue('images' in response.json)

    def test_docx_to_images_valid_docx(self):
        """
        Test the '/docx-to-images' endpoint with a valid DOCX file.

        This function tests the '/docx-to-images' endpoint by providing a valid DOCX file. It opens the file in binary mode and creates a dictionary with the file data. The dictionary is then sent as a multipart/form-data request to the '/docx-to-images' endpoint. The response status code is asserted to be 200, indicating a successful request. Finally, the function asserts that the 'images' key is present in the response JSON.

        Parameters:
        - self: The instance of the TestApp class.

        Returns:
        - None
        """
        with open('testDocs/Test-docx.docx', 'rb') as f:
            data = {'docx': (f, 'testDocs/Test-docx.docx')}
            response = self.app.post('/docx-to-images', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)
            self.assertTrue('images' in response.json)    

    def test_image_to_base64_success(self):
        """
        Test the success case of the '/image-to-base64' endpoint.

        This function tests the '/image-to-base64' endpoint by sending a POST request with an image file. It asserts that the response status code is 200 and that the response data contains the string 'base64'.

        Parameters:
        - self: The instance of the test case class.

        Returns:
        None
        """
        response = self.app.post('/image-to-base64', data={'image': f})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'base64', response.data)

    def test_image_to_base64_no_file(self):
        """
        Test the '/image-to-base64' endpoint when no image file is provided.

        This test case verifies that when the '/image-to-base64' endpoint is called with no image file provided,
        the server returns a 400 status code and a response body containing the message 'No image file provided'.

        This test case is part of the 'TestApp' test class and is executed as part of the unit tests for the 'module_upload' module.

        Parameters:
            self (TestApp): The current test case instance.

        Returns:
            None
        """
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'No image file provided', response.data)

    def test_image_to_base64_invalid_file(self):
        """
        Test the '/image-to-base64' route of the Flask application with an invalid file.

        This function sends a POST request to the '/image-to-base64' route of the Flask application with an invalid file. It asserts that the response status code is 400 and that the response data contains the message 'File is not a valid image'.

        Parameters:
            self (TestApp): The current test case instance.
        
        Returns:
            None
        """
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

    def test_pdf_to_base64_success(self):
        with open("testDocs/pdf-test.pdf", "rb") as f:
            response = self.app.post("/file-to-base64", data={"file": f})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"images", response.data)

    def test_docx_to_base64_success(self):
        with open("testDocs/Test-docx.docx", "rb") as f:
            response = self.app.post("/file-to-base64", data={"file": f})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"images", response.data)

    def test_image_to_base64_success(self):
        with open("testDocs/Image_test.png", "rb") as f:
            response = self.app.post("/file-to-base64", data={"file": f})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"base64", response.data)

    # Test cases for no file provided
    def test_no_file_provided(self):
        response = self.app.post("/file-to-base64")
        self.assertEqual(response.status_code, 400)
        self.assertIn(b"No file provided", response.data)

    # Test cases for unsupported file format
    def test_unsupported_file_format(self):
        with open("testDocs/test_file.txt", "rb") as f:
            response = self.app.post("/file-to-base64", data={"file": f})
        self.assertEqual(response.status_code, 400)
        self.assertIn(b"Unsupported file format", response.data)

    # Test cases for internal server errors
    def test_internal_server_error(self):
        with open("testDocs/test_file.txt", "rb") as f:
            response = self.app.post("/file-to-base64", data={"file": f})
        self.assertEqual(response.status_code, 400)
        self.assertIn(b"Unsupported file format", response.data)


if __name__ == '__main__':
    unittest.main()
