
# ============================================
# Project Code ZIP Script
# Excludes node_modules and other large files
# ============================================

# Project folder = current directory
$ProjectPath = Get-Location

# ZIP file will be created in the parent folder
$ProjectName = Split-Path $ProjectPath -Leaf
$ZipPath = Join-Path (Split-Path $ProjectPath -Parent) "$ProjectName-code.zip"

# Folders to exclude
$ExcludeFolders = @(
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "out",
    "target",
    "__pycache__",
    ".venv",
    "venv",
    "coverage",
    ".cache",
    ".vite",
    ".turbo"
)

# Files to exclude
$ExcludeFiles = @(
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    "*.log",
    "*.zip",
    "*.rar",
    "*.7z",
    "*.tar",
    "*.gz",
    "*.iso",
    "*.mp4",
    "*.mov",
    "*.avi",
    "*.mkv",
    "*.exe",
    "*.msi",
    "*.dll",
    "*.db",
    "*.sqlite",
    "*.sqlite3"
)

# Remove old ZIP if it exists
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}

Write-Host "Collecting project files..." -ForegroundColor Cyan

# Get all files recursively
$Files = Get-ChildItem -Path $ProjectPath -File -Recurse -Force |
    Where-Object {

        $RelativePath = $_.FullName.Substring(
            $ProjectPath.Path.Length
        ).TrimStart('\')

        # Check excluded folders
        $FolderExcluded = $false

        foreach ($Folder in $ExcludeFolders) {
            if (
                $RelativePath -like "$Folder\*" -or
                $RelativePath -like "*\$Folder\*"
            ) {
                $FolderExcluded = $true
                break
            }
        }

        # Check excluded files
        $FileExcluded = $false

        foreach ($Pattern in $ExcludeFiles) {
            if ($_.Name -like $Pattern) {
                $FileExcluded = $true
                break
            }
        }

        # Exclude files larger than 50 MB
        $TooLarge = $_.Length -gt 50MB

        return (
            -not $FolderExcluded -and
            -not $FileExcluded -and
            -not $TooLarge
        )
    }

# Create temporary folder
$TempPath = Join-Path $env:TEMP "project-zip-$([guid]::NewGuid())"

New-Item -ItemType Directory -Path $TempPath | Out-Null

Write-Host "Copying selected files..." -ForegroundColor Yellow

foreach ($File in $Files) {

    $RelativePath = $File.FullName.Substring(
        $ProjectPath.Path.Length
    ).TrimStart('\')

    $Destination = Join-Path $TempPath $RelativePath

    $DestinationFolder = Split-Path $Destination -Parent

    if (-not (Test-Path $DestinationFolder)) {
        New-Item -ItemType Directory `
            -Path $DestinationFolder `
            -Force | Out-Null
    }

    Copy-Item $File.FullName $Destination -Force
}

Write-Host "Creating ZIP..." -ForegroundColor Cyan

Compress-Archive `
    -Path "$TempPath\*" `
    -DestinationPath $ZipPath `
    -CompressionLevel Optimal

# Delete temporary files
Remove-Item $TempPath -Recurse -Force

Write-Host ""
Write-Host "ZIP CREATED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "Location: $ZipPath" -ForegroundColor White
Write-Host "Files included: $($Files.Count)" -ForegroundColor White
Write-Host "ZIP size: $([math]::Round((Get-Item $ZipPath).Length / 1MB, 2)) MB" -ForegroundColor White
