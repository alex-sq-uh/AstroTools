# Sirve toda la suite AstroTools desde la raíz en http://localhost:3000/
# /            -> hub
# /casa/       -> AstroHome
# /nomina/     -> AstroPayroll
# /ahorro/     -> AstroSavings
# /shared/...  -> CSS y JS compartidos
$root = Split-Path $MyInvocation.MyCommand.Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:3000/")
$listener.Start()
Write-Host "AstroTools sirviendo en http://localhost:3000/"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  $path = $req.Url.LocalPath.TrimStart('/')
  if ($path -eq '') { $path = 'index.html' }
  $file = Join-Path $root $path
  # carpeta -> index.html dentro de ella
  if ((Test-Path $file) -and (Get-Item $file).PSIsContainer) { $file = Join-Path $file 'index.html' }
  if (Test-Path $file -PathType Leaf) {
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $ext = [System.IO.Path]::GetExtension($file)
    $mime = switch ($ext) {
      '.html' { 'text/html; charset=utf-8' }
      '.js'   { 'application/javascript; charset=utf-8' }
      '.css'  { 'text/css; charset=utf-8' }
      '.json' { 'application/json; charset=utf-8' }
      '.svg'  { 'image/svg+xml' }
      default { 'application/octet-stream' }
    }
    $res.ContentType = $mime
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $res.StatusCode = 404
  }
  $res.OutputStream.Close()
}
