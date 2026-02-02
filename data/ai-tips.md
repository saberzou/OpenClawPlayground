# AI Tips - OpenClaw Creative Uses

## 🍌 1. Image Generation (Nano Banana Pro)

**Skill:** `nano-banana-pro` — Uses Gemini 3 Pro Image API

### Capabilities
- Generate images from text prompts
- Edit existing images (single or multi-image composition)
- Up to 14 images combined into one scene
- Resolution options: 1K (default), 2K, 4K
- Flawless text rendering in images

### Commands
```bash
# Generate new image
uv run {baseDir}/scripts/generate_image.py --prompt "your description" --filename "output.png" --resolution 1K

# Edit existing image
uv run {baseDir}/scripts/generate_image.py --prompt "edit instructions" -i "/path/in.png" --filename "out.png" --resolution 2K

# Combine multiple images
uv run {baseDir}/scripts/generate_image.py --prompt "combine into one scene" -i img1.png -i img2.png --filename "output.png"
```

### Setup
- Requires: `uv` package manager (`brew install uv`)
- API key: `GEMINI_API_KEY` env var
- Auto-attaches generated images in Telegram/iMessage

**For iPad doodles:** Describe a sketch concept and generate variations, or combine doodles into compositions.

---

## 📊 2. Custom Dashboards

### A. Report Center (Existing)
Your `report-center` folder is a dashboard system:
```
/report-center/
├── data/           # JSON data (briefing.json, news.json, tools.json)
├── scripts/        # Fetchers (fetch-news.js, fetch-tools.js)
└── index.html      # Unified web UI with tabs
```

**Customization options:**
- Design inspiration gallery (curated images)
- Photography portfolio tracker
- Project status board
- Habit tracking dashboard

### B. Skills-based Dashboards
- Use `canvas` skill to render dashboards directly in chat
- `nodes` skill for camera/screen monitoring dashboards
- Skills can output HTML/Markdown rendered in supported channels

**Example workflow:**
```
You: "Show me my weekly design progress"
→ Agent runs fetch-script → generates HTML → renders in Telegram
```

---

## 🤖 3. Multiple OpenClaw Instances (Multi-Agent Routing)

**Concept:** One Gateway server, multiple isolated AI "brains"

### Each Agent Has
- **Own workspace** (files, persona, AGENTS.md/SOUL.md/USER.md)
- **Own auth** (separate credentials, no cross-talk)
- **Own sessions** (independent chat history)
- **Own skills** (per-agent + shared)

### Use Cases
| Setup | Purpose |
|-------|---------|
| `main` agent | General chat, personal tasks |
| `work` agent | Separate work credentials, professional persona |
| `research` agent | Long-running research projects |
| `creative` agent | Image generation, design work |

### Commands
```bash
# Add new agent
openclaw agents add work

# List agents with bindings
openclaw agents list --bindings

# Route WhatsApp DMs to specific agents based on sender
# (one WhatsApp number, different people → different agents)
```

**Separation is real:** Each agent reads from `~/.openclaw/agents/<agentId>/agent/auth-profiles.json` — no accidental credential mixing.

**Recommendation:** Create a `design-agent` with different skills and persona optimized for creative work vs. main agent for daily tasks.

---

*Last Updated: Feb 2, 2026*
