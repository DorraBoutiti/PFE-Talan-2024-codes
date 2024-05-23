from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_swagger_ui import get_swaggerui_blueprint
from PIL import Image, UnidentifiedImageError
import base64
import magic
import fitz  
from io import BytesIO
import docx
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

@app.route('/')
def hello_world():
    """
    A function that serves as the route handler for the root URL ("/").
    It returns a simple greeting message "Hello, World!".

    Parameters:
        None

    Returns:
        str: The greeting message "Hello, World!".
    """
    return 'Hello, World!'

@app.route('/image-to-base64', methods=['POST'])
def image_to_base64():
    """
    This function is a route handler for the '/image-to-base64' endpoint. It accepts a POST request and converts an uploaded image file to base64 format.

    Parameters:
        None

    Returns:
        - If the request is successful and an image file is provided:
            - A JSON response containing the base64 encoded image string.
            - HTTP status code 200.
        - If no image file is provided in the request:
            - A JSON response containing an error message.
            - HTTP status code 400.
        - If the provided file is not a valid image:
            - A JSON response containing an error message.
            - HTTP status code 400.
        - If any other exception occurs during the process:
            - A JSON response containing the error message.
            - HTTP status code 500.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    image_bytes = file.read()

    try:
        image = Image.open(BytesIO(image_bytes))
    except UnidentifiedImageError:
        return jsonify({'error': 'File is not a valid image'}), 400

    img_str = base64.b64encode(image_bytes).decode('utf-8')
    return jsonify({'base64': img_str})

@app.route('/detect-file-type', methods=['POST'])
def detect_file_type():
    """
    This function is a route handler for the '/detect-file-type' endpoint. It accepts a POST request and detects the file type of an uploaded file.

    Parameters:
        None

    Returns:
        - If the request is successful and a file is provided:
            - A JSON response containing the file type.
            - HTTP status code 200.
        - If no file is provided in the request:
            - A JSON response containing an error message.
            - HTTP status code 400.
        - If any other exception occurs during the process:
            - A JSON response containing the error message.
            - HTTP status code 500.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    file.seek(0)
    file_type = magic.from_buffer(file.read(1024), mime=True)
    return jsonify({'file_type': file_type})

@app.route('/pdf-to-images', methods=['POST'])
def pdf_to_images():
    if 'pdf' not in request.files or request.files['pdf'].filename == '' :
        return jsonify({'error': 'No PDF file provided'}), 400
    pdf_file = request.files['pdf']        
    try:      
        # Ensure the file is a PDF
        if not pdf_file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Invalid file format. Must be a PDF file'}), 400

        # Open PDF with fitz
        pdf_document = fitz.open(stream=pdf_file.read(), filetype='pdf')

        images = []
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            pix = page.get_pixmap()
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
            images.append(img_str)
        
        return jsonify({'images': images}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/docx-to-images', methods=['POST'])
def docx_to_images():
    """
    This function is a route handler for the '/docx-to-images' endpoint. It accepts a POST request and converts a DOCX file into a list of base64 encoded PNG images.

    Parameters:
        None

    Returns:
        - If the request is successful and a DOCX file is provided:
            - A JSON response containing a list of base64 encoded PNG images.
            - HTTP status code 200.
        - If no DOCX file is provided in the request:
            - A JSON response containing an error message.
            - HTTP status code 400.
        - If any other exception occurs during the process:
            - A JSON response containing the error message.
            - HTTP status code 500.
    """
    if 'docx' not in request.files:
        return jsonify({'error': 'No DOCX file provided'}), 400
    try:        
        file = request.files['docx']
        document = docx.Document(file)
        images = []
        for rel in document.part.rels.values():
            if "image" in rel.target_ref:
                image_bytes = rel.target_part.blob
                img_buffer = BytesIO()
                img = Image.open(BytesIO(image_bytes))
                img.save(img_buffer, format="PNG")
                img_str = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
                images.append(img_str)
        return jsonify({'images': images})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Swagger UI setup
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={  # Swagger UI config overrides
        'app_name': "HrDocumentAnalyzer"
    }
)

app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

if __name__ == '__main__':
    app.run(debug=True)