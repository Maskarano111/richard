#!/bin/bash

# 🔍 Production Readiness Verification Script
# Run this before deploying to ensure everything is properly configured

echo "🚀 Starting Production Readiness Checks..."
echo ""

ERRORS=0
WARNINGS=0

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Check 1: Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo -e "${RED}✗ Node.js v18+ required (you have $NODE_VERSION)${NC}"
  ((ERRORS++))
else
  echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"
fi
echo ""

# Check 2: Dependencies
echo "📚 Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}⚠ node_modules not found. Run: npm ci${NC}"
  ((WARNINGS++))
else
  echo -e "${GREEN}✓ Dependencies installed${NC}"
fi
echo ""

# Check 3: Environment variables
echo "🔐 Checking environment configuration..."
if [ ! -f ".env.example" ]; then
  echo -e "${RED}✗ .env.example missing${NC}"
  ((ERRORS++))
else
  echo -e "${GREEN}✓ .env.example exists${NC}"
fi

if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
  echo -e "${YELLOW}⚠ No .env file found (required for local development)${NC}"
  ((WARNINGS++))
else
  echo -e "${GREEN}✓ Environment file exists${NC}"
fi
echo ""

# Check 4: Configuration files
echo "⚙️  Checking configuration files..."
for config in netlify.toml vite.config.ts tsconfig.json package.json; do
  if [ -f "$config" ]; then
    echo -e "${GREEN}✓ $config${NC}"
  else
    echo -e "${RED}✗ $config missing${NC}"
    ((ERRORS++))
  fi
done
echo ""

# Check 5: TypeScript
echo "🔍 Running TypeScript type checking..."
npm run lint > /tmp/ts-check.log 2>&1
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ No TypeScript errors${NC}"
else
  echo -e "${RED}✗ TypeScript errors found:${NC}"
  cat /tmp/ts-check.log | head -20
  ((ERRORS++))
fi
echo ""

# Check 6: Build
echo "🏗️  Testing production build..."
npm run clean > /dev/null 2>&1
npm run build > /tmp/build.log 2>&1
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Build successful${NC}"
  DIST_SIZE=$(du -sh dist | cut -f1)
  echo "  Bundle size: $DIST_SIZE"
else
  echo -e "${RED}✗ Build failed:${NC}"
  cat /tmp/build.log | tail -20
  ((ERRORS++))
fi
echo ""

# Check 7: Build output
echo "📁 Checking build output..."
if [ -d "dist" ]; then
  echo -e "${GREEN}✓ dist/ directory created${NC}"
  if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✓ index.html found${NC}"
  else
    echo -e "${RED}✗ index.html not found in dist/${NC}"
    ((ERRORS++))
  fi
else
  echo -e "${RED}✗ dist/ directory not found${NC}"
  ((ERRORS++))
fi
echo ""

# Check 8: Netlify configuration
echo "🌐 Checking Netlify configuration..."
if grep -q "command = \"npm run build\"" netlify.toml; then
  echo -e "${GREEN}✓ Build command configured${NC}"
else
  echo -e "${RED}✗ Build command not configured in netlify.toml${NC}"
  ((ERRORS++))
fi

if grep -q "publish = \"dist\"" netlify.toml; then
  echo -e "${GREEN}✓ Publish directory configured${NC}"
else
  echo -e "${RED}✗ Publish directory not configured${NC}"
  ((ERRORS++))
fi

if grep -q "functions = \"netlify/functions\"" netlify.toml; then
  echo -e "${GREEN}✓ Functions directory configured${NC}"
else
  echo -e "${RED}✗ Functions directory not configured${NC}"
  ((ERRORS++))
fi
echo ""

# Check 9: Security headers
echo "🔒 Checking security headers..."
if grep -q "X-Frame-Options" netlify.toml; then
  echo -e "${GREEN}✓ Security headers configured${NC}"
else
  echo -e "${YELLOW}⚠ Security headers might be missing${NC}"
  ((WARNINGS++))
fi
echo ""

# Check 10: Source control
echo "📝 Checking git configuration..."
if [ -d ".git" ]; then
  echo -e "${GREEN}✓ Git repository initialized${NC}"
else
  echo -e "${YELLOW}⚠ Not a git repository. Run: git init${NC}"
  ((WARNINGS++))
fi
echo ""

# Summary
echo "=================================="
echo "📊 Verification Summary"
echo "=================================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed! Ready for production.${NC}"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found. Review above.${NC}"
  exit 0
else
  echo -e "${RED}❌ $ERRORS error(s) and $WARNINGS warning(s) found.${NC}"
  echo ""
  echo "Please fix the errors above before deploying."
  exit 1
fi
