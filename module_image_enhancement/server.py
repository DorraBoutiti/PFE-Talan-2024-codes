from flask import Flask, request, jsonify, send_file
from flask_restful import Api, Resource
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
from crop import crop_image
from rotate import correct_image_orientation
from enhance_quality import enhance_image
from text_guided import text_guided_enhance
import base64
import io
from PIL import Image
from PIL import Image as PILImage 
from io import BytesIO
from realesrgan_ncnn_py import Realesrgan


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

realesrgan = Realesrgan(gpuid=0)

@app.route('/')
def hello():
    return 'Hello from Module'

@app.route('/crop/image', methods=['POST'])
def crop_image_file():
    image_file = request.files.get('image')
    
    if not image_file:
        return jsonify({"error": "Image file required"}), 400

    try:
        cropped_image = crop_image(image_file=image_file)
        return jsonify({"cropped_image": cropped_image})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to crop image: {str(e)}"}), 500

@app.route('/crop/base64', methods=['POST'])
def crop_image_base64():
    if not request.is_json:
        return jsonify({"error": "Invalid content type"}), 400

    image_base64 = request.json.get('image_base64')
    
    if not image_base64:
        return jsonify({"error": "Base64 string required"}), 400

    try:
        cropped_image = crop_image(image_base64=image_base64)
        return jsonify({"cropped_image": cropped_image})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to crop image: {str(e)}"}), 500

@app.route('/rotate/image', methods=['POST'])
def rotate_image():
    if 'image' not in request.files:
        return jsonify({"error": "Image required"}), 400

    image_file = request.files['image']

    try:
        # Open the image file
        image = PILImage.open(image_file.stream)
        
        # Correct the image orientation
        corrected_image = correct_image_orientation(image)
        
        if corrected_image is None:
            return jsonify({"error": "Image correction failed"}), 500
        
        # Save the corrected image to a BytesIO object
        output_io = BytesIO()
        corrected_image.save(output_io, format='JPEG', quality=95)
        output_io.seek(0)
        
        # Encode the corrected image in base64
        output_base64 = base64.b64encode(output_io.getvalue()).decode('utf-8')
        
        return jsonify({"rotated_image": output_base64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/rotate/base64', methods=['POST'])
def rotate_image_64():
    if 'image' not in request.json:
        return jsonify({"error": "Image required"}), 400

    image_data = request.json['image']

    try:
        # Decode the base64 string
        image_data = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_data))

        # Correct the image orientation
        corrected_image = correct_image_orientation(image)
        
        if corrected_image is None:
            return jsonify({"error": "Image correction failed"}), 500
        
        # Save the corrected image to a BytesIO object
        output_io = BytesIO()
        corrected_image.save(output_io, format='JPEG', quality=95)
        output_io.seek(0)
        
        # Encode the corrected image in base64
        output_base64 = base64.b64encode(output_io.getvalue()).decode('utf-8')
        
        return jsonify({"rotated_image": output_base64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/enhance/base64', methods=['POST'])
def enhance():
    if 'image' not in request.json:
        return jsonify({"error": "Image required"}), 400

    image_data = request.json['image']

    try:
        # Decode the base64 string
        image_data = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_data))

        # Process the image
        image = realesrgan.process_pil(image)

        # Save the output image to a BytesIO object
        output_io = io.BytesIO()
        image.save(output_io, format='JPEG', quality=95)
        output_io.seek(0)

        # Encode the output image to base64
        output_base64 = base64.b64encode(output_io.getvalue()).decode('utf-8')

        return jsonify({"image": output_base64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/text-guided-enhance', methods=['POST'])
def text_guided():
    if 'image' not in request.files or 'text' not in request.json:
        return jsonify({"error": "Image and text required"}), 400

    image_file = request.files.get('image')
    if image_file is None:
        return jsonify({"error": "Image required"}), 400

    text = request.json.get('text')
    if text is None:
        return jsonify({"error": "Text required"}), 400

    try:
        enhanced_image = text_guided_enhance(image_file, text)
        return jsonify({"enhanced_image": enhanced_image})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



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
