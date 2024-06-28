from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
from PIL import Image, UnidentifiedImageError
import base64
import magic
import fitz  # PyMuPDF
from io import BytesIO
import docx
import uvicorn
import psutil


app = FastAPI(
    title="Upload Module API",
    description="A FastAPI application for file conversion and detection.",
    version="1.0.0",
)

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def measure_performance():
    cpu_usage = psutil.cpu_percent(interval=1)
    memory_usage = psutil.virtual_memory().percent
    return {"cpu_usage": cpu_usage, "memory_usage": memory_usage}


@app.get("/")
async def read_root():
    """
    A function that serves as the route handler for the root URL ("/").
    It returns a simple greeting message "Hello, World!".
    """
    return {"hello": "world"}


@app.post("/image-to-base64")
async def external_image_to_base64(image: UploadFile = File(...)):
    """
    Converts an uploaded image file to base64 format.
    """
    try:
        image_bytes = await image.read()
        Image.open(BytesIO(image_bytes))  # Validate image
        img_str = base64.b64encode(image_bytes).decode("utf-8")
        performance_metrics = measure_performance()
        return {"base64": img_str, "performance_metrics": performance_metrics}
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="File is not a valid image")


@app.post("/detect-file-type")
async def detect_file_type(file: UploadFile = File(...)):
    """
    Detects the file type of an uploaded file.
    """
    try:
        file_bytes = await file.read()
        file_type = magic.from_buffer(file_bytes[:1024], mime=True)
        performance_metrics = measure_performance()
        return {"file_type": file_type, "performance_metrics": performance_metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/pdf-to-images")
async def external_pdf_to_images(pdf: UploadFile = File(...)):
    """
    Converts a PDF file to a list of base64 encoded images.
    """
    if not pdf.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400, detail="Invalid file format. Must be a PDF file"
        )

    try:
        pdf_document = fitz.open(stream=await pdf.read(), filetype="pdf")
        images = []
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            pix = page.get_pixmap()
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            images.append(img_str)
        performance_metrics = measure_performance()
        return {"images": images, "performance_metrics": performance_metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/docx-to-images")
async def external_docx_to_images(docx_file: UploadFile = File(...)):
    """
    Converts a DOCX file into a list of base64 encoded images.
    """
    try:
        # Read the content of the uploaded file into memory
        content = await docx_file.read()
        document = docx.Document(BytesIO(content))
        images = []
        for rel in document.part.rels.values():
            if "image" in rel.target_ref:
                image_bytes = rel.target_part.blob
                img_buffer = BytesIO()
                img = Image.open(BytesIO(image_bytes))
                img.save(img_buffer, format="PNG")
                img_str = base64.b64encode(img_buffer.getvalue()).decode("utf-8")
                images.append(img_str)
        performance_metrics = measure_performance()
        return {"images": images, "performance_metrics": performance_metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/file-to-base64")
async def file_to_base64(file: UploadFile = File(...)):
    """
    Converts an uploaded file (image, DOCX, or PDF) into base64 encoded images.
    """
    try:
        file_extension = file.filename.lower().split(".")[-1]

        if file_extension == "pdf":
            response = await external_pdf_to_images(file)
        elif file_extension == "docx":
            response = await external_docx_to_images(file)
        elif file_extension in ["jpg", "jpeg", "png", "gif"]:
            response = await external_image_to_base64(file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")

        performance_metrics = measure_performance()
        response["performance_metrics"] = performance_metrics
        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
