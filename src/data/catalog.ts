export const categoryCatalog = [
  ["Package Managers", "package-managers", "Install, update, and manage macOS software and developer dependencies.", "Package"],
  ["Terminal Tools", "terminal-tools", "Terminals, shells, prompts, and modern command-line utilities.", "Terminal"],
  ["System Monitoring", "system-monitoring", "Understand CPU, memory, battery, network, disks, and thermals.", "Activity"],
  ["Code Editors", "code-editors", "Fast, extensible editors and IDEs for every programming language.", "Code"],
  ["Web Development", "web-development", "Runtimes, package managers, frameworks, and full-stack foundations.", "Globe"],
  ["Git & Version Control", "git-version-control", "Track code, collaborate, and manage repositories with confidence.", "GitBranch"],
  ["AI & Machine Learning", "ai-ml-tools", "Local AI, notebooks, Python environments, and machine learning libraries.", "Sparkles"],
  ["LLM Development", "llm-development", "Frameworks and assistants for building applications with language models.", "Bot"],
  ["Docker & DevOps", "docker-devops", "Containers, orchestration, infrastructure, and automation tooling.", "Boxes"],
  ["Database Tools", "database-tools", "Databases, local data services, and friendly database clients.", "Database"],
  ["API Development", "api-development", "Design, test, inspect, and automate HTTP APIs.", "Braces"],
  ["Design Tools", "design-tools", "Interface design, prototyping, illustration, and 3D creation.", "Palette"],
  ["Productivity", "productivity-tools", "Launchers, window managers, notes, and focused workflows.", "Zap"],
  ["Security", "security-tools", "Passwords, encryption, network inspection, and security assessment.", "Shield"],
  ["Networking", "networking-tools", "Secure tunnels, private networks, and remote connectivity.", "Network"],
  ["Browser Developer Tools", "browser-dev-tools", "Browsers and inspection tools made for web development.", "PanelsTopLeft"],
  ["Mac Optimization", "mac-optimization", "Keep storage, apps, and system maintenance under control.", "Gauge"],
] as const

const groupedTools: Record<string, string[]> = {
  "package-managers": ["Homebrew", "MacPorts", "Nix"],
  "terminal-tools": ["iTerm2", "Warp", "Alacritty", "Kitty", "Zsh", "Oh My Zsh", "Starship", "tmux", "fzf", "ripgrep", "bat", "eza", "htop", "btop", "jq", "wget", "curl"],
  "system-monitoring": ["Stats", "iStat Menus", "Macs Fan Control", "Amphetamine"],
  "code-editors": ["Visual Studio Code", "Cursor", "Zed", "Sublime Text", "Vim", "Neovim", "Emacs"],
  "web-development": ["Node.js", "npm", "pnpm", "Yarn", "Bun", "Deno", "React", "Next.js", "Vue", "Angular", "Svelte", "Express", "NestJS", "Django", "Laravel"],
  "git-version-control": ["Git", "GitHub CLI", "GitKraken", "Sourcetree", "Fork"],
  "ai-ml-tools": ["Ollama", "LM Studio", "Jan", "Python", "Miniconda", "Anaconda", "JupyterLab", "PyTorch", "TensorFlow", "Pandas", "NumPy", "Scikit-learn"],
  "llm-development": ["LangChain", "LlamaIndex", "Open WebUI", "AnythingLLM", "Continue", "Aider"],
  "docker-devops": ["Docker Desktop", "OrbStack", "Colima", "Kubernetes", "Helm", "Terraform", "Ansible"],
  "database-tools": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "TablePlus", "DBeaver"],
  "api-development": ["Postman", "Insomnia", "Bruno", "HTTPie"],
  "design-tools": ["Figma", "Sketch", "Adobe Creative Cloud", "Blender"],
  "productivity-tools": ["Raycast", "Alfred", "Rectangle", "Magnet", "Notion", "Obsidian", "Todoist"],
  "security-tools": ["1Password", "Bitwarden", "GnuPG", "OpenSSL", "Wireshark", "Nmap"],
  "networking-tools": ["ngrok", "Cloudflare Tunnel", "WireGuard", "Tailscale"],
  "browser-dev-tools": ["Arc Browser", "Google Chrome", "Firefox Developer Edition", "Safari Developer Tools"],
  "mac-optimization": ["OnyX", "CleanMyMac", "AppCleaner", "DaisyDisk", "GrandPerspective"],
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/\+/g, "plus").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

const commands: Record<string, string> = {
  homebrew: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
  nix: "sh <(curl -L https://nixos.org/nix/install)",
  "oh-my-zsh": 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
  yarn: "corepack enable yarn",
  react: "npm create vite@latest -- --template react-ts",
  nextjs: "npx create-next-app@latest",
  vue: "npm create vue@latest",
  angular: "npm install -g @angular/cli",
  svelte: "npx sv create my-app",
  express: "npm install express",
  nestjs: "npm install -g @nestjs/cli",
  django: "python3 -m pip install Django",
  laravel: "composer global require laravel/installer",
  pytorch: "python3 -m pip install torch torchvision",
  tensorflow: "python3 -m pip install tensorflow",
  pandas: "python3 -m pip install pandas",
  numpy: "python3 -m pip install numpy",
  "scikit-learn": "python3 -m pip install scikit-learn",
  langchain: "python3 -m pip install langchain",
  llamaindex: "python3 -m pip install llama-index",
  aider: "python3 -m pip install aider-chat",
  "open-webui": "docker run -d -p 3000:8080 ghcr.io/open-webui/open-webui:main",
  kubernetes: "brew install kubectl",
  mongodb: "brew tap mongodb/brew && brew install mongodb-community",
  magnet: "mas install 441258766",
  amphetamine: "mas install 937984704",
}

const manualInstructions: Record<string, string> = {
  macports: "Download the installer from macports.org",
  continue: "Install the Continue extension in your editor",
  "safari-developer-tools": "Enable Developer features in Safari Settings → Advanced",
}

const casks = new Set(["iterm2", "warp", "alacritty", "kitty", "istat-menus", "macs-fan-control", "visual-studio-code", "cursor", "zed", "sublime-text", "emacs", "gitkraken", "sourcetree", "fork", "lm-studio", "jan", "miniconda", "anaconda", "anythingllm", "docker-desktop", "orbstack", "tableplus", "dbeaver", "postman", "insomnia", "bruno", "figma", "sketch", "adobe-creative-cloud", "blender", "raycast", "alfred", "rectangle", "notion", "obsidian", "todoist", "1password", "bitwarden", "wireshark", "tailscale", "arc-browser", "google-chrome", "firefox-developer-edition", "onyx", "cleanmymac", "appcleaner", "daisydisk", "grandperspective"])

const descriptions: Record<string, string> = {
  homebrew: "The missing package manager for macOS.",
  stats: "An open-source macOS system monitor in your menu bar.",
  cursor: "An AI-first code editor built for pair programming with models.",
  ollama: "Run and manage open language models locally on your Mac.",
  raycast: "A fast, extensible launcher and command center.",
  nextjs: "A full-stack React framework for production web applications.",
  orbstack: "Fast, lightweight containers and Linux machines on macOS.",
  rectangle: "Open-source window management using keyboard shortcuts.",
}

const advanced = new Set(["nix", "vim", "neovim", "emacs", "angular", "git", "pytorch", "tensorflow", "scikit-learn", "langchain", "llamaindex", "aider", "kubernetes", "helm", "terraform", "ansible", "gnupg", "openssl", "wireshark", "nmap", "wireguard"])
const intermediate = new Set(["alacritty", "kitty", "zsh", "tmux", "node-js", "bun", "deno", "react", "nextjs", "vue", "svelte", "express", "nestjs", "django", "laravel", "ollama", "python", "miniconda", "jupyterlab", "open-webui", "continue", "docker-desktop", "orbstack", "colima", "postgresql", "mysql", "mongodb", "redis", "ngrok", "cloudflare-tunnel", "safari-developer-tools", "onyx"])

export const toolCatalog = Object.entries(groupedTools).flatMap(([categorySlug, names]) =>
  names.map((name) => {
    const slug = slugify(name).replace("node-js", "nodejs").replace("next-js", "nextjs")
    const category = categoryCatalog.find((item) => item[1] === categorySlug)!
    const command = manualInstructions[slug] ?? commands[slug] ?? `brew install ${casks.has(slug) ? "--cask " : ""}${slug}`
    const installKind = slug in manualInstructions ? "manual" : "command"
    const difficulty = advanced.has(slug) ? "ADVANCED" : intermediate.has(slug) ? "INTERMEDIATE" : "BEGINNER"
    return {
      name,
      slug,
      categorySlug,
      description: descriptions[slug] ?? `Explore ${name} for ${category[0].toLowerCase()} workflows.`,
      command,
      installKind,
      tags: [category[0].split(" ")[0].toLowerCase(), casks.has(slug) ? "app" : "cli", "macos"],
      difficulty,
      rating: 0,
      downloads: 0,
    }
  }),
)

export type CatalogTool = (typeof toolCatalog)[number]
