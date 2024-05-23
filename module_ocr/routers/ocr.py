# -*- coding: utf-8 -*-

from fastapi import APIRouter, HTTPException, UploadFile, status, Depends
from models.OCRModel import *
from models.RestfulModel import *
from paddleocr import PaddleOCR
from utils.ImageHelper import base64_to_ndarray, bytes_to_ndarray
import requests
import os

router = APIRouter(prefix="/ocr", tags=["OCR"])


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


@router.post(
    "/predict-by-base64", response_model=RestfulModel, summary="Recognize Base64 data"
)
def predict_by_base64(base64model: Base64PostModel, language: str = "en"):
    ocr = get_ocr_instance(language)
    img = base64_to_ndarray(base64model.base64_str)
    result = ocr.ocr(img=img, cls=True)
    restfulModel = RestfulModel(
        resultcode=200, message="Success", data=result, cls=OCRModel
    )
    return restfulModel


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