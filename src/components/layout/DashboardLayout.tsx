import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Github, Code2, ClipboardList, MessageSquare,
  FolderGit2, User, LogOut, Menu, X, Shield, ChevronRight, Bell, Settings
} from 'lucide-react'
import { useState } from 'react'
import { mockStudent } from '@/data/mockData'
import { clsx } from 'clsx'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/dashboard/github', label: 'GitHub', icon: Github },
  { path: '/dashboard/skills', label: 'Skills', icon: Code2 },
  { path: '/dashboard/assessments', label: 'Assessments', icon: ClipboardList },
  { path: '/dashboard/interview', label: 'AI Interview', icon: MessageSquare },
  { path: '/dashboard/projects', label: 'Projects', icon: FolderGit2 },
]

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">SkillProof</span>
          </Link>
        </div>

        {/* Student card */}
        <div className="p-4 mx-3 mt-4 glass-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
              {mockStudent.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{mockStudent.name}</p>
              <p className="text-xs text-slate-500 truncate">{mockStudent.title}</p>
            </div>
            <div className="ml-auto text-xs font-bold text-brand-400">{mockStudent.skillProofScore}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 mt-3">
          {navItems.map(item => {
            const Icon = item.icon
            const active = isActive(item.path, item.exact)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={clsx('sidebar-item', active && 'active')}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <Link to={`/profile/${mockStudent.username}`} className="sidebar-item">
            <User className="w-4 h-4" />
            Public Profile
          </Link>
          <button className="sidebar-item w-full" onClick={() => navigate('/')}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-dark-800/80 backdrop-blur-xl border-b border-white/5 flex items-center px-4 gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1" />
          <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-xs cursor-pointer">
            {mockStudent.name.split(' ').map(n => n[0]).join('')}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
