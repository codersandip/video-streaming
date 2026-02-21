# Publishing to GitHub Guide

This guide provides step-by-step instructions to publish your **video-streaming** project to your GitHub account: `codersandip`.

## Prerequisites
1.  **Git Installed:** Ensure Git is installed on your system.
2.  **GitHub Account:** You are logged into [GitHub](https://github.com/codersandip).
3.  **GitHub CLI (Optional):** If you have `gh` installed, the process is even faster.

---

## Step 1: Prepare the Repository
I have already created a `.gitignore` file for you to ensure that sensitive information (like `.env` files) and large directories (like `node_modules`, `hls`, `thumbnails`, and `uploads`) are not uploaded.

### Current `.gitignore` settings:
- `node_modules/` (Dependencies)
- `.env` (Secrets)
- `hls/`, `thumbnails/`, `uploads/` (Generated Media)
- `client/dist/` (Build artifacts)

---

## Step 2: Initialize and Commit Locally
Open your terminal in the project root (`d:\server\laragon\www\video-streaming`) and run the following commands:

```bash
# 1. Initialize git
git init

# 2. Add all files (respecting .gitignore)
git add .

# 3. Create your first commit
git commit -m "Initial commit: Video Streaming Platform"
```

---

## Step 3: Create a Repository on GitHub
1.  Go to [github.com/new](https://github.com/new).
2.  **Repository Name:** `video-streaming`
3.  **Description:** A full-stack video streaming platform with HLS support.
4.  **Public/Private:** Choose your preference.
5.  **Initialize this repository with:** Do **NOT** check "Add a README", "Add .gitignore", or "Choose a license" (we already have them).
6.  Click **Create repository**.

---

## Step 4: Link Local Repo to GitHub
After creating the repository, GitHub will show you some commands. Run these in your terminal:

```bash
# 1. Rename your branch to main
git branch -M main

# 2. Add the remote origin
git remote add origin https://github.com/codersandip/video-streaming.git

# 3. Push your code
git push -u origin main
```

---

## Using GitHub CLI (Alternative)
If you have the [GitHub CLI](https://cli.github.com/) installed, you can do Step 3 and 4 in one command:

```bash
gh repo create video-streaming --public --source=. --remote=origin --push
```

---

## Important Security Note
Never commit your `.env` files. If you ever accidentally commit one, you should:
1.  Delete the file from git history.
2.  Change all your passwords/keys immediately.
