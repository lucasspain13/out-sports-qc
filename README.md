# This website was vibe coded using Claude 4 Sonnet

# Out Sports League - Complete Platform

A comprehensive React application for the Out Sports League LGBTQ+ sports community, featuring both a public website and a full-featured admin dashboard for league management.

## 🌟 Features

### Public Website

- **Modern React Architecture**: Built with React 18+ functional components and hooks
- **TypeScript**: Full type safety and better developer experience
- **Tailwind CSS**: Custom brand colors and gradients following the design system
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Framer Motion**: Smooth animations and micro-interactions
- **Accessibility**: WCAG 2.1 AA compliant with proper focus states and ARIA labels
- **Component Library**: Reusable UI components following design system specifications

### Admin Dashboard

- **Complete CRUD Operations**: Manage teams, players, games, and locations
- **Real-time Data Sync**: Changes instantly reflect on the public website
- **Supabase Integration**: Secure database with Row Level Security (RLS)
- **Authentication & Authorization**: Secure admin access with role-based permissions
- **Dashboard Analytics**: Overview statistics and quick actions
- **Responsive Admin UI**: Works on desktop and mobile devices

## 🎯 System Architecture

### Database (Supabase)

- **Teams**: Team information, stats, and metadata
- **Players**: Player rosters with team associations
- **Games**: Game schedules with scores and status tracking
- **Locations**: Venue information with facilities and coordinates
- **User Profiles**: Admin user management with role-based access

### Authentication

- **Supabase Auth**: Built-in user management and session handling
- **Row Level Security**: Database-level permissions and access control
- **Admin Roles**: Profile-based admin access with secure policies

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/                  # Admin dashboard components
│   │   ├── AdminLayout.tsx     # Admin dashboard layout
│   │   ├── DashboardOverview.tsx # Statistics and overview
│   │   ├── TeamManagement.tsx  # Team CRUD operations
│   │   ├── PlayerManagement.tsx # Player CRUD operations
│   │   ├── GameManagement.tsx  # Game scheduling and scores
│   │   └── LocationManagement.tsx # Venue management
│   ├── auth/                   # Authentication components
│   │   ├── AuthForm.tsx        # Login/signup forms
│   │   └── ProtectedRoute.tsx  # Route protection
│   ├── pages/                  # Page components
│   │   ├── AdminDashboard.tsx  # Main admin dashboard
│   │   ├── AdminLogin.tsx      # Admin login page
│   │   ├── RosterDemo.tsx      # Team roster displays
│   │   └── ScheduleDemo.tsx    # Game schedule displays
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx          # Button component
│   │   ├── SportCard.tsx       # Sport category cards
│   │   ├── TeamCard.tsx        # Team display cards
│   │   ├── PlayerCard.tsx      # Player profile cards
│   │   └── GameCard.tsx        # Game information cards
│   ├── layout/
│   │   └── Navigation.tsx      # Header navigation
│   └── sections/               # Page sections
│       ├── Hero.tsx            # Hero section with CTAs
│       ├── Sports.tsx          # Sports categories grid
│       ├── TeamShowcase.tsx    # Team displays
│       └── About.tsx           # About section with features
├── contexts/
│   └── AuthContext.tsx         # Authentication context
├── hooks/
│   └── useAuth.ts              # Authentication hooks
├── lib/
│   ├── supabase.ts             # Supabase client and types
│   └── database.ts             # Database API functions
├── data/
│   ├── supabase.ts             # Supabase data layer
│   └── index.ts                # Data exports
├── types/
│   └── index.ts                # TypeScript type definitions
├── index.css                   # Global styles and Tailwind imports
├── App.tsx                     # Main application component
└── main.tsx                    # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account and project

### Installation

1. **Clone and install dependencies**:

```bash
git clone <repository-url>
cd out-sports-league
npm install
```

2. **Set up environment variables**:

```bash
# Create .env file
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Set up the database**:

   - Execute `database-setup.sql` in your Supabase SQL Editor
   - Optionally run `data-migration.sql` for sample data
   - Run `admin-setup.sql` to set up admin users

4. **Start the development server**:

```bash
npm run dev
```

5. **Access the application**:
   - Public site: `http://localhost:3000`
   - Admin login: `http://localhost:3000/#admin-login`
   - Admin dashboard: `http://localhost:3000/#sports-admin`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Admin Setup

### Creating Admin Users

1. **User signs up** through the normal registration process
2. **Grant admin access** via SQL:

```sql
UPDATE user_profiles
SET is_admin = true
WHERE email = 'admin@example.com';
```

3. **Verify admin access**:

```sql
SELECT email, is_admin FROM user_profiles WHERE is_admin = true;
```

### Admin Dashboard Features

#### Dashboard Overview

- Real-time statistics (teams, players, games, locations)
- Quick action buttons for common tasks
- Upcoming and completed games tracking

#### Team Management

- Create, edit, and delete teams
- Manage team information, stats, and captains
- Assign team colors and gradients
- Track wins, losses, and team history

#### Player Management

- Add players to teams with jersey numbers
- Edit player information and quotes
- Transfer players between teams
- Manage player rosters

#### Game Management

- Schedule games between teams
- Assign games to locations
- Update game scores and status
- Track seasons and week numbers

#### Location Management

- Add and edit game venues
- Manage facility information
- Set coordinates for mapping
- Track venue capacity and amenities

## 🎨 Design System

The application implements a comprehensive design system with:

- **Brand Colors**: Orange (#FF6B35), Teal (#4ECDC4), Blue (#1A365D), Purple (#9B59B6)
- **Gradients**: Multi-stop linear gradients inspired by the logo design
- **Typography**: Inter and Poppins font families with responsive scaling
- **Components**: Consistent styling across public and admin interfaces
- **Animations**: Purposeful micro-interactions and scroll-based reveals

## 🔧 Configuration

### Database Configuration

The application uses Supabase with the following tables:

- `teams` - Team information and statistics
- `players` - Player rosters and details
- `games` - Game schedules and results
- `locations` - Venue information
- `user_profiles` - User management and admin roles

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Customization

#### Colors

Brand colors are defined in `tailwind.config.js`:

```javascript
colors: {
  brand: {
    orange: "#FF6B35",
    teal: "#4ECDC4",
    blue: "#1A365D",
    purple: "#9B59B6"
  }
}
```

#### Content

Update data through the admin dashboard or modify the database directly.

## 📚 Documentation

### Complete Guides

- **[Admin Dashboard Guide](ADMIN_DASHBOARD_GUIDE.md)** - Comprehensive admin user guide
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment and maintenance
- **[Testing Guide](TESTING_GUIDE.md)** - Complete testing procedures
- **[Supabase Setup Guide](SUPABASE_SETUP_GUIDE.md)** - Database configuration

### Quick References

- **[Admin Setup SQL](admin-setup.sql)** - SQL commands for admin user creation
- **[Database Setup](database-setup.sql)** - Complete database schema
- **[Data Migration](data-migration.sql)** - Sample data for testing

## 🔒 Security

### Authentication & Authorization

- Supabase Auth for user management
- Row Level Security (RLS) for database access
- Admin role-based permissions
- Secure session management

### Data Protection

- Input validation and sanitization
- SQL injection prevention
- HTTPS enforcement in production
- Environment variable protection

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

- **Vercel**: Automatic deployments from Git
- **Netlify**: Static site hosting with forms
- **AWS S3 + CloudFront**: Scalable CDN solution
- **Any static hosting**: Upload `dist/` folder

### Production Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Admin users created
- [ ] SSL certificate configured
- [ ] Domain configured
- [ ] Backup strategy implemented

## 🧪 Testing

### Manual Testing

1. **Public Site**: Verify all pages load and display data correctly
2. **Admin Login**: Test authentication flow
3. **CRUD Operations**: Test all admin management features
4. **Data Sync**: Verify changes appear on public site
5. **Permissions**: Test admin vs. non-admin access

### Automated Testing

```bash
# Run the automated test script
./automated-test.sh
```

## 📊 Performance

- **Lazy Loading**: Images and components load on demand
- **Code Splitting**: Optimized bundle sizes
- **Database Optimization**: Indexed queries and efficient data fetching
- **Caching**: Browser and CDN caching strategies
- **Responsive Images**: Optimized for different screen sizes

## ♿ Accessibility

- **WCAG 2.1 AA Compliant**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Proper ARIA labels and structure
- **High Contrast**: Focus states and color contrast
- **Reduced Motion**: Respects user motion preferences

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for Out Sports League. All rights reserved.

## 🆘 Support

### Common Issues

- **Admin Access**: Check user profile `is_admin` status
- **Database Connection**: Verify environment variables
- **Performance**: Check network tab for slow queries
- **Authentication**: Clear browser cache and cookies

### Getting Help

- Review the documentation guides
- Check browser console for errors
- Verify database logs in Supabase dashboard
- Test with different user accounts

---

## 🎯 Quick Start Summary

1. **Setup**: Install dependencies and configure environment
2. **Database**: Run SQL setup scripts in Supabase
3. **Admin**: Create admin user and test login
4. **Test**: Verify all functionality works
5. **Deploy**: Build and deploy to production

The Sports League platform provides a complete solution for managing LGBTQ+ sports leagues with a beautiful public website and powerful admin dashboard.
