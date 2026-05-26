import time
from fastapi import FastAPI, Request
from api import receipt
from core.security import create_access_token
from core.middleware import ValidateSession
app = FastAPI()


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


app.add_middleware(ValidateSession)

app.include_router(receipt.router)

@app.get("/")
async def main():
    token = await create_access_token(sub="123", scopes="user")
   
    return {"message": "Welcome to the Benny API!", "token": token}
