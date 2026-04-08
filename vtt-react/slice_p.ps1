Add-Type -AssemblyName System.Drawing;
$img = [System.Drawing.Image]::FromFile('D:\VTT\Images\Editor\Tiles\WaterTiles.png');
# 4 columns, 2 rows. 
# Shift offsets slightly inward to skip gutters and bars.
$w = 240;
$h = 240;
for ($r = 0; $r -lt 2; $r++) {
    for ($c = 0; $c -lt 4; $c++) {
        $idx = $r * 4 + $c + 1;
        $x = 65 + ($c * 344); # Shifted right to avoid left bar
        $y = 85 + ($r * 350); # Shifted down to avoid top artifacts
        $bmp = New-Object System.Drawing.Bitmap($w, $h);
        $g = [System.Drawing.Graphics]::FromImage($bmp);
        $srcRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h);
        $destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h);
        $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel);
        $bmp.Save("D:\VTT\vtt-react\public\assets\tiles\Water$idx.png", [System.Drawing.Imaging.ImageFormat]::Png);
        $g.Dispose();
        $bmp.Dispose();
        Write-Output "Saved Clean Tile $idx at ($x, $y)";
    }
}
$img.Dispose();
