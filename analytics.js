/**
 * Vercel Web Analytics initialization
 * This script initializes Vercel Web Analytics for the AI Resume Builder
 */

import { inject } from '@vercel/analytics';

// Initialize Vercel Analytics
inject({
  mode: 'auto', // Automatically detects development vs production
  debug: false  // Set to true for debugging in development
});
