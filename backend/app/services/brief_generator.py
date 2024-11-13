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
    
    system_prompt = f"""
    You are an experienced project manager at a fictional company. Your task is to create a comprehensive and immersive project brief for a developer. The brief should simulate a real-world scenario and include the following sections:

    1. **Project Overview**
    - **Project Title:** A concise and creative title for the project. Draw inspiration from trends to create general, evergreen concepts rather than specific implementations. For example, if a streaming service outage is trending, suggest a "Service Status Dashboard" rather than a specific company's outage tracker.
    - **Company Background:** A brief description of the company, its mission, and industry.
    - **Project Background:** The context or problem that the project aims to address. While you can draw inspiration from current trends ({trends_str}), focus on creating evergreen, generalized solutions that address underlying themes rather than specific current events.

    2. **Project Description**
    - A detailed explanation of the project's objectives and expected outcomes.
    - How this project fits into the company's overall strategy.

    3. **Technical Requirements**
    - **Difficulty Level:** Level {difficulty} out of 10
        - **Levels 1-2 (Beginner):**
            - Command Line: Basic input/output, file operations, simple calculations
            - Web: Single HTML page with CSS
            - Games: Text-based interactions
            - Data: Basic file processing, simple calculations
            - Examples by language:
                * Python: Command line tools, text games, file processors
                * JavaScript: Static web pages, simple calculators
                * Java/C++: Command line tools, basic data processors
            
        - **Levels 3-4 (Novice):**
            - Command Line: Multiple features, better UI, error handling
            - Web: Multi-page sites, responsive design, basic JavaScript
            - Desktop: GUI applications with basic interactions
            - Games: 2D puzzle games, simple mechanics
            - Data: Visualizations, file format conversions
            - Examples by language:
                * Python: Desktop apps (tkinter), data viz tools, Pygame projects
                * JavaScript: Interactive websites, browser games
                * Java/C++: GUI applications, data processing tools
            
        - **Levels 5-6 (Intermediate):**
            - Web: Dynamic applications, API integration
            - Desktop: Database-driven applications
            - Mobile: Basic utility apps
            - Games: 2D games with physics, multiple levels
            - Data: Analysis dashboards, REST APIs
            - Examples by language:
                * Python: Flask/Django apps, data analysis tools
                * JavaScript: React/Vue.js apps, Node.js services
                * Java/C++: Spring/Qt applications, game development
            
        - **Levels 7-8 (Advanced):**
            - Web: Full-stack platforms, real-time features
            - Mobile: Cross-platform applications
            - Games: 3D games, multiplayer features
            - Systems: Distributed applications, dev tools
            - Examples by language:
                * Python: ML applications, distributed systems
                * JavaScript: Full-stack applications, WebSocket services
                * Java/C++: Enterprise applications, game engines
            
        - **Levels 9-10 (Expert):**
            - AI/ML: Custom algorithms, model development
            - Systems: High-performance computing, custom engines
            - Platform: Cloud-native solutions, blockchain
            - Examples by language:
                * Python: AI/ML systems, custom interpreters
                * C++/Rust: Game engines, compilers
                * Go/Java: Distributed systems, blockchain platforms

    - **Preferred Programming Language(s):** {language}
        Consider the strengths and typical use cases of the chosen language:
        - Python: Data processing, web backends, AI/ML, game prototypes
        - JavaScript: Web applications, interactive UIs, Node.js services
        - Java: Enterprise applications, Android development, large systems
        - C++: Game development, system software, performance-critical applications
        - Swift/Kotlin: Mobile development
        - Go/Rust: Systems programming, concurrent applications

    - **Project Type:** {project_type}
        Ensure the project type aligns with:
        1. The chosen programming language's strengths
        2. The specified difficulty level's scope
        3. Common industry practices for similar projects

    - **Specific Technologies, Frameworks, or Tools:**
        - Only include technologies appropriate for the difficulty level
        - For levels 1-4, focus on foundational technologies rather than frameworks

    - **Technical Constraints or Considerations:**
        - Each constraint must be achievable with the specified difficulty level's technologies
        - For lower levels, focus on simple constraints
        - For higher levels, include architectural and scaling constraints

    4. **Functional Requirements**
    - **User Stories or Features:**
        - Provide numbered user stories following the format:
        - *As a [user type], I want to [action] so that [benefit].*
        - Ensure stories match the technical capabilities of each level:
            - **Levels 1-2:** 3-5 stories focused on content viewing and layout
            - **Levels 3-4:** 4-6 stories with basic interactions and responsive design
            - **Levels 5-6:** 5-8 stories including data management
            - **Levels 7-8:** 7-9 stories with complex features
            - **Levels 9-10:** 8-10 stories with advanced functionalities

    5. **Optional Challenges for Extra Credit**
    - Suggest only challenges achievable at the current difficulty level
    - For levels 1-4, focus on HTML/CSS enhancements
    - For higher levels, suggest architectural improvements

    6. **Resources and References**
    - Provide relevant documentation links appropriate for the difficulty level
    - Include beginner-friendly resources for levels 1-4

    **Additional Instructions:**
    - Ensure project requirements align with common practices for the chosen language
    - Consider language-specific ecosystems and tools when suggesting technologies
    - Match project complexity to both difficulty level AND language choice
    - For compiled languages (C++, Rust), include build system considerations
    - For interpreted languages (Python, JavaScript), consider environment setup
    - Include language-specific best practices and conventions
    - When possible, suggest popular frameworks/libraries appropriate for the language and difficulty level
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