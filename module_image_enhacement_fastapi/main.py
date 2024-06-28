from typing import Dict, Union, List
import base64
from io import BytesIO
import asyncio
import concurrent.futures
from PIL import Image as PILImage
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.rotate import correct_image_orientation
from app.crop import crop_image
from app.text_guided import text_guided_enhance
from realesrgan_ncnn_py import Realesrgan
import tensorflow as tf
import uvicorn
from multiprocessing import Pool

print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices("GPU")))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

realesrgan = Realesrgan(gpuid=0)


@app.get("/")
async def hello():
    return {"message": "Hello from Module"}


class Base64Image(BaseModel):
    image_base64: str


class TextGuidedEnhance(BaseModel):
    text: str


@app.post("/crop/image")
async def crop_image_file(image: UploadFile = File(...)):
    if image.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    try:
        image_data = await image.read()
        cropped_image = await asyncio.to_thread(crop_image, image_data)
        return {"cropped_image": cropped_image}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to crop image: {str(e)}")


@app.post("/crop/base64")
async def crop_image_base64(data: Base64Image):
    try:
        cropped_image = await asyncio.to_thread(
            crop_image, base64.b64decode(data.image_base64)
        )
        return {"cropped_image": cropped_image}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to crop image: {str(e)}")


@app.post("/rotate/image")
async def rotate_image(image: UploadFile = File(...)):
    if image.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    try:
        image_data = await image.read()
        img = PILImage.open(BytesIO(image_data))
        corrected_image = await asyncio.to_thread(correct_image_orientation, img)
        if not corrected_image:
            raise HTTPException(status_code=500, detail="Image correction failed")

        output_io = BytesIO()
        await asyncio.to_thread(
            corrected_image.save, output_io, format="JPEG", quality=95
        )
        output_io.seek(0)
        output_base64 = base64.b64encode(output_io.getvalue()).decode("utf-8")

        return {"rotated_image": output_base64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/rotate/base64")
async def rotate_image_64(data: Base64Image):
    try:
        image_data = base64.b64decode(data.image_base64)
        img = PILImage.open(BytesIO(image_data))
        corrected_image = await asyncio.to_thread(correct_image_orientation, img)
        if not corrected_image:
            raise HTTPException(status_code=500, detail="Image correction failed")

        output_io = BytesIO()
        await asyncio.to_thread(
            corrected_image.save, output_io, format="JPEG", quality=95
        )
        output_io.seek(0)
        output_base64 = base64.b64encode(output_io.getvalue()).decode("utf-8")

        return {"rotated_image": output_base64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/enhance/base64")
async def enhance(data: Base64Image):
    try:
        image_data = base64.b64decode(data.image_base64)
        img = PILImage.open(BytesIO(image_data))
        enhanced_image = await asyncio.to_thread(realesrgan.process_pil, img)

        output_io = BytesIO()
        await asyncio.to_thread(
            enhanced_image.save, output_io, format="JPEG", quality=95
        )
        output_io.seek(0)
        output_base64 = base64.b64encode(output_io.getvalue()).decode("utf-8")

        return {"image": output_base64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/text-guided-enhance")
async def text_guided_enhance_endpoint(
    image: UploadFile = File(...), data: TextGuidedEnhance = Depends()
):
    if image.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    try:
        image_data = await image.read()
        enhanced_image = await asyncio.to_thread(
            text_guided_enhance, image_data, data.text
        )
        return {"enhanced_image": enhanced_image}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @app.post("/process-image")
# async def process_image(data: Base64Image):
#     try:
#         image_data = base64.b64decode(data.image_base64)
#         async with PILImage.open(BytesIO(image_data)) as img:
#             corrected_image = await asyncio.to_thread(correct_image_orientation, img)

#             if not corrected_image:
#                 raise HTTPException(status_code=500, detail="Image correction failed")

#             enhanced_image = await asyncio.to_thread(
#                 realesrgan.process_pil, corrected_image
#             )

#             output_io = BytesIO()
#             await asyncio.to_thread(
#                 enhanced_image.save, output_io, format="JPEG", quality=95
#             )
#             output_io.seek(0)
#             enhanced_base64 = base64.b64encode(output_io.getvalue()).decode("utf-8")

#             cropped_image = await asyncio.to_thread(crop_image, enhanced_base64)

#         return {"processed_image": cropped_image}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
