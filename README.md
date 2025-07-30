# Seiko Serial Number Decoder

A modern web application that helps you decode Seiko watch serial numbers to determine their manufacturing date and other details. The app features a beautiful Japanese snowflake-themed design with light and dark mode support.

## Features

- **Serial Number Decoding**: Decode 6 or 7 digit Seiko serial numbers
- **Multiple Date Possibilities**: View all possible manufacturing dates based on the serial number
- **Advanced Options**: Toggle between different Seiko watch characteristics
- **Responsive Design**: Works on desktop and mobile devices
- **Dark & Light Modes**: Automatically adapts to system preferences
- **Beautiful UI**: Japanese snowflake theme with smooth animations

## How to Use

1. Enter your Seiko watch's serial number (6 or 7 digits)
2. (Optional) Toggle advanced options for more specific results
3. View the possible manufacturing dates and details
4. Toggle between light and dark mode using the theme button

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development:**
   ```bash
   npm run dev
   ```
   The site will be available at [http://localhost:5173](http://localhost:5173)

3. **Build for static deployment:**
   ```bash
   npm run build
   ```
   The static site will be output to the `build/` folder.

4. **Preview the build:**
   ```bash
   npm run preview
   ```

## Deployment
- Deploy the contents of the `build/` folder to any static hosting (Netlify, Vercel, GitHub Pages, etc.)
