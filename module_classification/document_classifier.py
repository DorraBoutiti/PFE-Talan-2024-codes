class DocumentClassifier:
    def __init__(self):
        # Keywords for each document type
        self.document_types = {
            "Employment Contract": ["Employment Contract", "CDI", "CDD"],
            "Birth Certificate": ["Birth Certificate", "Birth Record"],
            "Work Certificate": ["Work Certificate"],
            "Acknowledgment of Internal Regulations": [
                "Acknowledgment of Internal Regulations"
            ],
            "Diploma Copies": ["Diploma", "Diploma"],
            "ID Card": ["ID Card"],
            "CNSS Card": ["CNSS Card"],
            "RIB Certificate Copy": ["RIB Certificate Copy"],
            "Marriage Certificate Copy": ["Marriage Certificate Copy"],
            "Curriculum Vitae": ["CV", "Curriculum Vitae", "Education"],
            "Confidentiality Procedure": ["Confidentiality Procedure"],
            "Code of Conduct": ["Code of Conduct"],
            "Address Change Justification": ["Address Change Justification"],
            "Divorce Certificate Copy": ["Divorce Certificate Copy"],
            "Medical Certificate": ["Medical Certificate", "Medical Attestation"],
            "Residence Certificate": ["Residence Certificate"],
            "School Attendance Certificate": ["School Attendance Certificate"],
            "Resignation": ["Resignation", "Resignation Letter"],
            "Contract Amendment": ["Contract Amendment"],
            "Child Birth Certificate": ["Child Birth Certificate"],
            "Handwritten Request": ["Handwritten Request"],
            "Pregnancy Certificate": ["Pregnancy Certificate"],
            "Medical Report": ["Medical Report"],
            "Avenant": ["Avenant"],
            "Birth Giving Certificate": ["Birth Giving Certificate"],
        }

    def classify_document(self, document_text):
        if not isinstance(document_text, str):
            # If document_text is not a string, return "Document Type Not Recognized"
            return "Document Type Not Recognized"

        # Search for keywords for each document type
        for document_type, keywords in self.document_types.items():
            for keyword in keywords:
                if keyword.lower() in document_text.lower():
                    return document_type

        # If no matching document type is found, return "Document Type Not Recognized"
        return "Document Type Not Recognized"
