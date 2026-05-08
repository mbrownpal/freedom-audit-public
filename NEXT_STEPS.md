# Freedom Audit Public - Deployment Guide

## Current Situation

**✅ Done:**
- `freedom-audit` repo restored to working private version
- Original "Unbreakable Wealth · Private Intake" landing page restored
- Private Vercel deployment safe

**⏳ Next:**
- Copy `freedom-audit` → `freedom-audit-public` (separate repos)
- Update public version with new landing page + Book a Call CTA
- Point Vercel public project to new repo

---

## Quickest Path (5 Minutes)

### 1. Copy the Repo (30 seconds)

**Option A - Manual (Fastest):**
```bash
# Clone freedom-audit
git clone https://github.com/mbrownpal/freedom-audit.git temp-copy
cd temp-copy

# Remove git history
rm -rf .git

# Initialize as new repo
git init
git add -A
git commit -m "Initial commit: Freedom Audit Public"

# Push to freedom-audit-public (delete existing empty repo first)
git remote add origin https://github.com/mbrownpal/freedom-audit-public.git
git branch -M main
git push -f origin main
```

**Option B - In GitHub UI:**
1. Delete `freedom-audit-public` repo
2. Go to `freedom-audit` repo
3. Settings → scroll to "Danger Zone"
4. Click "Transfer ownership" → transfer to yourself with new name
   (JK, this transfers the original - don't do this)

Actually, Option A is cleanest.

---

### 2. Update Vercel (2 minutes)

In Vercel → `freedom-audit-public` project:
1. Settings → Git  
2. If it's not connected: Connect to `mbrownpal/freedom-audit-public`
3. If it IS connected to the wrong repo: Disconnect → Reconnect to `freedom-audit-public`

---

### 3. I'll Update the Landing Page (5 minutes)

Once the repo is copied, I'll push:
1. New editorial landing page copy
2. Book a Call CTA to results page
3. `/booking` confirmation page

---

## Or Just Tell Me

If you want me to handle the file copy via API, I can - it'll just take 10-15 minutes to upload all 34 files one by one through GitHub's API.

**Your call!**
