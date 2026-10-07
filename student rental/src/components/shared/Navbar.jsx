import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useExchangeStore } from '@/store/exchangeStore'
import { useThemeStore } from '@/store/themeStore'
import { users } from '@/data/users'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/discover', label: 'Discover' },
  { to: '/compare', label: 'Compare' },
]

export function Navbar() {
  const location = useLocation()
  const { currentUser, setCurrentUser } = useExchangeStore()
  const { theme, toggleTheme } = useThemeStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  if (location.pathname !== '/') return null;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border-subtle">
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border-2 border-accent flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-accent" />
          </div>
          <span className="font-display text-lg font-semibold text-text-primary">
            Campus Circular
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-4">
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'text-accent'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-text-primary/5 transition-colors duration-150 cursor-pointer text-text-secondary mr-1"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            id="theme-toggle"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="group flex items-center gap-2 px-2 py-1.5 rounded-[4px] hover:bg-text-primary/5 transition-colors duration-150 cursor-pointer"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-medium text-accent">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline text-sm text-text-primary font-medium">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown
                size={14}
                className={cn(
                  'opacity-0 group-hover:opacity-100 text-text-secondary transition-all duration-150',
                  userMenuOpen && 'opacity-100 rotate-180'
                )}
              />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-40 w-52 rounded-[4px] border border-border-subtle bg-surface-raised shadow-lg py-1">
                  <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-text-secondary/60">
                    Switch User
                  </p>
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user)
                        setUserMenuOpen(false)
                      }}
                      className={cn(
                        'flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors duration-150 cursor-pointer',
                        currentUser.id === user.id
                          ? 'bg-accent/10 text-accent'
                          : 'text-text-primary hover:bg-text-primary/5'
                      )}
                    >
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-medium text-accent">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{user.name}</p>
                        <p className="text-[10px] text-text-secondary truncate">{user.department}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

Navbar.displayName = 'Navbar'