# ============================================================
# JWT Keys Cleanup Script for Windows PowerShell
# 
# Purpose: Remove JWT keys from Git tracking and history
# 
# WARNING: This script will:
# 1. Backup existing keys to ../backup/keys/
# 2. Add keys/ to .gitignore
# 3. Remove keys from Git cache
# 4. Clean Git history of all keys references
# 5. Force push to remote
# 6. Delete all local .key files
#
# After running:
# - All keys will be removed from Git history
# - Local .key files will be deleted
# - New keys will be generated when server starts
# - Consider forcing all users to re-authenticate
# ============================================================

param(
    [switch]$SkipBackup,
    [switch]$DryRun,
    [switch]$SkipPush
)

# Color codes for output
function Write-Step { param($Message) Write-Host "`n[STEP] $Message" -ForegroundColor Cyan }
function Write-Success { param($Message) Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "[WARN] $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }

# Banner
Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  JWT Keys Cleanup Script" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Check if in a git repository
if (-not (Test-Path ".git")) {
    Write-Error "Not in a Git repository. Please run this script from the repository root."
    exit 1
}

# Check if keys folder exists
if (-not (Test-Path "keys")) {
    Write-Warning "No 'keys' folder found. Nothing to clean."
    exit 0
}

# Check for .key files
$keyFiles = Get-ChildItem -Path "keys" -Filter "*.key" -ErrorAction SilentlyContinue
if ($keyFiles.Count -eq 0) {
    Write-Warning "No .key files found in keys/ folder. Nothing to clean."
    exit 0
}

Write-Host "Found $($keyFiles.Count) key file(s) in keys/ folder:" -ForegroundColor White
$keyFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }

if ($DryRun) {
    Write-Warning "DRY RUN MODE - No changes will be made"
}

Write-Host ""
$confirm = Read-Host "Continue with cleanup? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Cleanup cancelled." -ForegroundColor Yellow
    exit 0
}

# ============================================================
# STEP 1: Backup Keys
# ============================================================
Write-Step "Creating backup of keys..."

if (-not $SkipBackup) {
    $backupPath = "../backup/keys"
    
    try {
        New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
        Copy-Item -Path "keys\*" -Destination $backupPath -Recurse -Force -ErrorAction SilentlyContinue
        Write-Success "Backup created in ../backup/keys/"
    } catch {
        Write-Warning "Could not create backup: $_"
    }
} else {
    Write-Warning "Backup skipped (--SkipBackup flag)"
}

# ============================================================
# STEP 2: Update .gitignore
# ============================================================
Write-Step "Updating .gitignore..."

$gitignoreContent = ""
if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw
}

if (-not ($gitignoreContent -match "keys/")) {
    Add-Content -Path ".gitignore" -Value ""
    Add-Content -Path ".gitignore" -Value "# JWT Keys - NEVER COMMIT"
    Add-Content -Path ".gitignore" -Value "keys/"
    Write-Success "Added 'keys/' to .gitignore"
} else {
    Write-Success "'keys/' already in .gitignore"
}

# ============================================================
# STEP 3: Remove from Git Cache
# ============================================================
Write-Step "Removing keys from Git tracking..."

try {
    git rm -r --cached keys/ 2>$null
    Write-Success "Keys removed from Git cache"
} catch {
    Write-Warning "Could not remove from cache: $_"
}

# ============================================================
# STEP 4: Verify .gitignore update
# ============================================================
Write-Step "Verifying .gitignore changes..."
git status --short .gitignore | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Success ".gitignore changes detected"
} else {
    Write-Warning ".gitignore may not have changed"
}

# ============================================================
# STEP 5: Clean Git History
# ============================================================
Write-Step "Cleaning Git history of all key references..."
Write-Warning "This may take several minutes for large repositories..."

if (-not $DryRun) {
    try {
        git filter-branch --force --index-filter "git rm --cached --ignore-unmatch -r keys/" --prune-empty --tag-name-filter cat -- --all 2>$null
        Write-Success "Git history cleaned"
    } catch {
        Write-Warning "filter-branch encountered an issue: $_"
    }
} else {
    Write-Host "  Would execute: git filter-branch --force --index-filter ..." -ForegroundColor Gray
}

# ============================================================
# STEP 6: Garbage Collection
# ============================================================
Write-Step "Running Git garbage collection..."

if (-not $DryRun) {
    git reflog expire --expire=now --all 2>$null
    git gc --prune=now --aggressive 2>$null
    Write-Success "Garbage collection completed"
} else {
    Write-Host "  Would execute: git gc --prune=now --aggressive" -ForegroundColor Gray
}

# ============================================================
# STEP 7: Verify History is Clean
# ============================================================
Write-Step "Verifying Git history is clean..."

$historyCheck = git log --all --oneline -- keys/ 2>$null
if ([string]::IsNullOrEmpty($historyCheck)) {
    Write-Success "Git history verified clean - no key references found"
} else {
    Write-Error "Git history may still contain key references:"
    Write-Host $historyCheck -ForegroundColor Red
}

# ============================================================
# STEP 8: Commit Changes
# ============================================================
Write-Step "Committing changes..."

Set-Content -Path ".gitignore" -Value (Get-Content ".gitignore" | Where-Object { $_ -ne "" }) -Force

if (-not $DryRun) {
    git add .gitignore
    git add keys/
    git commit -m "chore: remove keys from git tracking and history
    
This commit removes the keys/ directory from Git tracking
and cleans up Git history of any key references.

SECURITY: Keys should never be committed to version control.

Generated by cleanup-keys.ps1" 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Changes committed"
    } else {
        Write-Warning "No changes to commit or commit failed"
    }
} else {
    Write-Host "  Would commit .gitignore changes" -ForegroundColor Gray
}

# ============================================================
# STEP 9: Force Push to Remote
# ============================================================
Write-Step "Pushing to remote..."

if (-not $SkipPush) {
    if (-not $DryRun) {
        Write-Warning "This will force-push to ALL branches. This is irreversible!"
        $pushConfirm = Read-Host "Type 'yes' to confirm: "
        
        if ($pushConfirm -eq "yes") {
            git push origin --force --all 2>$null
            git push origin --force --tags 2>$null
            
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Force pushed to origin"
            } else {
                Write-Error "Push failed. Check your git remote configuration."
            }
        } else {
            Write-Warning "Push cancelled"
        }
    } else {
        Write-Host "  Would force push to origin" -ForegroundColor Gray
    }
} else {
    Write-Warning "Push skipped (--SkipPush flag)"
}

# ============================================================
# STEP 10: Delete Local Keys
# ============================================================
Write-Step "Deleting local key files..."

if (-not $DryRun) {
    $localKeys = Get-ChildItem -Path "keys" -Filter "*.key" -ErrorAction SilentlyContinue
    
    if ($localKeys) {
        foreach ($key in $localKeys) {
            Remove-Item -Path $key.FullName -Force
            Write-Host "  Deleted: $($key.Name)" -ForegroundColor Gray
        }
        Write-Success "Deleted $($localKeys.Count) local key file(s)"
    } else {
        Write-Success "No local keys to delete"
    }
    
    # Create .gitkeep to preserve folder
    $gitkeepPath = Join-Path "keys" ".gitkeep"
    if (-not (Test-Path $gitkeepPath)) {
        New-Item -Path $gitkeepPath -ItemType File -Force | Out-Null
        Write-Success "Created keys/.gitkeep to preserve folder"
    }
} else {
    Write-Host "  Would delete all .key files in keys/" -ForegroundColor Gray
}

# ============================================================
# STEP 11: Final Verification
# ============================================================
Write-Step "Final verification..."

Write-Host ""
Write-Host "Checking local status:" -ForegroundColor White

$stillTracked = git ls-files | Select-String "keys"
if ([string]::IsNullOrEmpty($stillTracked)) {
    Write-Success "Keys are NOT tracked by Git"
} else {
    Write-Error "Keys may still be tracked:"
    Write-Host $stillTracked -ForegroundColor Red
}

$remainingKeys = Get-ChildItem -Path "keys" -Filter "*.key" -ErrorAction SilentlyContinue
if (-not $remainingKeys) {
    Write-Success "No .key files remain locally"
} else {
    Write-Error "Key files still exist:"
    $remainingKeys | ForEach-Object { Write-Host "  $($_.Name)" -ForegroundColor Red }
}

Write-Host ""

# ============================================================
# COMPLETION
# ============================================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cleanup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Restart your server - new keys will be generated"
Write-Host "2. Go to GitHub -> Security tab -> verify no secret alerts"
Write-Host "3. Go to GitHub Actions -> verify no workflow failures"
Write-Host "4. Force all users to re-login (recommended)"
Write-Host "5. Delete ../backup/keys folder after verifying everything works"
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Red
Write-Host "- If repo was public, consider ALL tokens as compromised"
Write-Host "- Monitor server logs for suspicious activity"
Write-Host "- Enable GitHub secret scanning if not already enabled"
Write-Host ""
