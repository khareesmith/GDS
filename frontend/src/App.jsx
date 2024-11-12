import React from 'react';
import BriefGenerator from './components/BriefGenerator';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Go Develop Something</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <BriefGenerator />
      </main>
      
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Go Develop Something. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;