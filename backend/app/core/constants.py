DIFFICULTY_LEVELS = {
    # Beginner Level (1-2)
    range(1, 3): [
        'static webpage',              # Great for HTML/CSS
        'command line tool',           # Good for Python/Java/C++
        'text-based game',             # Fun for Python/Java beginners
        'data processor',              # Suits Python/Java/C++
        'file organizer',              # Good for Python/JavaScript/C++
        'calculator application'        # Works with any language
    ],
    
    # Novice Level (3-4)
    range(3, 5): [
        'portfolio website',           # HTML/CSS/JS
        'desktop utility app',         # Python (tkinter)/Java (Swing)/C++ (Qt)
        '2D puzzle game',              # Python (Pygame)/JavaScript/Java
        'data visualization tool',     # Python/JavaScript/R
        'automation script',           # Python/JavaScript/Shell
        'simple API client'            # Any language with HTTP capabilities
    ],
    
    # Intermediate Level (5-6)
    range(5, 7): [
        'dynamic web application',     # JavaScript/Python/PHP
        'database management tool',    # Any language with DB support
        '2D platformer game',          # Python/JavaScript/C++
        'mobile utility app',          # Java/Kotlin/Swift
        'data analysis dashboard',     # Python/R/JavaScript
        'REST API service'             # Python/Node.js/Java/C#
    ],
    
    # Advanced Level (7-8)
    range(7, 9): [
        'full-stack web platform',     # Any web stack
        'real-time chat application',  # Any language with WebSocket support
        '3D game',                     # Unity(C#)/Unreal(C++)/Python
        'cross-platform mobile app',   # React Native/Flutter
        'distributed system',          # Go/Java/Rust
        'dev tools application'        # Any language
    ],
    
    # Expert Level (9-10)
    range(9, 11): [
        'AI/ML application',           # Python/R/Julia
        'game engine',                 # C++/Rust/C#
        'high-performance system',     # C++/Rust/Go
        'cloud-native platform',       # Any cloud-suitable language
        'blockchain application',      # Solidity/Rust/Go
        'compiler/interpreter'         # C++/Rust/Python
    ]
}