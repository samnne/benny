from lib.gemini import client, model_str, config
from google.genai import types
from lib.utils import prepare_output


def parse_receipt(bytes):

    response = client.models.generate_content(
        model=model_str,
        contents=[
            types.Part.from_bytes(data=bytes, mime_type="image/jpeg"),
            "Describe what the receipt in the image says line by line.",
        ],
        config=config,
    )
    data_str: str | None = response.text

    if not data_str:
        return ""

    data = prepare_output(data_str)
    return data 

if __name__ == "__main__":
    file = open("./assets/receipt.jpg", "rb")
    bytes = file.read()
    parse_receipt(bytes)
    file.close()
