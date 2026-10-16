#!/bin/bash

# JPAWORX Resume Builder - TypeScript Error Fix Script
# Run this script to automatically fix some build errors

echo "========================================="
echo "Fixing TypeScript Build Errors"
echo "========================================="
echo ""

# Fix 1: professional-template.tsx - Add type annotations
echo "Fix 1: Adding type annotations to professional-template.tsx..."
sed -i 's/.filter((line) => line\.trim())/.filter((line: string) => line.trim())/g' components/templates/professional-template.tsx
sed -i 's/.map((line, i) =>/.map((line: string, i: number) =>/g' components/templates/professional-template.tsx
echo "✓ Fixed professional-template.tsx"

echo ""
echo "========================================="
echo "Automatic fixes complete!"
echo "========================================="
echo ""
echo "⚠️  IMPORTANT: lib/docx-generator.ts still needs manual fixes"
echo ""
echo "The DOCX generator has 27 errors due to API changes."
echo "Options:"
echo "  1. Use the simplified DOCX generator (recommended for quick deploy)"
echo "  2. Manually refactor all paragraphs to use TextRun children"
echo ""
echo "To use simplified DOCX generator:"
echo "  See: FIX_TYPESCRIPT_ERRORS.md - Step 2, Option A"
echo ""
echo "After fixing, run: npm run build"
echo ""
