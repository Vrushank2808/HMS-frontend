# HMS Frontend - Hostel Management System

A modern, responsive frontend application for the Hostel Management System built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Role-based Dashboards**: Different interfaces for Admin, Warden, Security, and Students
- **Real-time Notifications**: Toast notifications for user feedback
- **Authentication**: Secure OTP-based login system
- **Password Reset**: User-friendly password reset with OTP verification
- **Admin Panel**: Comprehensive admin tools for system management
- **Mobile Responsive**: Works seamlessly on all device sizes

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Heroicons & Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/HMS-frontend.git
cd HMS-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your backend API URL
```

4. Start the development server:
```bash
npm run dev
```

## 🌐 Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
vercel --prod
```

### Environment Variables

Required environment variables:

- `VITE_API_URL`: Backend API URL
- `VITE_NODE_ENV`: Environment (production/development)

## 🎨 UI Components

### Dashboards

- **Admin Dashboard**: Complete system overview with statistics and quick actions
- **Student Dashboard**: Personal room info, complaints, visitor management
- **Warden Dashboard**: Student and room management tools
- **Security Dashboard**: Visitor check-in/out system

### Key Features

- **Authentication Flow**: OTP-based login with role selection
- **Password Reset Manager**: Admin tool for helping users reset passwords
- **Responsive Sidebar**: Collapsible navigation with role-based menu items
- **Notification System**: Toast notifications for user feedback
- **Loading States**: Smooth loading animations throughout the app

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- JWT token management
- Role-based route protection
- Secure API communication
- Input validation and sanitization
- XSS protection

## 🎯 User Roles & Permissions

### Admin
- Full system access
- User management
- Room management
- Complaint handling
- Email configuration
- Password reset assistance

### Warden
- Student management
- Room allocation
- Complaint review
- Basic reporting

### Security
- Visitor management
- Check-in/out system
- Security monitoring

### Student
- Personal dashboard
- Room information
- Complaint submission
- Visitor requests
- Profile management

## 🚀 Performance Optimizations

- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization with Vite
- Efficient re-rendering with React.memo()
- Optimized animations with Framer Motion

## 🧪 Testing

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email support@hms.com or create an issue in the repository.

## 🔗 Related Repositories

- [HMS Backend](https://github.com/yourusername/HMS-backend) - Backend API for this application