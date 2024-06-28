# -*- coding: utf-8 -*-

from fastapi import APIRouter, HTTPException, UploadFile, status, Depends
from models.OCRModel import *
from models.RestfulModel import *
from paddleocr import PaddleOCR
from utils.ImageHelper import base64_to_ndarray, bytes_to_ndarray
import requests
import os
import language_tool_python 
import arabic_reshaper
from bidi.algorithm import get_display

router = APIRouter(prefix="/ocr", tags=["OCR"])

tool = language_tool_python.LanguageTool("en-US")

def get_ocr_instance(language: str):
    return PaddleOCR(use_angle_cls=True, lang=language)


@router.get(
    "/predict-by-path", response_model=RestfulModel, summary="Recognize local image"
)
def predict_by_path(image_path: str, language: str = "en"):
    ocr = get_ocr_instance(language)
    result = ocr.ocr(image_path, cls=True)
    restfulModel = RestfulModel(
        resultcode=200, message="Success", data=result, cls=OCRModel
    )
    return restfulModel


def correct_arabic_text(text: str) -> str:
    reshaped_text = arabic_reshaper.reshape(text)
    return get_display(reshaped_text)


@router.post(
    "/predict-by-base64", response_model=RestfulModel, summary="Recognize Base64 data"
)
async def predict_by_base64(base64model: Base64PostModel, language: str = "en"):
    try:
        base64_string = base64model.base64_str
        print(f"Extracted Base64 string: {base64_string[:50]}...")

        ocr = get_ocr_instance(language)
        print(f"Initialized OCR model for language: {language}")

        img = base64_to_ndarray(base64_string)
        print(
            f"Converted Base64 to numpy array with shape: {img.shape} and dtype: {img.dtype}"
        )

        result = ocr.ocr(img=img, cls=True)
        print("Performed OCR on the image")

        corrected_texts = []

        for line in result:
            corrected_line = []
            print(f"Processing line: {line}")
            for text_info in line:
                text = text_info[1][0]
                print(f"Processing text: {text}")
                matches = tool.check(text)
                if len(matches) == 0:
                    verified_text = text
                else:
                    verified_text = tool.correct(text)
                    print(f"Corrected spelling errors: {verified_text}")
                if language == "ar":
                    verified_text = correct_arabic_text(verified_text)
                    print(f"Corrected Arabic text order: {verified_text}")
                corrected_line.append(verified_text)
            corrected_texts.append(corrected_line)
            print(f"Processed line successfully: {corrected_line}")

        structured_text = " ".join([" ".join(line) for line in corrected_texts])
        print(f"Combined corrected texts: {structured_text}")

        restfulModel = RestfulModel(
            resultcode=200, message="Success", data=structured_text
        )
        return restfulModel

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    except ValueError as ve:
        print(f"Value error: {ve}")
        raise HTTPException(status_code=400, detail=f"Value error: {ve}")
    except KeyError as ke:
        print(f"Key error: {ke}")
        raise HTTPException(status_code=400, detail=f"Key error: {ke}")


@router.post(
    "/predict-by-file", response_model=RestfulModel, summary="Recognize uploaded file"
)
async def predict_by_file(file: UploadFile, language: str = "en"):
    ocr = get_ocr_instance(language)
    restfulModel: RestfulModel = RestfulModel()
    if file.filename.endswith((".jpg", ".png")):  # Only process common image formats
        restfulModel.resultcode = 200
        restfulModel.message = file.filename
        file_data = file.file
        file_bytes = file_data.read()
        img = bytes_to_ndarray(file_bytes)
        result = ocr.ocr(img=img, cls=True)
        restfulModel.data = result
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload .jpg or .png format images",
        )
    return restfulModel


@router.get(
    "/predict-by-url", response_model=RestfulModel, summary="Recognize image URL"
)
async def predict_by_url(imageUrl: str, language: str = "en"):
    ocr = get_ocr_instance(language)
    restfulModel: RestfulModel = RestfulModel()
    response = requests.get(imageUrl)
    image_bytes = response.content
    if image_bytes.startswith(b"\xff\xd8\xff") or image_bytes.startswith(
        b"\x89PNG\r\n\x1a\n"
    ):  # Only process common image formats (jpg / png)
        restfulModel.resultcode = 200
        img = bytes_to_ndarray(image_bytes)
        result = ocr.ocr(img=img, cls=True)
        restfulModel.data = result
        restfulModel.message = "Success"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload .jpg or .png format images",
        )
    return restfulModel
