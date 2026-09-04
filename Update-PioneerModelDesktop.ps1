<#
.SYNOPSIS
    Downloads the latest Pioneer Model print files to the Windows Desktop.

.DESCRIPTION
    Pulls the decision-maker one-pager and full asset map (PDF + HTML)
    from GitHub onto the current user's Desktop, overwriting older copies.

.PARAMETER Branch
    Git branch to download from. Defaults to the working branch for this pack.

.EXAMPLE
    .\Update-PioneerModelDesktop.ps1
#>
[CmdletBinding()]
param(
    [string]$Branch = 'cursor/powershell-list-files-c07c'
)

$ErrorActionPreference = 'Stop'
$desktop = [Environment]::GetFolderPath('Desktop')
if (-not $desktop) {
    $desktop = Join-Path $env:USERPROFILE 'Desktop'
}

$base = "https://raw.githubusercontent.com/1Profmac/1Profmac.github.io/$Branch/forms"
$files = @(
    'pioneer-model-one-pager.pdf',
    'pioneer-model-one-pager.html',
    'pioneer-model-full-map.pdf',
    'pioneer-model-full-map.html',
    'lmt-brochure.pdf',
    'lmt-brochure.html',
    'funding-probability-analysis.pdf',
    'funding-probability-analysis.html'
)

Write-Host "Saving Pioneer Model files to: $desktop"
Write-Host "Source branch: $Branch"
Write-Host ""

foreach ($name in $files) {
    $uri = "$base/$name"
    $outFile = Join-Path $desktop $name
    Write-Host "Downloading $name ..."
    Invoke-WebRequest -Uri $uri -OutFile $outFile -UseBasicParsing
    $item = Get-Item -LiteralPath $outFile
    Write-Host ("  {0}  ({1:N0} KB, {2})" -f $item.FullName, ($item.Length / 1KB), $item.LastWriteTime)
}

Write-Host ""
Write-Host "Desktop copy updated. Open lmt-brochure.pdf (front + back) or pioneer-model-one-pager.pdf to print."
