$file = 'd:\VTT\vtt-react\src\data\classes\arcanoneerData.js'
$lines = [System.IO.File]::ReadAllLines($file)
# Keep lines 0-2756 (which is line 1-2757 in 1-indexed, ending with "};\n")
$newLines = $lines[0..2757]
[System.IO.File]::WriteAllLines($file, $newLines)
Write-Host "Truncated from $($lines.Length) to $($newLines.Length) lines"
