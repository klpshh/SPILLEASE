# 🚀 Deploy to GitHub - Step by Step Guide

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository: `bill-splitter-app` (or any name you prefer)
5. Make it **Public** (so you can deploy to GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Connect Your Local Repository

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/bill-splitter-app.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section (in the left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

## Step 4: Build and Deploy

Since this is a Vite React app, you need to build it first:

```bash
# Install dependencies (if not already done)
npm install

# Build the project
npm run build

# The build files will be in the 'dist' folder
```

## Step 5: Deploy Build Files

1. Copy the contents of the `dist` folder to your repository root
2. Commit and push the changes:

```bash
# Copy dist contents to root (you'll need to do this manually)
# Then commit and push
git add .
git commit -m "Add build files for GitHub Pages"
git push
```

## Alternative: Use GitHub Actions (Recommended)

Create a `.github/workflows/deploy.yml` file in your repository:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

Then:
1. Go to repository Settings → Pages
2. Change source to "Deploy from a branch"
3. Select "gh-pages" branch
4. Save

## Your App URL

After deployment, your app will be available at:
`https://YOUR_USERNAME.github.io/bill-splitter-app/`

## Troubleshooting

- If you see a 404 error, make sure the repository is public
- If the build fails, check that all dependencies are in package.json
- If the page is blank, check the browser console for errors

## Next Steps

1. Customize the repository description on GitHub
2. Add topics/tags to your repository
3. Share your deployed app with friends!
4. Consider adding more features like Firebase integration

🎉 Congratulations! Your bill splitter app is now live on GitHub Pages! 