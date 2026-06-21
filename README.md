# ResumeMatch AI - Complete Beginner Guide

## What is ResumeMatch AI?
ResumeMatch AI is a web app that helps you analyze your resume against a job description using an ATS (Applicant Tracking System) scoring engine and AI-powered suggestions!

## Prerequisites to Run Locally
- Node.js 18 or newer
- npm (comes with Node.js)
- MongoDB (local or cloud instance like MongoDB Atlas)
- Clerk account (for authentication)
- OpenAI account (for AI features)
- UploadThing account (for resume uploads)
- Stripe account (optional, for premium subscriptions)

---

## Step 1: Set Up Environment Variables
First, open `.env.local` and fill in all missing keys (replace XXX with your actual credentials):

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MongoDB (get from MongoDB Atlas or local MongoDB)
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/resumematch

# Clerk (get from Clerk Dashboard for app_3FPPQ0xIJ8xDMLr87f4xQmKovIW)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_3FPPQ0xIJ8xDMLr87f4xQmKovIW
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# UploadThing (get from UploadThing Dashboard)
UPLOADTHING_SECRET=sk_live_your_uploadthing_secret
UPLOADTHING_APP_ID=app_your_uploadthing_app_id

# Upstash Redis (optional, for rate limiting)
UPSTASH_REDIS_REST_URL=https://your-upstash-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# OpenAI (get from OpenAI Platform)
OPENAI_API_KEY=sk-proj-your_openai_api_key

# Stripe (optional, for premium)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Guest JWT (keep this secret!)
GUEST_JWT_SECRET=your-super-secret-key-change-this-in-production
```

---

## Step 2: Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

---

## Step 3: Start the Development Server
Run:
```bash
npm run dev
```
The app will open at http://localhost:3000!

---

## Full User Flow

### Step A: Open the App
Go to http://localhost:3000 in your browser.

### Step B: Sign Up / Log In
- When you first open the app, you’ll see the navigation bar with "Sign In" and "Sign Up" buttons
- Click "Sign Up" → create an account using email/password or social login
- After signing in, your user profile button will appear in the top-right

### Step C: Upload or Paste Your Resume
*(Note: The UI components for resume upload/paste are not yet implemented—you can use the API directly for now!)*

To create a resume via API:
1. Use Postman or curl to send a POST request to `/api/resumes`
2. Include your resume text in the request body

### Step D: Run ATS Analysis
*(Note: The analysis UI is not yet implemented—use the API directly!)*
1. Send a POST request to `/api/analyses` with a resume ID and job description
2. Get back an ATS score (0-100%), missing keywords, and skill gaps
3. Also get AI-generated suggestions to improve your resume

---

## User Roles
1. **Guest User**: Limited access, uses a temporary JWT valid for 24 hours
2. **Registered User**: Full access to basic features
3. **Premium User**: Unlimited access to all features (requires Stripe subscription)

---

## Common Mistakes to Avoid
1. **Forgetting to set environment variables**: The app won't work without `.env.local` correctly filled!
2. **Not starting MongoDB**: Make sure your MongoDB instance is running
3. **Exposing secret keys**: Never commit `.env.local` to GitHub!
4. **Skipping npm install**: Always run `npm install` after pulling the repo

---

## Next Steps
- Explore the Clerk Dashboard: https://dashboard.clerk.com/
- Check out Clerk's Components: https://clerk.com/docs/reference/components/overview
- Set up Stripe for premium subscriptions (optional)

---

## Assumptions
The UI components for resume upload, analysis dashboard, and premium checkout are not yet fully built—these can be added using the existing API endpoints!
