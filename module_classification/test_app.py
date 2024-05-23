import unittest
from server import app

class BasicTests(unittest.TestCase):

    def setUp(self):
        # Set up the test client
        self.app = app.test_client()
        self.app.testing = True

    def test_home(self):
        # Send a GET request to the root URL
        result = self.app.get('/')
        
        # Assert that the status code is 200 (OK)
        self.assertEqual(result.status_code, 200)
        
        # Assert that the response data is as expected
        self.assertEqual(result.data.decode('utf-8'), 'Hello from Module Speech-to-Text')

if __name__ == "__main__":
    unittest.main()
