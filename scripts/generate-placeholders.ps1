# Generates the on-brand placeholder artwork in /public/images.
#
#   powershell -ExecutionPolicy Bypass -File scripts/generate-placeholders.ps1
#
# Existing files are skipped, so it is safe to re-run after dropping in your own
# photos. See README.md for the recommended sizes.

param([string]$Root = (Join-Path $PSScriptRoot ".."))

Add-Type -AssemblyName System.Drawing

$imagesDir = Join-Path $Root "public\images"
$publicDir = Join-Path $Root "public"
New-Item -ItemType Directory -Force -Path $imagesDir | Out-Null

function Get-Font {
  param([string[]]$Names, [single]$Size, [string]$Style = "Regular")

  foreach ($name in $Names) {
    try {
      $font = [System.Drawing.Font]::new(
        $name,
        $Size,
        [System.Drawing.FontStyle]::$Style,
        [System.Drawing.GraphicsUnit]::Pixel
      )
      if ($font.Name -eq $name) { return $font }
      $font.Dispose()
    } catch { }
  }
  return [System.Drawing.Font]::new(
    "Arial",
    $Size,
    [System.Drawing.FontStyle]::$Style,
    [System.Drawing.GraphicsUnit]::Pixel
  )
}

function Save-Jpeg {
  param([System.Drawing.Bitmap]$Bitmap, [string]$Path)

  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq "image/jpeg" }
  $encoderParams = [System.Drawing.Imaging.EncoderParameters]::new(1)
  $encoderParams.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new(
    [System.Drawing.Imaging.Encoder]::Quality, [long]82
  )
  $Bitmap.Save($Path, $codec, $encoderParams)
  $encoderParams.Dispose()
}

function New-Placeholder {
  param(
    [string]$FileName,
    [int]$Width,
    [int]$Height,
    [string]$TopColor,
    [string]$BottomColor
  )

  $path = Join-Path $imagesDir $FileName
  if (Test-Path $path) {
    Write-Host "  skip  $FileName (already exists)"
    return
  }

  $bitmap = [System.Drawing.Bitmap]::new($Width, $Height)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $rect = [System.Drawing.Rectangle]::new(0, 0, $Width, $Height)
  $gradient = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    [System.Drawing.ColorTranslator]::FromHtml($TopColor),
    [System.Drawing.ColorTranslator]::FromHtml($BottomColor),
    38.0
  )
  $g.FillRectangle($gradient, $rect)

  # Soft light bloom.
  $bloom = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(20, 255, 245, 225))
  $g.FillEllipse($bloom, [int]($Width * 0.52), [int](-$Height * 0.25), [int]($Width * 0.75), [int]($Width * 0.75))

  # Kolam dot grid.
  $dot = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(34, 255, 248, 236))
  $step = [int]($Width / 20)
  for ($x = $step; $x -lt $Width; $x += $step) {
    for ($y = $step; $y -lt $Height; $y += $step) {
      $g.FillEllipse($dot, $x, $y, 2, 2)
    }
  }

  # Minimal illustration label; visitor-facing art never includes filenames or replacement instructions.
  $frame = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(52, 255, 248, 236), 2)
  $inset = [int]($Width * 0.028)
  $g.DrawRectangle($frame, $inset, $inset, $Width - ($inset * 2), $Height - ($inset * 2))
  $labelFont = Get-Font -Names @("Segoe UI") -Size ([single]([Math]::Max(14, $Width / 64))) -Style "Regular"
  $muted = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(220, 255, 248, 236))
  $label = "Illustration"
  $labelSize = $g.MeasureString($label, $labelFont)
  $g.DrawString($label, $labelFont, $muted, ($Width - $labelSize.Width) / 2, $Height - $labelSize.Height - [int]($Height * 0.045))

  Save-Jpeg -Bitmap $bitmap -Path $path

  $muted.Dispose(); $labelFont.Dispose()
  $frame.Dispose(); $dot.Dispose(); $bloom.Dispose()
  $gradient.Dispose(); $g.Dispose(); $bitmap.Dispose()

  Write-Host "  make  $FileName"
}

function New-Icon {
  param([string]$FileName, [int]$Size)

  $path = Join-Path $publicDir $FileName
  if (Test-Path $path) {
    Write-Host "  skip  $FileName (already exists)"
    return
  }

  $bitmap = [System.Drawing.Bitmap]::new($Size, $Size)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  $bg = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#FBF5E9"))
  $g.FillRectangle($bg, 0, 0, $Size, $Size)

  $orange = [System.Drawing.ColorTranslator]::FromHtml("#A8460F")
  $petal = [System.Drawing.SolidBrush]::new($orange)
  $cx = [int]($Size / 2)
  $cy = [int]($Size / 2)
  $r = [int]($Size * 0.19)
  $d = [int]($r * 1.55)

  $g.FillEllipse($petal, $cx - [int]($d / 2), $cy - $r - [int]($d / 2), $d, $d)
  $g.FillEllipse($petal, $cx - [int]($d / 2), $cy + $r - [int]($d / 2), $d, $d)
  $g.FillEllipse($petal, $cx - $r - [int]($d / 2), $cy - [int]($d / 2), $d, $d)
  $g.FillEllipse($petal, $cx + $r - [int]($d / 2), $cy - [int]($d / 2), $d, $d)

  $cream = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#FBF5E9"))
  $g.FillEllipse($cream, $cx - [int]($Size * 0.035), $cy - [int]($Size * 0.035), [int]($Size * 0.07), [int]($Size * 0.07))

  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

  $cream.Dispose(); $petal.Dispose(); $bg.Dispose(); $g.Dispose(); $bitmap.Dispose()
  Write-Host "  make  $FileName"
}

function New-ShareImage {
  $path = Join-Path $imagesDir "og-image.jpg"
  if (Test-Path $path) {
    Write-Host "  skip  og-image.jpg (already exists)"
    return
  }

  $width = 1200; $height = 630
  $bitmap = [System.Drawing.Bitmap]::new($width, $height)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $rect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
  $gradient = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    [System.Drawing.ColorTranslator]::FromHtml("#2B1A10"),
    [System.Drawing.ColorTranslator]::FromHtml("#A8460F"),
    25.0
  )
  $g.FillRectangle($gradient, $rect)

  $bloom = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(24, 255, 235, 200))
  $g.FillEllipse($bloom, 760, -180, 700, 700)

  $dot = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(38, 255, 248, 236))
  for ($x = 40; $x -lt $width; $x += 60) {
    for ($y = 40; $y -lt $height; $y += 60) {
      $g.FillEllipse($dot, $x, $y, 2, 2)
    }
  }

  $titleFont = Get-Font -Names @("Georgia") -Size 96 -Style "Bold"
  $subFont = Get-Font -Names @("Segoe UI") -Size 30
  $smallFont = Get-Font -Names @("Segoe UI") -Size 22 -Style "Bold"

  $cream = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#FBF5E9"))
  $warm = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(220, 251, 245, 233))
  $turmeric = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#E8B35A"))

  $g.DrawString("Brihadhee", $titleFont, $cream, 72, 168)
  $g.DrawString("South Indian restaurant", $subFont, $warm, 80, 320)
  $g.DrawString("Anna Nagar East, Chennai", $subFont, $warm, 80, 366)
  $g.DrawString("CUSTOMIZABLE DOSAS  /  FILTER COFFEE  /  FAMILY DINING", $smallFont, $turmeric, 80, 470)

  Save-Jpeg -Bitmap $bitmap -Path $path

  $turmeric.Dispose(); $warm.Dispose(); $cream.Dispose()
  $smallFont.Dispose(); $subFont.Dispose(); $titleFont.Dispose()
  $dot.Dispose(); $bloom.Dispose(); $gradient.Dispose(); $g.Dispose(); $bitmap.Dispose()
  Write-Host "  make  og-image.jpg"
}

Write-Host "Generating text-free illustration fallbacks"
New-Placeholder -FileName "hero.jpg" -Width 1600 -Height 1200 -TopColor "#6E3416" -BottomColor "#C6551A"
New-Placeholder -FileName "interior.jpg" -Width 1200 -Height 900 -TopColor "#3A2216" -BottomColor "#8A5A34"
New-Placeholder -FileName "dosa.jpg" -Width 1200 -Height 900 -TopColor "#A8460F" -BottomColor "#E0A128"
New-Placeholder -FileName "coffee.jpg" -Width 1000 -Height 1000 -TopColor "#4A2A1A" -BottomColor "#B4682F"
New-Placeholder -FileName "meals.jpg" -Width 1200 -Height 900 -TopColor "#35502F" -BottomColor "#8AA055"
New-Placeholder -FileName "idiyappam.jpg" -Width 1200 -Height 900 -TopColor "#8C390C" -BottomColor "#D0912A"
New-Placeholder -FileName "sweets.jpg" -Width 1200 -Height 900 -TopColor "#7A3411" -BottomColor "#C07A3E"
New-ShareImage

Write-Host "Icons"
New-Icon -FileName "icon-192.png" -Size 192
New-Icon -FileName "icon-512.png" -Size 512

Write-Host "Done."
