from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.brief_generator import generate_project_brief, get_trending_topics
from app.core.constants import DIFFICULTY_LEVELS

router = APIRouter()

class BriefRequest(BaseModel):
    difficulty: int
    language: str
    project_type: str
    use_trends: bool = True

class BriefResponse(BaseModel):
    content: str
    trending_topics: Optional[List[str]] = None
    
@router.post("/brief", response_model=BriefResponse)
async def create_brief(request: BriefRequest):
    """Generate a new project brief"""
    try:
        # Validate difficulty level
        if not 1 <= request.difficulty <= 10:
            raise HTTPException(
                status_code=400,
                detail="Difficulty level must be between 1 and 10"
            )
            
        # Get trending topics if requested
        trends = get_trending_topics() if request.use_trends else []
        
        # Generate the brief
        brief_content = generate_project_brief(
            request.difficulty,
            request.language,
            request.project_type,
            trends
        )
        
        return BriefResponse(
            content=brief_content,
            trending_topics=trends if request.use_trends else None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/project-types/{difficulty}")
async def get_project_types(difficulty: int):
    """Get available project types for a given difficulty level"""
    if not 1 <= difficulty <= 10:
        raise HTTPException(
            status_code=400,
            detail="Difficulty level must be between 1 and 10"
        )
    
    for level_range, types in DIFFICULTY_LEVELS.items():
        if difficulty in level_range:
            return {"project_types": types}
    
    raise HTTPException(status_code=400, detail="Invalid difficulty level")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}