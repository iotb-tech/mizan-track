# MIZAN TRACK

MIZAN TRACK is a web application that helps students and fellows keep track of their habits and everyday expenses in one place.

The idea is simple: help users stay consistent with the things they want to do while also giving them a better view of how they spend their money.

## Problem

Students and fellows often have personal goals they want to stay consistent with, such as coding, studying, reading, exercise, prayer/dhikr, and other daily activities. Without a fixed schedule or someone keeping them accountable, it can be easy to lose track.

Managing money can also be difficult, especially when income comes at different times through allowances, family support, or personal work. Without keeping track of expenses, it can be hard to know where the money is going.

MIZAN TRACK was built to help with both problems.

## User Research

Before building the app, we spoke with four students about how they currently track their habits and spending.

Some of the common problems they mentioned were:

- Forgetting to update their tracker
- Losing interest because tracking became repetitive
- Existing trackers being too time-consuming or complicated

The students also mentioned that they would find features such as these useful:

- Easier and faster tracking
- Reminders
- Progress charts
- Goals
- Useful statistics

These findings helped us decide what to focus on when building MIZAN TRACK.

## Solution

MIZAN TRACK brings habit and expense tracking together in one app.

Users can:

- Create and manage habits
- Mark habits as completed
- Track habit streaks
- Record expenses
- Organize expenses by category
- View their activity from a dashboard
- Manage their profile

## Features

### Authentication & Profiles

Users can create an account and log in to the application.

The app also provides a personal profile where users can view their account information.

Authentication is handled using Supabase.

### Habit Tracking

Users can create habits and choose how they want to track them.

A habit can have:

- A name
- A category
- A frequency
- Specific days
- A weekly target

#### Habit Categories

- Personal
- Health
- Learning
- Spiritual
- Productivity
- Fitness
- Other

#### Frequency Options

- Daily
- Specific Days
- Weekly Target

Users can mark habits as completed and view their progress over time.

### Streak Tracking

MIZAN TRACK keeps track of habit streaks to help users see how consistent they are.

Users can:

- Mark a habit as completed
- See their current streak
- View recent habit activity
- Check their daily completion progress

The dashboard also shows recent activity across seven days.

### Expense Tracking

Users can record their everyday expenses and organize them into categories.

An expense can contain:

- Amount
- Category
- Date
- Optional note

#### Expense Categories

- Food
- Transport
- Bills
- Shopping
- Health
- Education
- Entertainment
- Other

Expenses are displayed in Nigerian Naira (₦).

### Dashboard

The dashboard gives users a quick overview of their activity.

For habits, it shows information such as:

- Total number of habits
- Habits completed today
- Today's completion percentage
- Current streak information
- Recent seven-day activity

The dashboard also includes a section for spending-related information.

### Profile

Users can view their account information, including:

- Full name
- Email address
- Account information
- Account status

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend & Database

- Supabase
- Supabase Authentication
- PostgreSQL
- Supabase Realtime

### Data Fetching

- TanStack React Query

### Forms & Validation

- React Hook Form
- Zod

## Project Structure

```text
mizan-track/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   └── (app)/
│   │
│   ├── component/
│   │   ├── dashboard/
│   │   └── ...
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │   └── api/
│   │
│   └── types/
│
├── supabase/
│   ├── config.toml
│   └── schema.sql
│
├── public/
│
├── .env.example
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Main Folders

**`src/app`**  
Contains the application's pages and routes, including authentication and the main app pages.

**`src/component`**  
Contains reusable components used across the application.

**`src/hooks`**  
Contains custom React hooks for working with application data and actions.

Some of the hooks handle:

- Creating habits
- Fetching habits
- Deleting habits
- Toggling habit completion
- Creating expenses
- Fetching expenses

**`src/lib/api`**  
Contains functions used to interact with application data.

**`src/types`**  
Contains TypeScript types used throughout the project.

**`supabase`**  
Contains the Supabase configuration and database schema.

## Database

MIZAN TRACK uses Supabase for authentication and data storage.

The current database schema contains structures for:

- User profiles
- Habits
- Habit completion logs

Habit completion is stored separately from the main habit record so that the app can keep track of activity over time.

## Security

Supabase Row Level Security (RLS) is used to protect user data.

The database policies make sure users can only access records belonging to their own account.

## Getting Started

### Prerequisites

You'll need:

- Node.js
- npm
- Git
- A Supabase project

### 1. Clone the Repository

    git clone https://github.com/iotb-tech/mizan-track.git
    cd mizan-track

### 2. Install Dependencies

    npm install

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project.

Add the following:

    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

You can use `.env.example` as a reference.

**Do not commit your environment variables or private keys to Git.**

### 4. Run the Development Server

    npm run dev

The app should now be available on your local development server.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm start` | Starts the production build |
| `npm run lint` | Runs the linter |

## Current Status

### Implemented

- User registration and login
- User profiles
- Habit creation and management
- Habit categories
- Habit frequency settings
- Habit completion tracking
- Habit streaks
- Recent habit activity
- Expense recording
- Expense categories
- Expense dates and notes
- Dashboard
- Supabase integration
- User-specific data access
- Row Level Security

### Future Improvements

Some features that can be added or improved include:

- Habit and expense reminders
- Personal goals
- More detailed progress charts
- More habit statistics
- More detailed spending analytics
- Dynamic budget tracking
- Notifications
- Additional reports

## Contributing

If you're contributing to the project:

1. Create a new branch for your work.
2. Make your changes.
3. Test your changes locally.
4. Commit your changes.
5. Push your branch.
6. Open a pull request.

For example:
    git switch -c feature/your-feature

Then:

    git add .
    git commit -m "feat: add your feature"
    git push origin feature/your-feature

## Project Goal

The goal of MIZAN TRACK is to make habit and expense tracking simple enough to use consistently.

By putting both together in one application, users can keep an eye on their routines while also becoming more aware of their everyday spending.