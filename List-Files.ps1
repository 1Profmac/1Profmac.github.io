<#
.SYNOPSIS
    Lists all files in a folder.

.DESCRIPTION
    Displays files in the specified folder with name, size, and last write time.
    Optionally searches subfolders and filters by file extension.

.PARAMETER Path
    Folder to list. Defaults to the current directory.

.PARAMETER Recurse
    Include files in all subfolders.

.PARAMETER Filter
    Optional wildcard filter, for example *.txt or report*.pdf.

.EXAMPLE
    .\List-Files.ps1

.EXAMPLE
    .\List-Files.ps1 -Path C:\Documents -Recurse

.EXAMPLE
    .\List-Files.ps1 -Path C:\Logs -Filter *.log -Recurse
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Path = (Get-Location).Path,

    [switch]$Recurse,

    [string]$Filter = '*'
)

if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
    Write-Error "Folder not found: $Path"
    exit 1
}

$resolvedPath = (Resolve-Path -LiteralPath $Path).Path
$getChildItemParams = @{
    LiteralPath = $resolvedPath
    File        = $true
    Filter      = $Filter
    ErrorAction = 'Continue'
}

if ($Recurse) {
    $getChildItemParams['Recurse'] = $true
}

$files = Get-ChildItem @getChildItemParams

if (-not $files) {
    Write-Host "No files found in '$resolvedPath'."
    exit 0
}

$files |
    Sort-Object FullName |
    Select-Object @{
        Name       = 'Name'
        Expression = { $_.Name }
    }, @{
        Name       = 'SizeKB'
        Expression = { [math]::Round($_.Length / 1KB, 2) }
    }, LastWriteTime, FullName |
    Format-Table -AutoSize

Write-Host ("`nTotal files: {0}" -f @($files).Count)
