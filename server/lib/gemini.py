from google import genai
from google.genai import types
from dotenv import load_dotenv

from core.config import model_str, config
from typing import Any
from core.config import settings
from google.genai.client import DebugConfig
from lib.utils import prepare_output

load_dotenv()


class Client(genai.Client):
    def __init__(
        self,
        *,
        enterprise: bool | None = None,
        vertexai: bool | None = None,
        api_key: str | None = None,
        credentials: Any | None = None,
        project: str | None = None,
        location: str | None = None,
        debug_config: DebugConfig | None = None,
        http_options: types.HttpOptions | types.HttpOptionsDict | None = None
    ):
        super().__init__(
            enterprise=enterprise,
            vertexai=vertexai,
            api_key=settings.GOOGLE_GEMINI_API_KEY,
            credentials=credentials,
            project=project,
            location=location,
            debug_config=debug_config,
            http_options=http_options,
        )


# initializes client TODO: move to active sessions array to help performance.
client = Client() 


"""
Implimenting active sessions

SERVER:

active_session = []
with each Session carrying its own client instance

Session class:
  client: Gemini Client
  client_id: random unique ID or JWT token that gets sent to client
             ONLY accessible by the client so each user gets their own session 
  expires: 30 minute time to life timer

"""



def parse_receipt(bytes: bytes):
    """
    Calls Gemini to parse a receipt given bytes from a user image

    Params: 
    @bytes -> the file bytes 

    Returns: 
    data -> python object of model response
    | None when model encounters an error
    """
    try:

        response = client.models.generate_content(
            model=model_str,
            contents=[
                types.Part.from_bytes(data=bytes, mime_type="image/jpeg"),
                "Describe what the receipt in the image says line by line.",
            ],
            config=config,
        )
        data_str: str | None = response.text

        data = prepare_output(data_str)

        return data
    except Exception as e:
        print(e)
        return None
