# Script to fix variable naming issues in catch blocks
Write-Host "Fixing variable naming issues in catch blocks..." -ForegroundColor Yellow

$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx" | Where-Object { 
    $content = Get-Content $_.FullName | Out-String
    $content -match "catch\s*\(\s*error\s*\)"
}

$totalFiles = $files.Count
$fixedFiles = 0

Write-Host "Found $totalFiles files with 'catch (error)'" -ForegroundColor Cyan

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName | Out-String
        $originalContent = $content
        
        # Replace 'catch (error)' with 'catch (_error)'
        $content = $content -replace 'catch\s*\(\s*error\s*\)', 'catch (_error)'
        
        # Also replace usage of 'error' variable inside catch blocks with '_error'
        # This is a more complex replacement that needs careful handling
        $lines = $content -split "`n"
        $inCatchBlock = $false
        $braceCount = 0
        
        for ($i = 0; $i -lt $lines.Length; $i++) {
            if ($lines[$i] -match 'catch\s*\(\s*_error\s*\)') {
                $inCatchBlock = $true
                $braceCount = 0
            }
            
            if ($inCatchBlock) {
                # Count braces to track catch block scope
                $openBraces = ($lines[$i] -split '\{').Length - 1
                $closeBraces = ($lines[$i] -split '\}').Length - 1
                $braceCount += $openBraces - $closeBraces
                
                # Replace 'error' with '_error' in catch block, but be careful not to replace in strings or comments
                if ($lines[$i] -match '\berror\b' -and $lines[$i] -notmatch '//.*\berror\b' -and $lines[$i] -notmatch '".*\berror\b.*"' -and $lines[$i] -notmatch "'.*\berror\b.*'") {
                    $lines[$i] = $lines[$i] -replace '\berror\b', '_error'
                }
                
                # Exit catch block when braces are balanced
                if ($braceCount -le 0 -and $lines[$i] -match '\}') {
                    $inCatchBlock = $false
                }
            }
        }
        
        $content = $lines -join "`n"
        
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
Write-Host "All 'catch (error)' have been replaced with 'catch (_error)'" -ForegroundColor Cyan