import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

class TestEndToEnd(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()  # Utilisez le navigateur de votre choix ici
        self.driver.get("http://localhost:8000/")  # Assurez-vous de changer l'URL si nécessaire

    def tearDown(self):
        self.driver.close()

    def test_home_page_loads(self):
        # Vérifie si la page d'accueil se charge correctement
        self.assertIn("Hello, World!", self.driver.title)

    def test_image_to_base64_conversion(self):
        # Simule le téléchargement d'une image et vérifie si la conversion en base64 fonctionne correctement
        upload_input = self.driver.find_element_by_id("fileUploadInput")
        upload_input.send_keys(".\testDocs\Image_test.png")  # Assurez-vous de changer le chemin d'accès à l'image
        convert_button = self.driver.find_element_by_id("convertButton")
        convert_button.click()
        base64_output = self.driver.find_element_by_id("base64Output")
        self.assertTrue(base64_output.is_displayed())
        self.assertTrue(base64_output.text.startswith("data:image/png;base64,"))

    def test_file_type_detection(self):
        # Simule le téléchargement d'un fichier et vérifie si le type de fichier est détecté correctement
        upload_input = self.driver.find_element_by_id("fileUploadInput")
        upload_input.send_keys(".\testDocs\TestPDF.pdf")  # Assurez-vous de changer le chemin d'accès au fichier
        detect_button = self.driver.find_element_by_id("detectButton")
        detect_button.click()
        file_type_output = self.driver.find_element_by_id("fileTypeOutput")
        self.assertTrue(file_type_output.is_displayed())
        self.assertEqual(file_type_output.text, "PDF")

    # Ajoutez d'autres tests e2e selon les fonctionnalités de votre application

if __name__ == "__main__":
    unittest.main()
