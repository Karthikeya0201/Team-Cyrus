from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.routes import resume

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint for health checks
@app.get("/")
async def root():
    return JSONResponse(
        content={"status": "healthy", "message": "CVCraft API is running"}
    )

# Include routers
# from app.api.v1 import users, auth
# app.include_router(auth.router, prefix=settings.API_V1_STR)
# app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(
    resume.router,
    prefix=f"{settings.API_V1_STR}/resume",
    tags=["resume"]
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.SERVER_HOST,
        port=settings.SERVER_PORT,
        reload=True
    )