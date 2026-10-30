/* ---------------------------------------------------------------
   The catalogue — the single source of truth for every project.
   The home page, the line and product pages, the footer index, the
   sitemap, llms.txt, the OG cards and the published projects.json
   are all built from this list, so adding a project is one entry.

   Two rules an entry has to follow:

   1. Casing of `name` is decided by the project, not by house style.
      Lower case is reserved for a name you literally invoke — in a
      shell or a csproj — and it is then spelled exactly as invoked:
      roadkeep, commitclerk, winwright, polyweave.
      Everything else is Title Case and matches the project's own site.
   2. `lines` is where a visitor looks for it (see lines.ts); a project
      may sit in two. `group` is the old format track and survives only
      because other sites read it from projects.json.

   Order is editorial: it is the order inside each line.

   `site`, `shot` and `logo` are written relative to the hub's root,
   exactly as the published projects.json has always carried them, and
   made absolute where a page links them (see links.ts).
   --------------------------------------------------------------- */

import type { LineId } from "./lines.ts"

export interface Accent {
  /** "r,g,b", for the tints. */
  rgb: string
  /** The readable shade on the dark ground. */
  bright: string
}

export interface InstallStep {
  label: string
  command: string
}

export interface Project {
  /** The slug of /products/<id>/ — the repository's name. */
  id: string
  name: string
  group: "apps" | "cli" | "measured"
  lines: LineId[]
  kind: string
  blurb: string
  pitch: string
  shot?: string
  cta?: string
  tags: string[]
  site: string
  repo: string
  accent: Accent
  logo?: string
  mark?: string
  licence: string
  platform: string
  install: InstallStep[]
  /** A releases page, where the product ships a binary. */
  download?: string
  docs?: string
  /** Where the build reads the roadkeep files and the public numbers from. */
  source: { repo: string; ref: string }
  pypi?: string
  /** The product site publishes no sitemap.xml of its own, so robots.txt names none. */
  noSitemap?: true
}

export const PROJECTS: Project[] = [
  {
    id: "claude-tray",
    name: "Claude Code Tray",
    group: "apps",
    lines: ["windows", "workbench"],
    kind: "Windows · Tray app",
    blurb: "Your Claude Code rate-limit percentage, always in the tray, as a crisp DPI-aware icon.",
    pitch: "Claude Code will tell you your rate-limit percentage if you stop and ask it. This puts the number where you already glance: a native tray icon that redraws itself crisply at any DPI and updates on its own. It reads the session files already on your disk, so there is no account and no service.",
    shot: "claude-tray/og.png",
    tags: [".NET 10", "Windows 10 / 11", "Apache 2.0"],
    site: "claude-tray/",
    repo: "https://github.com/alegauss/claude-tray",
    accent: { rgb: "217,119,87", bright: "#E89070" },
    logo: "claude-tray/logo.png",
    licence: "Apache-2.0",
    platform: "Windows 10 / 11",
    install: [
      { label: "winget", command: "winget install alegauss.ClaudeCodeTray" },
    ],
    download: "https://github.com/alegauss/claude-tray/releases/latest",
    source: { repo: "claude-tray", ref: "HEAD" },
  },
  {
    id: "freeharbor",
    name: "FreeHarbor",
    group: "apps",
    lines: ["windows"],
    kind: "Windows · Desktop app",
    blurb: "Docker on Windows without Docker Desktop: upstream Moby in a WSL2 distro it owns, on the pipe your tools already look for.",
    pitch: "Docker Desktop charges a licence fee for what is, underneath, an open engine. FreeHarbor runs upstream Moby in a WSL2 distro it owns and exposes it on the docker_engine pipe your tools already look for, so nothing in your setup has to know it changed. One window, your containers, no subscription.",
    shot: "freeharbor/og.png",
    tags: [".NET 10", "In development", "Apache 2.0"],
    site: "freeharbor/",
    repo: "https://github.com/alegauss/freeharbor",
    accent: { rgb: "46,155,214", bright: "#67C3F2" },
    logo: "freeharbor/logo.svg",
    licence: "Apache-2.0",
    platform: "Windows 10 2004 or later, 64-bit",
    install: [],
    download: "https://github.com/alegauss/freeharbor/releases/latest",
    source: { repo: "freeharbor", ref: "HEAD" },
  },
  {
    id: "pportal",
    name: "PPortal",
    group: "apps",
    lines: ["windows"],
    kind: "Windows · Desktop app",
    blurb: "PlayStation Remote Play as a real Windows app — ten-bit colour, hardware decode on the card you already have, and no setup on first run.",
    pitch: "Sony ships Remote Play for Windows as an afterthought. This is what it should have been: WPF on the system Fluent theme, ten-bit colour composed by DirectComposition, and hardware decode on the card the machine already has. It reads the consoles and pairings you set up before, so the first run is not a setup.",
    shot: "pportal/og.png",
    cta: "Open the site",
    tags: [".NET 10", "Windows 10 / 11", "AGPL-3.0"],
    site: "pportal/",
    repo: "https://github.com/alegauss/pportal",
    accent: { rgb: "91,108,249", bright: "#8f9dff" },
    logo: "pportal/logo.svg",
    licence: "AGPL-3.0",
    platform: "Windows 10 / 11, x64",
    install: [],
    download: "https://github.com/alegauss/pportal/releases/latest",
    docs: "pportal/docs/",
    source: { repo: "pportal", ref: "HEAD" },
  },
  {
    id: "quickshell",
    name: "Quickshell",
    group: "apps",
    lines: ["windows"],
    kind: "Windows · SSH client",
    blurb: "SSH on Windows without the suite around it: the terminal grid drawn on the GPU, and a live prompt in under 400 ms.",
    pitch: "A native Windows SSH client that draws the terminal grid on the GPU: one instanced draw call per frame, none at all while nothing changes, and a cold start to a live prompt in under 400 ms. Sessions, keys, SFTP and port forwards, with your own known_hosts and OpenSSH agent, and nothing bolted on beside them.",
    shot: "quickshell/og.png",
    tags: [".NET 10", "In development", "Windows 10 / 11"],
    site: "quickshell/",
    repo: "https://github.com/alegauss/quickshell",
    accent: { rgb: "124,92,245", bright: "#a78bfa" },
    logo: "quickshell/logo.svg",
    licence: "MIT",
    platform: "Windows 10 / 11",
    install: [
      { label: "Install for yourself", command: "quickshell.exe --install" },
      { label: "Import from MobaXterm", command: "quickshell.exe --import" },
    ],
    docs: "https://github.com/alegauss/quickshell/blob/main/docs/INSTALL.md",
    source: { repo: "quickshell", ref: "HEAD" },
  },
  {
    id: "modelado",
    name: "Modelado",
    group: "apps",
    lines: ["windows"],
    kind: "Windows · Desktop app",
    blurb: "A photo becomes a 3D object or a relief, ready to print, with the AI models running on your own PC and nothing uploaded.",
    pitch: "Turning a photo into a 3D model usually means uploading it to a service and paying per mesh. Modelado runs open models on your own GPU or CPU instead: TripoSR for a closed object with sides and back, Depth Anything for a relief with a base for the printer. It then simplifies, smooths and fills holes in the mesh, sharpens the texture, and saves GLB, OBJ, STL or PLY.",
    shot: "modelado/og.png",
    tags: [".NET 10", "ONNX Runtime", "Windows 10 / 11"],
    site: "modelado/",
    repo: "https://github.com/alegauss/modelado",
    accent: { rgb: "91,155,230", bright: "#8DBBF0" },
    logo: "modelado/icon.svg",
    licence: "Apache-2.0",
    platform: "Windows 10 / 11, x64",
    install: [],
    download: "https://github.com/alegauss/modelado/releases/latest",
    source: { repo: "modelado", ref: "HEAD" },
  },
  {
    id: "revelei",
    name: "Revelei",
    group: "apps",
    lines: ["windows"],
    kind: "Windows · Desktop app",
    blurb: "Upscale, restore faces, remove the background and clean up noise in a photo, with AI that runs on your own PC.",
    pitch: "Most AI photo tools upload the picture and hand back the result. Revelei runs the models on your own machine, on the GPU through DirectML or on the CPU: Real-ESRGAN to upscale 2× and 4×, GFPGAN to restore faces, RMBG with ViTMatte to cut out the background, and SCUNet to remove noise. Every model is checked against its SHA-256, and the photo never leaves the PC.",
    shot: "revelei/og.png",
    tags: [".NET 10", "Windows ML", "Windows 10 / 11"],
    site: "revelei/",
    repo: "https://github.com/alegauss/revelei",
    accent: { rgb: "166,75,46", bright: "#F3B48F" },
    logo: "revelei/icon.svg",
    licence: "Apache-2.0",
    platform: "Windows 10 1903 or later / 11, x64",
    install: [],
    download: "https://github.com/alegauss/revelei/releases/latest",
    source: { repo: "revelei", ref: "HEAD" },
  },
  {
    id: "roadkeep",
    name: "roadkeep",
    group: "cli",
    lines: ["workbench"],
    kind: "Docs · CLI",
    blurb: "Owns the writes to your ROADMAP, CHANGELOG and IMPROVEMENTS, so the format is a schema at insertion instead of a convention you remember.",
    pitch: "A ROADMAP and a CHANGELOG are formats held together by convention, so they drift the moment someone is in a hurry — or the moment an agent writes to them. roadkeep owns the writes: an entry goes in through a command that checks its shape at the point of insertion, which makes the file a schema rather than a habit. Its desktop app reads every backlog on the machine at once.",
    shot: "roadkeep/assets/og.png",
    tags: ["Python ≥3.11", "Claude Code plugin", "Zero deps"],
    site: "roadkeep/",
    repo: "https://github.com/alegauss/roadkeep",
    accent: { rgb: "148,163,184", bright: "#cbd5e1" },
    mark: '<svg viewBox="0 0 160 160" aria-hidden="true"><rect fill="#cbd5e1" x="24" y="34" width="46" height="12" rx="6"/><rect fill="#cbd5e1" x="24" y="62" width="72" height="12" rx="6"/><rect fill="#cbd5e1" x="24" y="90" width="58" height="12" rx="6"/><rect fill="#cbd5e1" x="24" y="118" width="90" height="12" rx="6"/><rect fill="#f59e0b" x="120" y="22" width="8" height="116" rx="4"/></svg>',
    licence: "Apache-2.0",
    platform: "Python ≥3.11",
    install: [
      { label: "uvx", command: "uvx roadkeep lint" },
      { label: "pip", command: "pip install roadkeep" },
    ],
    docs: "roadkeep/docs/",
    pypi: "roadkeep",
    source: { repo: "roadkeep", ref: "HEAD" },
  },
  {
    id: "commitclerk",
    name: "commitclerk",
    group: "cli",
    lines: ["workbench"],
    kind: "Git · CLI",
    blurb: "Reads your staged diff, asks an LLM for a Conventional Commits message, shows it to you, and commits.",
    pitch: "One command between your staged diff and a commit. It reads the diff, asks an LLM for a Conventional Commits message, shows it to you, and commits once you agree. About 230 lines in a single file, so you can read the whole thing before trusting it with your history.",
    shot: "commitclerk/og.png",
    tags: ["~230 lines", "One file", "Apache 2.0"],
    site: "commitclerk/",
    repo: "https://github.com/alegauss/commitclerk",
    accent: { rgb: "233,163,58", bright: "#F7BE63" },
    logo: "commitclerk/logo.png",
    licence: "Apache-2.0",
    platform: "Python 3.8+",
    install: [
      { label: "pipx", command: "pipx install commitclerk" },
      { label: "pip", command: "pip install commitclerk" },
    ],
    pypi: "commitclerk",
    source: { repo: "commitclerk", ref: "HEAD" },
  },
  {
    id: "winwright",
    name: "winwright",
    group: "cli",
    lines: ["workbench"],
    kind: "Testing · .NET library",
    blurb: "Drives a Windows desktop app from a test — four verdicts rather than two, so a check that never ran never reads as one that passed.",
    pitch: "Testing a Windows desktop app usually means a framework that reports pass or fail and leaves you to guess which one you got. winwright reports four verdicts, so a check that could not run is never filed as one that passed, and the test tells you what it actually observed rather than what it hoped for.",
    shot: "winwright/og.png",
    tags: [".NET 10", "Windows only", "Zero deps"],
    site: "winwright/",
    repo: "https://github.com/alegauss/winwright",
    accent: { rgb: "111,92,240", bright: "#a396ff" },
    logo: "winwright/logo.svg",
    licence: "Apache-2.0",
    platform: "Windows, .NET 10",
    install: [
      { label: "NuGet", command: "<PackageReference Include=\"Winwright\" Version=\"1.1.3\" />" },
    ],
    docs: "winwright/docs/",
    source: { repo: "winwright", ref: "HEAD" },
  },
  {
    id: "polyweave",
    name: "polyweave",
    group: "cli",
    lines: ["workbench"],
    kind: "3D · Claude Code plugin",
    blurb: "Makes 3D assets by declaring what they must satisfy and searching for the parameters that do, on Blender, Godot and a mesh service.",
    pitch: "Asking for a 3D asset usually means tweaking sliders until it looks right. polyweave has you declare what the asset has to satisfy instead, then searches for the parameters that satisfy it, on top of Blender, Godot and a generative mesh service. Every render asserts its own output and records what made it, and it all runs on your machine, against files in your own repository.",
    shot: "polyweave/og.png",
    tags: ["Python ≥3.11", "Claude Code plugin", "Blender · Godot"],
    site: "polyweave/",
    repo: "https://github.com/alegauss/polyweave",
    accent: { rgb: "33,193,166", bright: "#5fe0c9" },
    logo: "polyweave/logo.svg",
    licence: "MIT",
    platform: "Python 3.11",
    install: [
      { label: "pip", command: "pip install git+https://github.com/alegauss/polyweave" },
    ],
    source: { repo: "polyweave", ref: "HEAD" },
  },
  {
    id: "piano",
    name: "Piano",
    group: "apps",
    lines: ["workbench"],
    kind: "Music · Desktop app",
    blurb: "A piano Claude Code can write scores for, play and teach from: the notes fall onto the keys and you learn to play them.",
    pitch: "A desktop piano built to be driven from Claude Code. Its plugin brings an MCP server that writes, checks and keeps scores, then opens the app to play them: the notes fall onto the keyboard, and practice mode waits for you on MIDI or the computer keys, loops a bar and says how each one went.",
    shot: "piano/og.png",
    tags: ["Electron", "In development", "Claude Code plugin"],
    site: "piano/",
    repo: "https://github.com/alegauss/piano",
    accent: { rgb: "53,182,240", bright: "#7fd0f5" },
    logo: "logos/piano.png",
    licence: "MIT",
    platform: "Windows, macOS and Linux",
    install: [
      { label: "From source", command: "git clone https://github.com/alegauss/piano.git\ncd piano\nnpm ci\nnpm run dev" },
    ],
    download: "https://github.com/alegauss/piano/releases/latest",
    source: { repo: "piano", ref: "HEAD" },
  },
  {
    id: "mini-gpt",
    name: "Mini GPT",
    group: "measured",
    lines: ["lab"],
    kind: "Java · Teaching project",
    blurb: "A character-level GPT written from scratch in plain Java with no ML library at all — bigrams, then backprop by hand, then a small transformer.",
    pitch: "A character-level GPT written from scratch in plain Java, with no ML library at all: counting bigrams first, then backpropagation derived by hand, then a small transformer. The course is in Portuguese, with the maths on screen and four demos that run in the browser.",
    shot: "mini-gpt/og.png",
    cta: "Start the course",
    tags: ["Java 21", "No ML libraries", "In Portuguese"],
    site: "mini-gpt/",
    repo: "https://github.com/alegauss/mini-gpt",
    accent: { rgb: "109,74,255", bright: "#8b6bff" },
    logo: "mini-gpt/logo.svg",
    licence: "Apache-2.0",
    platform: "JDK 21+ and Maven 3.9+",
    install: [
      { label: "Build", command: "mvn -q package -DskipTests" },
      { label: "Run", command: "java -jar target/mini-gpt-java.jar train --model bigram" },
    ],
    source: { repo: "mini-gpt", ref: "HEAD" },
  },
  {
    id: "claude-code-usage",
    name: "Usage Simulator",
    group: "measured",
    lines: ["lab"],
    kind: "Web · Cost model",
    blurb: "What a Claude Code task really costs, and how far each plan carries you — every coefficient measured from real session transcripts.",
    pitch: "Anthropic publishes limits, not the cost of a task. This model puts a number on both: what a given Claude Code task consumes, and how far each plan carries you at that rate. Every coefficient in it was measured from real session transcripts rather than assumed, and every input is yours to change.",
    shot: "claude-code-usage/og.png",
    cta: "Open the model",
    tags: ["One HTML file", "Runs offline", "Apache 2.0"],
    site: "claude-code-usage/",
    repo: "https://github.com/alegauss/claude-code-usage",
    accent: { rgb: "42,120,214", bright: "#5598e7" },
    mark: '<svg viewBox="0 0 160 160" aria-hidden="true"><rect fill="#2a78d6" x="30" y="86" width="24" height="46" rx="7"/><rect fill="#5598e7" x="68" y="56" width="24" height="76" rx="7"/><rect fill="#9ec5f4" x="106" y="26" width="24" height="106" rx="7"/></svg>',
    licence: "Apache-2.0",
    platform: "Any browser",
    install: [],
    source: { repo: "claude-code-usage", ref: "HEAD" },
  },
  {
    id: "claude-code-time-study",
    name: "Time Study",
    group: "measured",
    lines: ["lab"],
    kind: "Report · Time analysis",
    blurb: "Where the hours actually went on an AI-assisted project, attributed from session records and git history rather than recalled.",
    pitch: "Everyone has an opinion about how much time AI-assisted development saves, and almost nobody kept records. This attributes every hour of one project from session logs and git history, then shows the counterfactual as two adjustable models instead of asserting a single figure you would have to take on trust.",
    shot: "claude-code-time-study/og.png",
    cta: "Read the report",
    tags: ["Logs + git", "One developer", "Assumptions shown"],
    site: "claude-code-time-study/",
    repo: "https://github.com/alegauss/claude-code-time-study",
    accent: { rgb: "47,184,148", bright: "#5BD4B4" },
    mark: '<svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="50" fill="none" stroke="#5BD4B4" stroke-width="12"/><path d="M80 48 V82 H106" fill="none" stroke="#2FB894" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    licence: "Apache-2.0",
    platform: "Any browser",
    install: [],
    noSitemap: true,
    source: { repo: "claude-code-time-study", ref: "HEAD" },
  },
  {
    id: "claude-code-first",
    name: "Claude Code First",
    group: "measured",
    lines: ["lab"],
    kind: "Study · Specification",
    blurb: "How to run a project where Claude Code writes the code and a person decides what gets built, with every rule resting on graded evidence.",
    pitch: "An evidence-based specification of how to run a software project in which Claude Code is the primary author of the code and a person governs what is built. Each rule rests on graded findings from five projects run this way, and each finding on pointers into their pinned sources, which a gate checks on every push.",
    cta: "Read the guide",
    tags: ["Five projects", "Graded evidence", "MIT · CC BY 4.0"],
    site: "claude-code-first/",
    repo: "https://github.com/alegauss/claude-code-first",
    accent: { rgb: "214,84,120", bright: "#E8799A" },
    mark: '<svg viewBox="0 0 160 160" aria-hidden="true"><rect x="30" y="20" width="84" height="112" rx="14" fill="none" stroke="#E8799A" stroke-width="11"/><rect x="48" y="46" width="48" height="10" rx="5" fill="#E8799A"/><rect x="48" y="68" width="34" height="10" rx="5" fill="#E8799A"/><circle cx="112" cy="112" r="30" fill="#D65478"/><path d="M98 112 l10 10 l18 -19" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    licence: "MIT",
    platform: "Any browser · Claude Code plugin for the audit",
    install: [],
    noSitemap: true,
    source: { repo: "claude-code-first", ref: "HEAD" },
  },
]

export const projectById = (id: string): Project => {
  const p = PROJECTS.find((x) => x.id === id)
  if (!p) throw new Error(`unknown project "${id}"`)
  return p
}
