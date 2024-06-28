from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def hello():
    return "Hello from Module"

# Dictionary mapping document class codes to example JSON templates
document_templates = {
    "DOC01": {"title": "Contrat de travail", "country": "Maroc"},
    "DOC02": {"title": "Extrait de naissance", "country": "Maroc"},
    "DOC03": {"title": "Certificat de travail", "country": "Maroc"},
    "DOC04": {"title": "Radio pulmonaire", "country": "Maroc"},
    "DOC05": {"title": "Dossier du personnel renseigné", "country": "Maroc"},
    "DOC06": {"title": "Accusé de réception du règlement interne", "country": "Maroc"},
    "DOC07": {"title": "Copies diplômes légalisées", "country": "Maroc"},
    "DOC08": {"title": "Copie de CIN légalisée", "country": "Maroc"},
    "DOC09": {"title": "Copie de la carte CNSS", "country": "Maroc"},
    "DOC10": {"title": "Photos d'identité récentes", "country": "Maroc"},
    "DOC11": {"title": "Copie d'attestation de RIB", "country": "Maroc"},
    "DOC12": {"title": "Fiche Anthropométrique", "country": "Maroc"},
    "DOC13": {"title": "Copie de l'acte de mariage", "country": "Maroc"},
    "DOC14": {"title": "Curriculum Vitae", "country": "Maroc"},
    "DOC15": {"title": "Procédure Confidentialité des infos", "country": "Maroc"},
    "DOC16": {"title": "Autorisation & Décharge", "country": "Maroc"},
    "DOC17": {"title": "Charte de bonne conduite", "country": "Maroc"},
    "DOC20": {"title": "Justificatif de changement d'adresse", "country": "Maroc"},
    "DOC32": {"title": "Copie de CIN", "country": "Maroc"},
    "DOC33": {"title": "Copie de l'acte de divorce", "country": "Maroc"},
    "DOC34": {"title": "certificat Médical", "country": "MyFlex"},
    "DOC35": {"title": "certificat de Résidence", "country": "MyFlex"},
    "DOC36": {"title": "Dossier Médical /Pli confidentiel", "country": "MyFlex"},
    "DOC37": {"title": "attestation de scolarité", "country": "MyFlex"},
    "DOC38": {"title": "démission", "country": "MyFlex"},
    "DOC39": {"title": "Avenant de contrat", "country": "MyFlex"},
    "DOC40": {"title": "Acte de naissance Enfant", "country": "MyFlex"},
    "DOC41": {"title": "Demande manuscrite", "country": "MyFlex"},
    "DOC42": {"title": "demande d'aménagement du durée", "country": "MyFlex"},
    "DOC43": {"title": "Certificat de grossesse", "country": "MyFlex"},
    "DOC44": {"title": "Rapport Médical", "country": "MyFlex"},
    "DOC45": {"title": "Certificat d'accouchement", "country": "MyFlex"},
}

@app.route("/extract_infos", methods=["POST"])
def extract_document_infos():
    data = request.json
    document_class_code = data.get("document_class_code")
    text = data.get("document_text")

    if document_class_code not in document_templates:
        return jsonify({"error": "Invalid document class code"}), 400

    return jsonify(document_templates[document_class_code])

@app.route("/extract", methods=["POST"])
def extract_document_info():
    data = request.json
    document_class_code = data.get("document_class_code")
    text = data.get("document_text")

    # if document_class_code not in document_templates:
    #     return jsonify({"error": "Invalid document class code"}), 400

    if document_class_code == "DOC01":
        return jsonify(
            {
                "title": "Employment Contract",
                "country": "Morocco",
                "employee_name": "John Doe",
                "employer_name": "Company XYZ",
                "start_date": "2024-01-01",
                "end_date": "2025-01-01",
                "position": "Software Engineer",
                "salary": "5000 MAD/month",
            }
        );
    elif document_class_code == "DOC02":
        return jsonify(
            {
                "title": "Birth Certificate",
                "country": "Morocco",
                "first_name": "John",
                "last_name": "Doe",
                "birth_date": "1990-01-01",
                "birth_place": "Paris",
                "birth_country": "France",
                "gender": "Male",
                "marital_status": "Married",
            }
        ); 
    elif document_class_code == "DOC03":
        return jsonify(
            {
                "title": "Work Certificate",
                "country": "Morocco",
                "employee_name": "John Doe",
                "employer_name": "Company XYZ",
                "position": "Software Engineer",
                "employment_duration": "2020-2024",
            }
        );
    elif document_class_code == "DOC04":
        return jsonify(
            
                {
                    "title": "Chest X-ray",
                    "country": "Morocco",
                    "patient_name": "John Doe",
                    "date": "2024-05-01",
                    "results": "Normal",
                }
            
        )
    elif document_class_code == "DOC05":
        return jsonify(
            {
                "title": "Personnel File",
                "country": "Morocco",
                "employee_name": "John Doe",
                "position": "Software Engineer",
                "start_date": "2020-01-01",
                "documents": ["ID Copy", "Diploma", "Employment Contract"],
            }
        )
    elif document_class_code == "DOC06":
        return jsonify(
            {
                "title": "Receipt of Internal Regulations",
                "country": "Morocco",
                "employee_name": "John Doe",
                "date": "2024-05-01",
                "confirmation": "Received and understood",
            }
        )
    elif document_class_code == "DOC07":
        return jsonify(
            {
                "title": "Certified Copies of Diplomas",
                "country": "Morocco",
                "employee_name": "John Doe",
                "diplomas": [
                    "Bachelor's in Computer Science",
                    "Master's in Software Engineering",
                ],
            }
        )
    elif document_class_code == "DOC08":
        return jsonify(
            {
                "title": "Certified Copy of ID",
                "country": "Morocco",
                "employee_name": "John Doe",
                "id_number": "AB123456",
                "issue_date": "2010-01-01",
                "expiration_date": "2030-01-01",
            }
        )
    elif document_class_code == "DOC09":
        return jsonify(
            {
                "title": "Copy of CNSS Card",
                "country": "Morocco",
                "employee_name": "John Doe",
                "cnss_number": "123456789",
            }
        )
    elif document_class_code == "DOC10":
        return jsonify(
            {
                "title": "Recent Identity Photos",
                "country": "Morocco",
                "employee_name": "John Doe",
                "photo_count": 2,
            }
        )
    elif document_class_code == "DOC11":
        return jsonify(
            {
  "title": "Copy of RIB Attestation",
  "country": "Morocco",
  "employee_name": "John Doe",
  "bank_name": "Bank XYZ",
  "account_number": "1234567890"
}

        )
    elif document_class_code == "DOC12":
        return jsonify(
            {
  "title": "Anthropometric Sheet",
  "country": "Morocco",
  "employee_name": "John Doe",
  "height": "180 cm",
  "weight": "75 kg",
  "eye_color": "Brown"
}

        )
    elif document_class_code == "DOC13":
        return jsonify(
            {
  "title": "Copy of Marriage Certificate",
  "country": "Morocco",
  "spouse_names": ["John Doe", "Jane Smith"],
  "date_of_marriage": "2020-06-15",
  "place_of_marriage": "Rabat"
}
        )
    elif document_class_code == "DOC14":
        return jsonify(
            {
  "title": "Curriculum Vitae",
  "country": "Morocco",
  "name": "John Doe",
  "education": ["Bachelor's in Computer Science", "Master's in Software Engineering"],
  "experience": ["Software Engineer at Company XYZ", "Junior Developer at Company ABC"],
  "skills": ["Python", "Java", "Docker"]
}
        )
    elif document_class_code == "DOC15":
        return jsonify(
            {
  "title": "Confidential Information Procedure",
  "country": "Morocco",
  "employee_name": "John Doe",
  "confirmation": "Read and agreed",
  "date": "2024-05-01"
}
        )
    elif document_class_code == "DOC16":
        return jsonify(
            {
  "title": "Authorization & Discharge",
  "country": "Morocco",
  "employee_name": "John Doe",
  "authorization_details": "Authorization to share personal data",
  "date": "2024-05-01"
}
        )
    elif document_class_code == "DOC17":
        return jsonify(
            {
                "title": "Code of Conduct",
                "country": "Morocco",
                "employee_name": "John Doe",
                "confirmation": "Read and agreed",
                "date": "2024-05-01",
            }
        )
    elif document_class_code == "DOC20":
        return jsonify(
            {
                "title": "Proof of Address Change",
                "country": "Morocco",
                "employee_name": "John Doe",
                "old_address": "123 Old St, Casablanca",
                "new_address": "456 New St, Rabat",
                "date_of_change": "2024-05-01",
            }
        )
    elif document_class_code == "DOC32":
        return jsonify(
            {
                "title": "Copy of ID",
                "country": "Morocco",
                "employee_name": "John Doe",
                "id_number": "AB123456",
                "issue_date": "2010-01-01",
                "expiration_date": "2030-01-01",
            }
        )
    elif document_class_code == "DOC33":
        return jsonify(
            {
                "title": "Copy of Divorce Certificate",
                "country": "Morocco",
                "names": ["John Doe", "Jane Smith"],
                "date_of_divorce": "2024-01-01",
                "place_of_divorce": "Casablanca",
            }
        )
    elif document_class_code == "DOC34":
        return jsonify(
            {
                "title": "Medical Certificate",
                "country": "MyFlex",
                "patient_name": "John Doe",
                "doctor_name": "Dr. Smith",
                "date_of_exam": "2024-05-01",
                "results": "Fit for work",
            }
        )
    elif document_class_code == "DOC35":
        return jsonify(
            {
                "title": "Residence Certificate",
                "country": "MyFlex",
                "resident_name": "John Doe",
                "address": "123 Main St, Casablanca",
                "issue_date": "2024-05-01",
            }
        )
    elif document_class_code == "DOC36":
        return jsonify(
            {
                "title": "Medical File / Confidential Envelope",
                "country": "MyFlex",
                "patient_name": "John Doe",
                "documents": ["Medical history", "X-ray results"],
            }
        )
    elif document_class_code == "DOC37":
        return jsonify(
            {
                "title": "School Certificate",
                "country": "MyFlex",
                "student_name": "John Doe",
                "school_name": "ABC School",
                "grade": "10th",
                "year": "2024",
            }
        )
    elif document_class_code == "DOC38":
        return jsonify(
            {
                "title": "Resignation",
                "country": "MyFlex",
                "employee_name": "John Doe",
                "employer_name": "Company XYZ",
                "date": "2024-05-01",
                "last_working_day": "2024-06-01",
            }
        )
    elif document_class_code == "DOC39":
        return jsonify(
            {
                "title": "Contract Amendment",
                "country": "MyFlex",
                "employee_name": "John Doe",
                "employer_name": "Company XYZ",
                "amendment_details": "Change in salary from 5000 MAD to 6000 MAD",
                "effective_date": "2024-05-01",
            }
        )
    elif document_class_code == "DOC40":
        return jsonify(
            {
                "title": "Child's Birth Certificate",
                "country": "MyFlex",
                "child_name": "Jane Doe",
                "date_of_birth": "2024-01-01",
                "place_of_birth": "Rabat",
                "parent_names": ["John Doe", "Jane Smith"],
            }
        )
    elif document_class_code == "DOC41":
        return jsonify(
            {
                "title": "Handwritten Request",
                "country": "MyFlex",
                "employee_name": "John Doe",
                "request_details": "Request for annual leave from 2024-07-01 to 2024-07-15",
                "date": "2024-05-01",
            }
        )
    elif document_class_code == "DOC42":
        return jsonify(
            {
                "title": "Request for Adjustment of Working Hours",
                "country": "MyFlex",
                "employee_name": "John Doe",
                "request_details": "Adjustment of working hours to 9 AM - 5 PM",
                "date": "2024-05-01",
            }
        )
    elif document_class_code == "DOC43":
        return jsonify(
            {
                "title": "Pregnancy Certificate",
                "country": "MyFlex",
                "patient_name": "Jane Doe",
                "doctor_name": "Dr. Smith",
                "expected_due_date": "2024-10-01",
            }
        )
    elif document_class_code == "DOC44":
        return jsonify(
            {
                "title": "Medical Report",
                "country": "MyFlex",
                "patient_name": "John Doe",
                "doctor_name": "Dr. Smith",
                "report_date": "2024-05-01",
                "findings": "Minor injury, recommended rest",
            }
        )
    elif document_class_code == "DOC45":
        return jsonify(
            {
                "title": "Birth Certificate",
                "country": "MyFlex",
                "mother_name": "Jane Doe",
                "baby_name": "Jane Smith Doe",
                "date_of_birth": "2024-05-01",
                "place_of_birth": "Rabat",
                "doctor_name": "Dr. Smith",
            }
        )
    else :
        return jsonify({
                        "key 1": "document_class_code",
                        "key 2": "value 2",
                        "key 3": "value 3",
                        "key 4": "value 4",
                        "key 5": "value 5",
                        "key 6": "value 6",
                        "key 7": "value 7",
                        "key 8": "value 8",
                        "key 9": "value 9",
                        "key 10": "value 10",
                    })


if __name__ == "__main__":
    app.run(debug=True)
