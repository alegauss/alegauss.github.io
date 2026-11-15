/** AG22: development relationships, with repository evidence kept distinct from owner testimony. */
export interface MethodUse { application: string; tool: string; role: string; basis: "Repository evidence" | "Owner-confirmed"; source: string; reviewed: string }
export const METHOD_USES: MethodUse[] = [
  {"application": "modelado", "tool": "roadkeep", "role": "Planning and tracking the roadmap with agents.", "basis": "Repository evidence", "source": "https://github.com/alegauss/modelado/blob/9ab2cc8a627d7c9adbbacb2b4f5f13c5939528aa/roadkeep.toml", "reviewed": "2026-11-15"},
  {"application": "modelado", "tool": "winwright", "role": "Driving Windows UI tests and recording what the agent observed.", "basis": "Repository evidence", "source": "https://github.com/alegauss/modelado/blob/9ab2cc8a627d7c9adbbacb2b4f5f13c5939528aa/tests/Modelado.Cases/Modelado.Cases.csproj", "reviewed": "2026-11-15"},
  {"application": "modelado", "tool": "commitclerk", "role": "Supporting the commit workflow, as reported by the author.", "basis": "Owner-confirmed", "source": "https://chatgpt.com/share/6af9b90c-e054-83e9-974a-8df6f8e29ffa", "reviewed": "2026-11-15"},
  {"application": "revelei", "tool": "roadkeep", "role": "Planning and tracking the roadmap with agents.", "basis": "Repository evidence", "source": "https://github.com/alegauss/revelei/blob/b29d4e293a293ac5b15fdcd71edb61037c4c94ea/roadkeep.toml", "reviewed": "2026-11-15"},
  {"application": "revelei", "tool": "winwright", "role": "Driving Windows UI tests and recording what the agent observed.", "basis": "Repository evidence", "source": "https://github.com/alegauss/revelei/blob/b29d4e293a293ac5b15fdcd71edb61037c4c94ea/tests/Revelei.Cases/Revelei.Cases.csproj", "reviewed": "2026-11-15"},
  {"application": "revelei", "tool": "commitclerk", "role": "Supporting the commit workflow, as reported by the author.", "basis": "Owner-confirmed", "source": "https://chatgpt.com/share/6af9b90c-e054-83e9-974a-8df6f8e29ffa", "reviewed": "2026-11-15"},
]
export const METHOD_CYCLE = [
  { title: "Plan with roadkeep", text: "An agent files the work and tracks what remains through a governed roadmap." },
  { title: "Implement with a coding agent", text: "The agent changes the code while the person sets the scope and reviews the result." },
  { title: "Test Windows apps with winwright", text: "The agent drives the application and reports observed results, including checks that could not run." },
  { title: "Prepare commits with commitclerk", text: "The staged changes inform the commit message; a person remains responsible for what is committed." },
]
