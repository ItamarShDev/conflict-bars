# Convex Migration Guide

This document outlines the migration from static TypeScript files to Convex DB for songs and events data.

## What Was Done

### 1. Installed Convex
- Added `convex` package to dependencies
- Initialized Convex configuration in `/convex` directory

### 2. Created Convex Schema (`/convex/schema.ts`)
Defined two tables:
- **songs**: Stores song data with indexes on `published_date` and `artist`
- **events**: Stores conflict/event data with indexes on `start` and `end` dates

### 3. Created Query Functions
- `/convex/songs.ts`: Query to fetch all songs sorted by date
- `/convex/events.ts`: Query to fetch all events sorted by start date
- `/convex/mutations.ts`: Mutations to insert and clear data

### 4. Created Migration Script (`/scripts/migrate-to-convex.ts`)
- Imports existing data from TypeScript files
- Clears existing Convex data
- Populates Convex with songs and events
- Verifies migration success

### 5. Updated Application Code
- Added `ConvexClientProvider` for React context
- Updated `RootLayout` to wrap app with Convex provider
- Modified page component to fetch from Convex using `preloadQuery`
- Updated utility functions to accept data as parameters
- Created helper functions to convert Convex events to timeline format

## Next Steps to Complete Migration

### 1. Start Convex Development Server

First, you need to set up your Convex deployment:

```bash
npx convex dev
```

This will:
- Create a new Convex deployment (or connect to existing)
- Generate type-safe API code in `/convex/_generated`
- Set `NEXT_PUBLIC_CONVEX_URL` in `.env.local`
- Watch for changes to your Convex functions

**Note:** Keep this terminal running during development.

### 2. Run the Migration Script

In a new terminal, populate the database with existing data:

```bash
npm run migrate
```

This will:
- Clear any existing data in Convex
- Import all songs from static files
- Import all events/conflicts from static files
- Display migration progress and results

### 3. Start the Next.js Development Server

```bash
npm run dev
```

The app should now fetch data from Convex instead of static files.

### 4. Verify the Migration

1. Visit http://localhost:3000/en or http://localhost:3000/he
2. Check that all songs and events appear correctly
3. Verify timeline functionality works as before

### 5. Convex Dashboard

You can view and manage your data at https://dashboard.convex.dev

## File Changes Summary

### New Files
- `/convex/schema.ts` - Database schema definition
- `/convex/songs.ts` - Song queries
- `/convex/events.ts` - Event queries
- `/convex/mutations.ts` - Data mutations
- `/scripts/migrate-to-convex.ts` - Migration script
- `/src/components/ConvexClientProvider.tsx` - React provider
- `/src/utils/convex-helpers.ts` - Type conversion helpers

### Modified Files
- `/package.json` - Added Convex dependency and migrate script
- `/src/app/layout.tsx` - Added ConvexClientProvider
- `/src/app/[lang]/page.tsx` - Fetch from Convex instead of static imports
- `/src/app/timeline/types.ts` - Added Convex-specific types
- `/src/utils/timeline.ts` - Accept data as parameters

### Files That Can Be Removed (After Verification)
Once you verify everything works, you can optionally remove:
- `/src/app/timeline/index.ts`
- `/src/app/timeline/conflicts.ts`
- `/src/app/timeline/subliminal/*.ts`
- `/src/app/timeline/shabak-samech/*.ts`
- `/src/app/timeline/sagol-59/*.ts`
- `/src/app/timeline/tuna/*.ts`
- `/src/app/timeline/peled/*.ts`

**Keep these for now** as they're still used by the migration script.

## Benefits of Convex

1. **Real-time Updates**: Data changes propagate instantly to all clients
2. **Type Safety**: Fully type-safe queries and mutations
3. **Serverless**: No database infrastructure to manage
4. **Scalable**: Automatically scales with your app
5. **Developer Experience**: Great local development with hot reloading

## Future Enhancements

With Convex in place, you can now easily add:
- Admin interface to add/edit songs and events
- User comments and ratings
- Real-time collaboration features
- Full-text search across songs and events
- Export/import functionality
- Version history for edits

## Troubleshooting

### TypeScript Errors in Migration Script
These are expected until Convex dev server runs and generates types. Start `npx convex dev` first.

### "NEXT_PUBLIC_CONVEX_URL not set" Error
Run `npx convex dev` to configure your deployment and set the environment variable.

### Data Not Appearing
1. Check that migration script completed successfully
2. Verify Convex dev server is running
3. Check browser console for errors
4. Visit Convex dashboard to inspect data

### Build Errors
Ensure Convex dev server is running before building, as it generates required types.
