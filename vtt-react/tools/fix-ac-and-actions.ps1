# PowerShell script to replace AC and action terminology across the codebase
# This script replaces:
# - "AC" → "Armor" (in text descriptions, not property names)
# - "bonus action" → appropriate AP terminology
# - "free action" → appropriate AP terminology

$ErrorActionPreference = "Stop"

# Define file patterns to search
$filePatterns = @(
    "src\data\classes\*.js",
    "src\data\*.js",
    "src\components\**\*.jsx",
    "src\components\**\*.js"
)

# Replacement patterns for text descriptions
$replacements = @(
    # Bonus action patterns
    @{ Pattern = '(?i)as a bonus action'; Replacement = 'for 1 AP' },
    @{ Pattern = '(?i)bonus action to'; Replacement = '1 AP to' },
    @{ Pattern = '(?i)\(bonus action'; Replacement = '(1 AP' },
    @{ Pattern = '(?i)Bonus Action\)'; Replacement = '1 AP)' },
    @{ Pattern = '(?i)Bonus Action:'; Replacement = 'Action (1 AP):' },
    @{ Pattern = '(?i)\*\*Bonus Action\*\*:'; Replacement = '**Action (1 AP)**:' },
    @{ Pattern = '(?i)bonus action each'; Replacement = '1 additional AP each' },
    @{ Pattern = '(?i)Gain a bonus action'; Replacement = 'Gain 1 additional AP' },
    @{ Pattern = '(?i)bonus action,'; Replacement = '1 AP,' },
    @{ Pattern = '(?i)bonus action\)'; Replacement = '1 AP)' },
    
    # Free action patterns
    @{ Pattern = '(?i)as a free action'; Replacement = 'for 0 AP (free)' },
    @{ Pattern = '(?i)free action instead'; Replacement = '0 AP (free) instead' },
    @{ Pattern = '(?i)Free Action\)'; Replacement = '0 AP)' },
    @{ Pattern = '(?i)Free Action:'; Replacement = 'Free (0 AP):' },
    @{ Pattern = '(?i)\*\*Free Action\*\*:'; Replacement = '**Free (0 AP)**:' }
)

$totalChanges = 0
$filesModified = 0

Write-Host "🔧 Fixing 'bonus action' and 'free action' references..." -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

foreach ($pattern in $filePatterns) {
    $files = Get-ChildItem -Path $pattern -Recurse -ErrorAction SilentlyContinue

    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
        if (-not $content) { continue }

        $originalContent = $content
        $fileChanges = 0

        foreach ($rep in $replacements) {
            $pattern_regex = $rep.Pattern
            $replacement_text = $rep.Replacement
            $foundMatches = [regex]::Matches($content, $pattern_regex)
            if ($foundMatches.Count -gt 0) {
                $content = $content -replace $pattern_regex, $replacement_text
                $fileChanges += $foundMatches.Count
            }
        }

        if ($fileChanges -gt 0) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            $filesModified++
            $totalChanges += $fileChanges
            Write-Host "  ✓ $($file.Name): $fileChanges changes" -ForegroundColor Green
        }
    }
}

Write-Host ("")
Write-Host ("=" * 60) -ForegroundColor Gray
Write-Host "✅ Complete! Fixed $totalChanges instances across $filesModified files." -ForegroundColor Green
Write-Host ""

