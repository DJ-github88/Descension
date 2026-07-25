$f = 'D:\VTT\.lore-audit-work\CANON_REFERENCE.md'
$txt = [System.IO.File]::ReadAllText($f)

$fffd = [char]0xFFFD
$oBT = [char]96
$question = [char]63
$dquote = [char]34

# Build the bad sequence: opening-backtick + FFFD + ? + " + closing-backtick
$badSeq = ($oBT.ToString() + $fffd.ToString() + $question.ToString() + $dquote.ToString() + $oBT.ToString())
Write-Host ('Bad seq length: ' + $badSeq.Length)

$foundIdx = $txt.IndexOf($badSeq)
Write-Host ('Found at: ' + $foundIdx)

if ($foundIdx -ge 0) {
    $replacement = ($oBT.ToString() + 'mojibake-display' + $oBT.ToString())
    $txt = $txt.Substring(0, $foundIdx) + $replacement + $txt.Substring($foundIdx + $badSeq.Length)
    [System.IO.File]::WriteAllText($f, $txt)
    Write-Host ('Replaced.')

    $newTxt = [System.IO.File]::ReadAllText($f)
    $fffdCount = 0
    for ($i = 0; $i -lt $newTxt.Length; $i++) {
        if ([int][char]$newTxt[$i] -eq 0xFFFD) { $fffdCount++ }
    }
    Write-Host ('Remaining U+FFFD: ' + $fffdCount)
    Write-Host ('New MD5: ' + (Get-FileHash -LiteralPath $f -Algorithm MD5).Hash)
} else {
    Write-Host 'Sequence not found'
}
