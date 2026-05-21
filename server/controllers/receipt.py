from fastapi import APIRouter
from lib.gemini import parse_receipt

router = APIRouter(
    prefix="/api/receipt",
    tags=["api", "receipt"],
    responses={404: {"description": "not found"}},
)


@router.get("/")
async def parse_receipt_route():
    file = open("./assets/receipt.jpg", "rb")
    bytes = file.read()
    response = parse_receipt(bytes)

    file.close()

    return {
        "data": response,
        "success": True,
    }
