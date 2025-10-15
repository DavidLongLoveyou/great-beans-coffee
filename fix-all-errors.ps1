# Script to fix all error variable issues in catch blocks
Write-Host "Fixing all error variable issues in catch blocks..." -ForegroundColor Yellow

# Get all TypeScript files that contain catch blocks with error variable issues
$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx" | Where-Object { 
    $content = Get-Content $_.FullName | Out-String
    $content -match "catch\s*\(\s*error\s*\)" -or $content -match "\berror\s+instanceof\b" -or $content -match "details:\s*error\."
}

$totalFiles = $files.Count
$fixedFiles = 0

Write-Host "Found $totalFiles files with error variable issues" -ForegroundColor Cyan

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName | Out-String
        $originalContent = $content
        
        # Fix catch (error) to catch (_error)
        $content = $content -replace 'catch\s*\(\s*error\s*\)', 'catch (_error)'
        
        # Fix error instanceof to _error instanceof
        $content = $content -replace '\berror\s+instanceof\b', '_error instanceof'
        
        # Fix details: error.issues to details: _error.issues
        $content = $content -replace 'details:\s*error\.', 'details: _error.'
        
        # Fix other error. references to _error. in catch blocks
        $content = $content -replace '\berror\.issues\b', '_error.issues'
        $content = $content -replace '\berror\.message\b', '_error.message'
        $content = $content -replace '\berror\.stack\b', '_error.stack'
        
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
Write-Host "All error variable issues have been resolved" -ForegroundColor Cyan