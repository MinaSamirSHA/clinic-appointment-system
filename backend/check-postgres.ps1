# 🐘 PostgreSQL Setup Checker Script
# This script helps verify PostgreSQL installation and setup

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🐘 PostgreSQL Setup Checker          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Step 1: Check if psql is in PATH
Write-Host "📋 Step 1: Checking if PostgreSQL is in PATH..." -ForegroundColor Yellow
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if ($psqlPath) {
    Write-Host "✅ PostgreSQL found in PATH!" -ForegroundColor Green
    Write-Host "   Location: $($psqlPath.Source)" -ForegroundColor Gray
    
    # Get version
    $version = psql --version
    Write-Host "   Version: $version" -ForegroundColor Gray
} else {
    Write-Host "❌ PostgreSQL NOT found in PATH" -ForegroundColor Red
    Write-Host "   Searching for PostgreSQL installation..." -ForegroundColor Yellow
    
    # Search for PostgreSQL in common locations
    $commonPaths = @(
        "C:\Program Files\PostgreSQL",
        "C:\PostgreSQL",
        "C:\Program Files (x86)\PostgreSQL"
    )
    
    $foundPath = $null
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            Write-Host "   ✅ Found PostgreSQL at: $path" -ForegroundColor Green
            $foundPath = $path
            
            # Find bin directory
            $versions = Get-ChildItem $path -Directory
            if ($versions) {
                $latestVersion = $versions | Sort-Object Name -Descending | Select-Object -First 1
                $binPath = Join-Path $latestVersion.FullName "bin"
                
                if (Test-Path $binPath) {
                    Write-Host "`n   💡 To add PostgreSQL to PATH, run this command as Administrator:" -ForegroundColor Cyan
                    Write-Host "   [Environment]::SetEnvironmentVariable('Path', `$env:Path + ';$binPath', 'Machine')" -ForegroundColor White
                    Write-Host "`n   Or manually add this path to your System Environment Variables:" -ForegroundColor Cyan
                    Write-Host "   $binPath" -ForegroundColor White
                }
            }
            break
        }
    }
    
    if (-not $foundPath) {
        Write-Host "`n   ❌ PostgreSQL not found in common locations" -ForegroundColor Red
        Write-Host "   Please install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
        exit 1
    }
}

# Step 2: Check PostgreSQL service
Write-Host "`n📋 Step 2: Checking PostgreSQL service..." -ForegroundColor Yellow
try {
    $pgService = Get-Service | Where-Object { $_.Name -like "*postgres*" } | Select-Object -First 1
    
    if ($pgService) {
        Write-Host "✅ PostgreSQL service found: $($pgService.DisplayName)" -ForegroundColor Green
        
        if ($pgService.Status -eq "Running") {
            Write-Host "   ✅ Service is RUNNING" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Service is $($pgService.Status)" -ForegroundColor Yellow
            Write-Host "   Starting service..." -ForegroundColor Yellow
            Start-Service $pgService.Name
            Write-Host "   ✅ Service started!" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠️  No PostgreSQL service found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not check service status (may need admin rights)" -ForegroundColor Yellow
}

# Step 3: Check if database exists
Write-Host "`n📋 Step 3: Checking if clinic_db exists..." -ForegroundColor Yellow

if ($psqlPath) {
    Write-Host "   Please enter your PostgreSQL password when prompted..." -ForegroundColor Gray
    
    # Try to connect and check database
    $dbCheck = psql -U postgres -lqt 2>&1 | Select-String -Pattern "clinic_db"
    
    if ($dbCheck) {
        Write-Host "✅ Database 'clinic_db' exists!" -ForegroundColor Green
    } else {
        Write-Host "❌ Database 'clinic_db' does NOT exist" -ForegroundColor Red
        Write-Host "`n   To create the database, run:" -ForegroundColor Yellow
        Write-Host "   psql -U postgres -c `"CREATE DATABASE clinic_db;`"" -ForegroundColor White
    }
} else {
    Write-Host "⚠️  Skipping database check (psql not in PATH)" -ForegroundColor Yellow
}

# Step 4: Check .env file
Write-Host "`n📋 Step 4: Checking .env configuration..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot ".env"

if (Test-Path $envPath) {
    Write-Host "✅ .env file found" -ForegroundColor Green
    
    $envContent = Get-Content $envPath -Raw
    if ($envContent -match "DATABASE_URL=(.+)") {
        $dbUrl = $matches[1]
        Write-Host "   Database URL: $dbUrl" -ForegroundColor Gray
        
        if ($dbUrl -match "YOUR_PASSWORD") {
            Write-Host "   ⚠️  WARNING: Please update YOUR_PASSWORD in .env file!" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ .env file NOT found" -ForegroundColor Red
    Write-Host "   Please copy .env.example to .env and configure it" -ForegroundColor Yellow
}

# Summary
Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  📊 Setup Summary                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. If PostgreSQL is not in PATH, add it using the command above" -ForegroundColor White
Write-Host "2. Make sure PostgreSQL service is running" -ForegroundColor White
Write-Host "3. Create database: psql -U postgres -c `"CREATE DATABASE clinic_db;`"" -ForegroundColor White
Write-Host "4. Run schema: psql -U postgres -d clinic_db -f database-schema.sql" -ForegroundColor White
Write-Host "5. Update .env file with correct password" -ForegroundColor White
Write-Host "6. Test connection: node test-db-connection.js" -ForegroundColor White

Write-Host "`n✨ For detailed instructions, see: postgresql-setup-guide.md`n" -ForegroundColor Cyan
