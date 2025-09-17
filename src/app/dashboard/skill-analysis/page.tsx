import SkillAnalyzer from "./skill-analyzer";

export default function SkillAnalysisPage() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Skill Gap Analysis</h1>
          <p className="text-muted-foreground">
            Identify your skill gaps and get recommendations to get you ready for your dream role.
          </p>
        </div>
        <SkillAnalyzer />
      </div>
    );
  }