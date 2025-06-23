import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Users, Briefcase, Home } from 'lucide-react'

export function Navbar() {
  const location = useLocation()

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: Users },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">
              Recruiting Tool
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Button
                  key={href}
                  variant={location.pathname === href ? 'default' : 'ghost'}
                  asChild
                >
                  <Link to={href} className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 