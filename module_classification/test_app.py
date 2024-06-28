import unittest
from flask import Flask, jsonify
from server import app


class TestServer(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_hello(self):
        response = self.app.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode("utf-8"), "Hello from Module")

    def test_classify_document_missing_text(self):
        response = self.app.post("/classify-document", json={})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json, {"error": "Document text not provided or invalid format"}
        )

    def test_classify_document_invalid_format(self):
        response = self.app.post(
            "/classify-document", json={"invalid_key": "Some text"}
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json, {"error": "Document text not provided or invalid format"}
        )

    def test_classify_document_success(self):
        response = self.app.post(
            "/classify-document",
            json={"document_text": "This is a contract of employment"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"document_type": "Contrat de travail"})

    def test_classify_document_no_match(self):
        response = self.app.post(
            "/classify-document", json={"document_text": "This is a test document"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json, {"document_type": "Type de document non reconnu"}
        )


if __name__ == "__main__":
    unittest.main()
