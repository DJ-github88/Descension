Add-Type -AssemblyName System.Drawing;
$img = [System.Drawing.Image]::FromFile('D:\VTT\Images\Editor\Tiles\WaterTiles.png');
$w = 344;
$h = 384;
for ($r = 0; $r -lt 2; $r++) {
    for ($c = 0; $c -lt 4; $c++) {
        $idx = $r * 4 + $c + 1;
        $bmp = New-Object System.Drawing.Bitmap($w, $h);
        $g = [System.Drawing.Graphics]::FromImage($bmp);
        $srcRect = New-Object System.Drawing.Rectangle(($c * $w), ($r * $h), $w, $h);
        $destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h);
        $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel);
        $bmp.Save("D:\VTT\vtt-react\public\assets\tiles\Water$idx.png", [System.Drawing.Imaging.ImageFormat]::Png);
        $g.Dispose();
        $bmp.Dispose();
        Write-Output "Saved Tile $idx";
    }
}
$img.Dispose();
