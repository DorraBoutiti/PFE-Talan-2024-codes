import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

class TestEndToEnd(unittest.TestCase):
    def setUp(self):
        """
        Set up the test environment by initializing a Chrome webdriver and navigating to the specified URL.

        This method does not take any parameters.

        This method does not return any value.
        """
        self.driver = webdriver.Chrome()  
        self.driver.get("http://localhost:8009/") 

    def tearDown(self):
        """
        Closes the driver used for the test.

        This method is part of the tearDown phase of the test case. It is responsible for closing the driver that was used for the test.

        Parameters:
            self (TestEndToEnd): The instance of the test case.

        Returns:
            None
        """
        self.driver.close()

    def test_home_page_loads(self):
        """
        Test if the home page loads correctly.

        This function checks if the home page loads correctly by asserting that the title of the driver contains the string "Hello, World!".

        Parameters:
            self (TestEndToEnd): The instance of the test case.

        Returns:
            None
        """
        self.assertIn("Hello, World!", self.driver.title)

    def test_image_to_base64_conversion(self):
        """
        Test if the image to base64 conversion works correctly.

        This function simulates the upload of an image and checks if the conversion to base64 works correctly.
        It finds the upload input element by its id "fileUploadInput", sets the path to the image to be uploaded,
        finds the convert button element by its id "convertButton", clicks on the button, and then finds the base64
        output element by its id "base64Output". It asserts that the base64 output is displayed and that its text
        starts with "data:image/png;base64,".

        Parameters:
            self (TestEndToEnd): The instance of the test case.

        Returns:
            None
        """
        upload_input = self.driver.find_element_by_id("fileUploadInput")
        upload_input.send_keys(".\testDocs\Image_test.png")  
        convert_button = self.driver.find_element_by_id("convertButton")
        convert_button.click()
        base64_output = self.driver.find_element_by_id("base64Output")
        self.assertTrue(base64_output.is_displayed())
        self.assertTrue(base64_output.text.startswith("data:image/png;base64,"))

    def test_file_type_detection(self):
        """
        Test if the file type detection works correctly.

        This function simulates the upload of a file and checks if the file type detection works correctly.
        It finds the upload input element by its id "fileUploadInput", sets the path to the file to be uploaded,
        finds the detect button element by its id "detectButton", clicks on the button, and then finds the file type
        output element by its id "fileTypeOutput". It asserts that the file type output is displayed and that its
        text is equal to "PDF".

        Parameters:
            self (TestEndToEnd): The instance of the test case.

        Returns:
            None
        """
        upload_input = self.driver.find_element_by_id("fileUploadInput")
        upload_input.send_keys(".\testDocs\TestPDF.pdf")  # Assurez-vous de changer le chemin d'accès au fichier
        detect_button = self.driver.find_element_by_id("detectButton")
        detect_button.click()
        file_type_output = self.driver.find_element_by_id("fileTypeOutput")
        self.assertTrue(file_type_output.is_displayed())
        self.assertEqual(file_type_output.text, "PDF")


if __name__ == "__main__":
    unittest.main()
