# GitHub Setup — BugDetector Pro

The local repository is ready to push. Choose one of the options below:

---

## Option 1: One-Click PowerShell Script (Recommended)

```powershell
cd C:\Users\Administrator\Documents\bug-detector-pro
.\scripts\push-to-github.ps1
```

You will be prompted for:
1. Your GitHub username
2. A GitHub Personal Access Token (classic)

**Create a token here:** https://github.com/settings/tokens/new
- Required scopes: `repo` (full control of private repositories)

---

## Option 2: Manual Steps

### Step 1: Create the repository on GitHub
Go to https://github.com/new and create a public repository named `bug-detector-pro`.

### Step 2: Push from local
```powershell
cd C:\Users\Administrator\Documents\bug-detector-pro
git remote add origin https://github.com/YOUR_USERNAME/bug-detector-pro.git
git branch -M main
git push -u origin main
```

---

## Option 3: Authenticate the GitHub MCP (for future use)

To enable the GitHub MCP tools in Kimi Code, you need to configure a GitHub Personal Access Token:

1. Create a token at https://github.com/settings/tokens/new
   - Scopes: `repo`, `read:user`, `read:org`
2. Add it to your MCP settings in VS Code / Claude Desktop:
   ```json
   {
     "mcpServers": {
       "github": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-github"],
         "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
         }
       }
     }
   }
   ```

Once authenticated, I can create repos, issues, PRs, and manage everything automatically.

---

*Repository location:* `C:\Users\Administrator\Documents\bug-detector-pro`
