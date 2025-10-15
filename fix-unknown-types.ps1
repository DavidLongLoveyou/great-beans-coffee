# Script to fix all 'as unknown' to 'as any' in TypeScript files
Write-Host "Fixing all 'as unknown' to 'as any' in TypeScript files..." -ForegroundColor Yellow

$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx" | Where-Object { 
    $content = Get-Content $_.FullName -Raw
    $content -match "as unknown"
}

$totalFiles = $files.Count
$fixedFiles = 0

Write-Host "Found $totalFiles files with 'as unknown'" -ForegroundColor Cyan

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        $originalContent = $content
        
        # Replace 'as unknown' with 'as any'
        $content = $content -replace '\bas unknown\b', 'as any'
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            $fixedFiles++
            Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Error fixing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Fixed $fixedFiles/$totalFiles files" -ForegroundColor Green
Write-Host "All 'as unknown' have been replaced with 'as any'" -ForegroundColor Cyan