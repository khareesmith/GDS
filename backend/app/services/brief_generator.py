from openai import OpenAI
from pytrends.request import TrendReq
from app.core.config import get_settings
from typing import List, Optional
import re

settings = get_settings()

# Initialize OpenAI client with API key from settings
client = OpenAI(api_key=settings.OPENAI_API_KEY)

def sanitize_input(user_input: str) -> str:
    """Remove any characters that are not alphanumeric, spaces, or basic punctuation"""
    return re.sub(r'[^\w\s,.\-]', '', user_input)

def get_trending_topics() -> List[str]:
    """Fetch trending topics from Google Trends"""
    try:
        pytrends = TrendReq(hl='en-US', tz=360)
        trending_searches_df = pytrends.trending_searches()
        trending_topics = trending_searches_df.iloc[:, 0].tolist()
        return trending_topics[:10]
    except Exception as e:
        print(f"Error fetching trends: {e}")
        return []

def generate_project_brief(
    difficulty: int,
    language: str,
    project_type: str,
    trends: Optional[List[str]] = None
) -> str:
    """Generate a project brief using OpenAI API"""
    # Convert trends list to string
    trends_str = ', '.join(trends) if trends else "generalized industry themes"
    
    
    # Adjust temperature based on difficulty
    model_temp = settings.MODEL_TEMP + ((difficulty - 1) * 0.05)
    
    # Your existing system prompt
    system_prompt = f"""
    You are an experienced project manager at a fictional company. Your task is to create a comprehensive and immersive project brief for a developer. The brief should simulate a real-world scenario and include the following sections:

    1. **Project Overview**
    - **Project Title:** A concise and creative title for the project.
    - **Company Background:** A brief description of the company, its mission, and industry.
    - **Project Background:** The context or problem that the project aims to address, incorporating one or more of the following generalized trending topics or niches: {trends_str}. {"Focus on broad themes suitable for a wide audience and avoid specific events or entities. You can mention specifics in the brief, but the project should not be tied to any specifics" if trends else ""}

    2. **Project Description**
    - A detailed explanation of the project's objectives and expected outcomes.
    - How this project fits into the company's overall strategy.

    3. **Technical Requirements**
    - **Difficulty Level:** Level {difficulty} out of 10
        - Levels 1-2 (Beginner): Projects should focus on fundamental concepts using simple project types appropriate for beginners, such as console applications or simple scripts. Even if the user specifies a more advanced project type, simplify it to match beginner skills.
        - Levels 3-4 (Novice): Introduce slightly more complex project types, like basic desktop applications or simple web pages without frameworks.
        - Levels 5-6 (Intermediate): Include standard project types, such as dynamic web applications using frameworks, simple mobile apps, or basic games.
        - Levels 7-8 (Advanced): Incorporate complex project types, like full-stack web applications, advanced games, or complex mobile applications.
        - Levels 9-10 (Expert): Focus on cutting-edge or highly complex project types, such as AI applications, highly optimized systems, or applications requiring advanced algorithms.

    - **Preferred Programming Language(s):** {language}
    - **Project Type:** {project_type}
        - **Adjust the project type as necessary to align with the specified difficulty level.** For lower difficulty levels, simplify the project type to match beginner capabilities.
        - **Important:** If the specified project type or preferred programming language is too advanced for the difficulty level, adjust them to match the user's skill level while keeping the spirit of their choice.


    - **Specific Technologies, Frameworks, or Tools:**
        - Ensure technologies are appropriate for the difficulty level.

    - **Technical Constraints or Considerations:**
        - Ensure that technical requirements are feasible for the specified difficulty level.

    4. **Functional Requirements**
    - **User Stories or Features:**
        - Provide numbered user stories following the format:
        - *As a [user type], I want to [action] so that [benefit].*
        - **For Level 1-2:** Include 3-5 simple user stories focusing on fundamental features.
        - **For Level 3-4:** Include 4-6 user stories introducing basic logic and data handling.
        - **For Level 5-6:** Include 5-8 user stories with moderate complexity and interactions.
        - **For Level 7-8:** Include 7-9 user stories with complex features and integrations.
        - **For Level 9-10:** Include 8-10 user stories encompassing advanced functionalities.

    5. **Optional Challenges for Extra Credit**
    - **For Level 1-2:** Simple enhancements that are appropriate for the level.
    - **For Level 3-4 and above:** Introduce more complex challenges appropriate to the level.

    6. **Resources and References**
    - Provide relevant links, documentation, or resources that might assist in development.

    **Additional Instructions:**

    - Use a professional and engaging tone appropriate for a real project brief.
    - Ensure the brief is tailored to the specified difficulty level, programming language, and project type.
    - **For lower difficulty levels, focus on simplicity and fundamental concepts, avoiding any advanced features or complex logic.**
    - **For higher difficulty levels, incorporate appropriate complexity, advanced concepts, and technologies.**
    - Keep the content clear, concise, and well-organized using Markdown formatting.
    - Avoid repetition and ensure all technical details are accurate and feasible.
    - Do not include any additional information beyond the specified sections. No additional content after the Resources and References secion. Keep the brief focused and avoid unnecessary or repetitive content.
    """
    
    try:
        response = client.chat.completions.create(
            model=settings.MODEL_VERSION,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': 'Please provide the project brief.'}
            ],
            temperature=model_temp,
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise Exception(f"Error generating brief: {e}")