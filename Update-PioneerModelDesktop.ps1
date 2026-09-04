<#
.SYNOPSIS
    Saves the LMT print PDFs into a visible folder on the Windows Desktop.

.DESCRIPTION
    Creates "Desktop\LMT Print Pack" (including OneDrive Desktop if that is
    the real Desktop), downloads the print-ready PDFs, then opens the folder.

.PARAMETER Branch
    Git branch to download from.

.EXAMPLE
    powershell -NoProfile -ExecutionPolicy Bypass -File .\Update-PioneerModelDesktop.ps1
#>
[CmdletBinding()]
param(
    [string]$Branch = 'cursor/powershell-list-files-c07c'
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Get-UserDesktopPaths {
    $paths = New-Object System.Collections.Generic.List[string]
    foreach ($candidate in @(
            [Environment]::GetFolderPath('Desktop')
            Join-Path $env:USERPROFILE 'Desktop'
            Join-Path $env:USERPROFILE 'OneDrive\Desktop'
        )) {
        if ($candidate) { $paths.Add($candidate) }
    }
    Get-ChildItem -Path $env:USERPROFILE -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like 'OneDrive*' } |
        ForEach-Object {
            $paths.Add((Join-Path $_.FullName 'Desktop'))
        }
    $paths |
        Where-Object { $_ -and (Test-Path -LiteralPath $_) } |
        ForEach-Object { [System.IO.Path]::GetFullPath($_) } |
        Select-Object -Unique
}

$desktops = @(Get-UserDesktopPaths)
if (-not $desktops) {
    throw "Could not find a Desktop folder under $env:USERPROFILE"
}

$packName = 'LMT Print Pack'
$base = "https://raw.githubusercontent.com/1Profmac/1Profmac.github.io/$Branch/forms"
$files = @(
    'wioa-nonprofit-credentials.pdf'
    'funding-probability-analysis.pdf'
    'lmt-brochure.pdf'
    'pioneer-model-one-pager.pdf'
    'pioneer-model-full-map.pdf'
)

$written = @()
foreach ($desktop in $desktops) {
    $pack = Join-Path $desktop $packName
    New-Item -ItemType Directory -Force -Path $pack | Out-Null
    Write-Host ""
    Write-Host "Saving print files to:" -ForegroundColor Yellow
    Write-Host "  $pack"
    Write-Host ""

    foreach ($name in $files) {
        $uri = "$base/$name"
        $outFile = Join-Path $pack $name
        Write-Host "Downloading $name ..."
        Invoke-WebRequest -Uri $uri -OutFile $outFile -UseBasicParsing
        $item = Get-Item -LiteralPath $outFile
        Write-Host ("  {0}  ({1:N0} KB)" -f $item.Name, ($item.Length / 1KB))
        $written += $item.FullName
    }

    $readme = @"
LMT Print Pack
==============
Print these PDFs (not the HTML, not from inside a zip):

  wioa-nonprofit-credentials.pdf     6 pages  credentials checklist
  funding-probability-analysis.pdf   4 pages  funding brief
  lmt-brochure.pdf                   2 pages  print duplex, flip on long edge
  pioneer-model-one-pager.pdf        1 page   landscape
  pioneer-model-full-map.pdf         asset map

If you used LMT-Print-Pack.zip: right-click -> Extract All -> this folder.
Do not open PDFs from inside the zip window.

Folder: $pack
"@
    Set-Content -LiteralPath (Join-Path $pack 'READ ME.txt') -Value $readme -Encoding UTF8
    Invoke-Item -LiteralPath $pack
}

Write-Host ""
Write-Host "Done. A File Explorer window should be open on 'LMT Print Pack'." -ForegroundColor Green
Write-Host "If you still do not see it, look on the OneDrive Desktop, or press Win+E and paste:"
Write-Host ("  " + (Split-Path $written[0] -Parent))
Write-Host ""
Write-Host "Files written:"
$written | Select-Object -Unique | ForEach-Object { Write-Host "  $_" }
