
import React from 'react';

const DocumentationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const sections = [
    {
      title: "1. Problem Statement",
      content: "Traditional mental health support systems face significant barriers, including high costs, social stigma, and lack of 24/7 availability. There is a critical 'treatment gap' where individuals experiencing mild to moderate emotional distress lack an immediate, non-judgmental outlet for grounding and expression. MindfulBot addresses this by providing an AI-driven, accessible, and empathetic companion capable of immediate crisis detection and emotional support."
    },
    {
      title: "2. Literature Survey",
      content: "Current research in Digital Therapeutics (DTx) indicates that AI-based Conversational Agents (CAs) using Cognitive Behavioral Therapy (CBT) techniques can effectively reduce symptoms of anxiety and depression. While early chatbots relied on rigid decision trees, Large Language Models (LLMs) like Gemini Pro offer 'N-shot' reasoning and nuanced empathy. Studies suggest that 'Relational Agents'—bots that build a rapport—significantly increase user adherence to wellness exercises compared to static apps."
    },
    {
      title: "3. Proposed Architecture",
      content: "MindfulBot employs a Layered MERN (Model-View-Controller-Service) architecture to ensure separation of concerns:\n\n• View Layer (React): Reactive UI using Tailwind CSS for a calming aesthetic.\n• API Client Layer: Centralized service (api.ts) to abstract 'backend' communication.\n• Controller Layer (Node/Express Simulation): Orchestrates business logic, calling analysis utils before AI services.\n• Service Layer (Gemini SDK): Manages prompt engineering and LLM lifecycle.\n• Utils Layer: Independent modules for keyword-based Crisis Detection and Emotion Classification."
    },
    {
      title: "4. System Workflow",
      content: "1. User Input: Message is captured via the React frontend.\n2. Pre-processing: Text is analyzed for Crisis Keywords. If detected, the AI is bypassed for a hard-coded Emergency Response.\n3. Contextual Analysis: Sentiment is classified into categories (Happy, Sad, etc.).\n4. AI Generation: A specialized prompt (System Instruction + Emotion Context + History) is sent to Gemini-3-Flash.\n5. Post-processing: The response is sanitized and persisted to the Database (MongoDB Schema).\n6. UI Update: The message is rendered with appropriate emotional badges and grounding prompts."
    },
    {
      title: "5. Data Flow Diagram (DFD)",
      content: "[User] -> (UI Component) -> (API Service) -> [Crisis/Emotion Utils]\n                                        |\n                                        v\n[Database] <- (Mongoose Controller) <- (Gemini AI Service) -> [Google GenAI API]"
    },
    {
      title: "6. Future Enhancements",
      content: "• Multi-modal Support: Using Gemini-2.5-Flash-Native-Audio for real-time voice conversations.\n• Human-in-the-loop: Integration with professional therapist dashboards for high-risk escalation.\n• Wearable Integration: Correlating heart rate variability (HRV) with emotional logs for deeper insights.\n• Long-term Memory: Implementing Vector Embeddings (RAG) to remember user history across months."
    },
    {
      title: "7. Limitations",
      content: "• Non-Clinical: Not a replacement for psychiatric diagnosis or medical treatment.\n• LLM Hallucinations: Potential for AI to provide factually incorrect grounding techniques if not strictly constrained.\n• Internet Dependency: Requires stable connectivity for LLM processing.\n• Privacy: While data is persisted, true HIPAA-compliance requires specialized encryption and auditing beyond a standard MERN boilerplate."
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      <div className="p-6 max-w-4xl mx-auto w-full space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Technical Documentation</h2>
            <p className="text-sm text-slate-500">System Architecture & Project Specifications</p>
          </div>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-white text-slate-600 font-semibold rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Back to App
          </button>
        </div>

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-emerald-700 mb-4">{section.title}</h3>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentationView;
