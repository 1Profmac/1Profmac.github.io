<#
.SYNOPSIS
    Finds files modified in the last 7 days.

.DESCRIPTION
    Lists files whose LastWriteTime is within the last N days (default 7).
    Shows name, size, last write time, and full path.

.PARAMETER Path
    Folder to search. Defaults to the current directory.

.PARAMETER Days
    How far back to look, in days. Defaults to 7.

.PARAMETER Recurse
    Include files in all subfolders.

.PARAMETER Filter
    Optional wildcard filter, for example *.txt or report*.pdf.

.PARAMETER Print
    Send the file list to a printer.

.PARAMETER PrinterName
    Printer to use with -Print. Defaults to the Windows default printer.

.EXAMPLE
    .\Find-RecentlyModifiedFiles.ps1

.EXAMPLE
    .\Find-RecentlyModifiedFiles.ps1 -Path C:\Documents -Recurse

.EXAMPLE
    .\Find-RecentlyModifiedFiles.ps1 -Days 3 -Filter *.log -Recurse

.EXAMPLE
    .\Find-RecentlyModifiedFiles.ps1 -Recurse -Print

.EXAMPLE
    .\Find-RecentlyModifiedFiles.ps1 -Recurse -Print -PrinterName "Microsoft Print to PDF"
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Path = (Get-Location).Path,

    [ValidateRange(1, [int]::MaxValue)]
    [int]$Days = 7,

    [switch]$Recurse,

    [string]$Filter = '*',

    [switch]$Print,

    [string]$PrinterName
)

if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
    Write-Error "Folder not found: $Path"
    exit 1
}

$resolvedPath = (Resolve-Path -LiteralPath $Path).Path
$cutoff = (Get-Date).AddDays(-$Days)

$getChildItemParams = @{
    LiteralPath = $resolvedPath
    File        = $true
    Filter      = $Filter
    ErrorAction = 'Continue'
}

if ($Recurse) {
    $getChildItemParams['Recurse'] = $true
}

$files = Get-ChildItem @getChildItemParams |
    Where-Object { $_.LastWriteTime -ge $cutoff }

if (-not $files) {
    Write-Host "No files modified in the last $Days day(s) in '$resolvedPath'."
    exit 0
}

$table = $files |
    Sort-Object LastWriteTime -Descending |
    Select-Object @{
        Name       = 'Name'
        Expression = { $_.Name }
    }, @{
        Name       = 'SizeKB'
        Expression = { [math]::Round($_.Length / 1KB, 2) }
    }, LastWriteTime, FullName |
    Format-Table -AutoSize |
    Out-String

$summary = "Files modified in the last {0} day(s): {1}" -f $Days, @($files).Count
$output = $table + $summary

Write-Host $output

if ($Print) {
    $printerParams = @{}
    if ($PrinterName) {
        $printerParams['Name'] = $PrinterName
    }
    $output | Out-Printer @printerParams
    Write-Host "Sent list to printer."
}
