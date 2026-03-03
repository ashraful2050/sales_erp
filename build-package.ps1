<#
.SYNOPSIS
    Builds the Sales ERP package ZIP for CodeCanyon upload.

.DESCRIPTION
    Creates a clean upload-ready ZIP archive containing all required files,
    excluding development artifacts (.git, node_modules, tests, etc.).
    The resulting ZIP is placed in the parent directory.

.USAGE
    Run from the project root:
        .\build-package.ps1

    Optionally specify a version:
        .\build-package.ps1 -Version "1.0.1"
#>

param(
    [string]$Version = "1.0.0"
)

$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
$PackageName = "sales-erp-v$Version"
$OutputDir   = Split-Path $ProjectRoot -Parent
$OutputZip   = Join-Path $OutputDir "$PackageName.zip"

# ─── Files/folders to EXCLUDE from the package ───────────────────────────────
$Excludes = @(
    ".git",
    ".gitattributes",
    "node_modules",
    ".env",
    ".env.backup",
    ".env.production",
    "tests",
    "phpunit.xml",
    ".phpunit.cache",
    ".phpunit.result.cache",
    ".editorconfig",
    "*.log",
    "storage\logs\*.log",
    "storage\framework\cache\data",
    "storage\framework\sessions",
    "storage\framework\views",
    "storage\app\public",
    ".idea",
    ".vscode",
    ".nova",
    ".fleet",
    ".zed",
    "build-package.ps1"
)

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Sales ERP — CodeCanyon Package Builder" -ForegroundColor Cyan
Write-Host "  Version: $Version" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# ── Check public/build exists ──────────────────────────────────────────────
$BuildDir = Join-Path $ProjectRoot "public\build"
if (-not (Test-Path $BuildDir)) {
    Write-Host "[WARN] public/build/ not found. Run 'npm run build' first to include compiled assets." -ForegroundColor Yellow
    $resp = Read-Host "Continue without compiled assets? (y/n)"
    if ($resp -ne "y") { exit 1 }
}

# ── Remove old ZIP if exists ───────────────────────────────────────────────
if (Test-Path $OutputZip) {
    Remove-Item $OutputZip -Force
    Write-Host "[INFO] Removed old package: $OutputZip" -ForegroundColor Gray
}

# ── Create temp staging directory ─────────────────────────────────────────
$TempDir = Join-Path $env:TEMP "sales_erp_package_$([System.Guid]::NewGuid().ToString('N').Substring(0,8))"
$StageDir = Join-Path $TempDir $PackageName
New-Item -ItemType Directory -Path $StageDir -Force | Out-Null
Write-Host "[INFO] Staging to: $StageDir" -ForegroundColor Gray

# ── Copy files to staging ─────────────────────────────────────────────────
Write-Host "[INFO] Copying project files..." -ForegroundColor Gray

$AllItems = Get-ChildItem -Path $ProjectRoot -Force

foreach ($Item in $AllItems) {
    $ExcludeThis = $false
    foreach ($Ex in $Excludes) {
        if ($Item.Name -like $Ex -or $Item.Name -eq $Ex) {
            $ExcludeThis = $true
            break
        }
    }
    if (-not $ExcludeThis) {
        $Dest = Join-Path $StageDir $Item.Name
        if ($Item.PSIsContainer) {
            Copy-Item -Path $Item.FullName -Destination $Dest -Recurse -Force
        } else {
            Copy-Item -Path $Item.FullName -Destination $Dest -Force
        }
    }
}

# ── Remove nested exclusions after copy ─────────────────────────────────
$RemovePaths = @(
    (Join-Path $StageDir "storage\logs"),
    (Join-Path $StageDir "storage\framework\cache\data"),
    (Join-Path $StageDir "storage\framework\sessions"),
    (Join-Path $StageDir "storage\framework\views")
)
foreach ($p in $RemovePaths) {
    if (Test-Path $p) {
        Get-ChildItem $p -File | Where-Object { $_.Name -ne ".gitignore" } | Remove-Item -Force
    }
}

# ── Ensure required empty directories with .gitignore placeholders ────────
$EnsureDirs = @(
    "storage\app\public",
    "storage\framework\cache\data",
    "storage\framework\sessions",
    "storage\framework\views",
    "storage\logs"
)
foreach ($d in $EnsureDirs) {
    $fp = Join-Path $StageDir $d
    if (-not (Test-Path $fp)) {
        New-Item -ItemType Directory -Path $fp -Force | Out-Null
    }
    $gi = Join-Path $fp ".gitignore"
    if (-not (Test-Path $gi)) {
        Set-Content -Path $gi -Value "*`n!.gitignore"
    }
}

# ── Create ZIP ────────────────────────────────────────────────────────────
Write-Host "[INFO] Creating ZIP archive..." -ForegroundColor Gray
Compress-Archive -Path (Join-Path $TempDir "*") -DestinationPath $OutputZip -Force

# ── Cleanup temp ──────────────────────────────────────────────────────────
Remove-Item -Path $TempDir -Recurse -Force

# ── Report ────────────────────────────────────────────────────────────────
$ZipInfo = Get-Item $OutputZip
$SizeMB  = [math]::Round($ZipInfo.Length / 1MB, 2)

Write-Host ""
Write-Host "=================================================" -ForegroundColor Green
Write-Host "  Package ready!" -ForegroundColor Green
Write-Host "  Path : $OutputZip" -ForegroundColor Green
Write-Host "  Size : $SizeMB MB" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Verify the ZIP contents before uploading." -ForegroundColor White
Write-Host "  2. Upload the ZIP as the 'Main File' on CodeCanyon." -ForegroundColor White
Write-Host "  3. Set item details, screenshots, and description on Envato." -ForegroundColor White
Write-Host ""
