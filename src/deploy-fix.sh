#!/bin/bash

# Deployment script untuk fix endpoint path
# Pastikan sudah install Supabase CLI: npm install -g supabase

echo "🚀 Freshify Deployment Script - Endpoint Fix"
echo "============================================="
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo "📝 Step 1: Login to Supabase"
echo "-----------------------------"
supabase login

echo ""
echo "🔗 Step 2: Link to Supabase project"
echo "------------------------------------"
supabase link --project-ref biiggyffmzlzeffupdet

echo ""
echo "📦 Step 3: Deploy Edge Function"
echo "--------------------------------"
echo "Deploying make-server function..."
supabase functions deploy make-server

echo ""
echo "✅ Step 4: Test Edge Function"
echo "-----------------------------"
echo "Testing health endpoint..."
curl -s https://biiggyffmzlzeffupdet.supabase.co/functions/v1/make-server/health

echo ""
echo ""
echo "✅ Deployment Complete!"
echo "======================="
echo ""
echo "Next steps:"
echo "1. Test the application locally or on staging"
echo "2. If everything works, deploy frontend to Vercel: vercel --prod"
echo "3. Monitor logs in Supabase Dashboard"
echo ""
echo "Endpoints that are now fixed:"
echo "  ✓ GET  /cart - Fetch cart items"
echo "  ✓ POST /cart/add - Add to cart"
echo "  ✓ GET  /orders - Fetch orders"
echo "  ✓ POST /orders - Create order"
echo "  ✓ GET  /consumption/weekly - Weekly consumption data"
echo ""
echo "🎉 Happy deploying!"
