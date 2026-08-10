import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Github, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, Building2, Briefcase } from 'lucide-react'

type Role = 'student' | 'college' | 'company'

const roles: { id: Role; label: string; icon: typeof User; desc: string }[] = [
  { id: 'student', label: 'Student', icon: User, desc: 'Verify your skills and build your evidence profile' },
  { id: 'college', label: 'College', icon: Building2, desc: 'Track student employability and skill analytics' },
  { id: 'company', label: 'Company', icon: Briefcase, desc: 'Hire based on verified skills, not just resumes' },
]

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [role, setRole] = useState<Role>('student')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1500)
  }

  const handleGitHub = () => {
    setGithubLoading(true)
    setTimeout(() => {
      setGithubLoading(false)
      navigate('/dashboard')
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-dark-800 border-r border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-60" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SkillProof</span>
          </Link>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-black mb-4 leading-tight">
            Your skills,<br />
            <span className="gradient-text">verified.</span>
          </h2>
          <p className="text-slate-400 mb-8 text-lg">Don't just claim your skills. Prove them with evidence.</p>
          <div className="space-y-3">
            {[
              'GitHub repository analysis',
              'Adaptive coding assessments',
              'AI technical interviews',
              'Evidence-backed verification',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-verified shrink-0" />
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-slate-600">© 2026 SkillProof · Built by Vijay Mahes</p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">SkillProof</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-slate-500 text-sm">
              {mode === 'signup' ? 'Start verifying your skills today — it\'s free' : 'Sign in to your SkillProof account'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="glass-sm p-1 flex mb-6">
            {(['signup', 'signin'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-brand-gradient text-white shadow-brand-sm' : 'text-slate-400 hover:text-white'}`}
              >
                {m === 'signup' ? 'Sign Up' : 'Sign In'}
              </button>
            ))}
          </div>

          {/* Role selector (signup only) */}
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold">I am a</p>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map(r => {
                    const Icon = r.icon
                    return (
                      <button
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={`p-3 rounded-xl border text-center transition-all ${role === r.id ? 'border-brand-500/60 bg-brand-500/10 text-brand-400' : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <p className="text-xs font-medium">{r.label}</p>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* GitHub OAuth */}
          <button
            onClick={handleGitHub}
            disabled={githubLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/15 text-white hover:bg-white/5 hover:border-white/25 transition-all mb-4 text-sm font-medium disabled:opacity-60"
          >
            {githubLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Github className="w-4 h-4" />
            )}
            {githubLoading ? 'Connecting to GitHub...' : 'Continue with GitHub'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-600">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Full name" required className="input-dark pl-11" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="email" placeholder="Email address" defaultValue={mode === 'signin' ? 'Vijaypradhap2004@gmail.com' : ''} required className="input-dark pl-11" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type={showPass ? 'text' : 'password'} placeholder="Password" required className="input-dark pl-11 pr-11" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === 'signup' && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 accent-brand-500" />
                <span className="text-xs text-slate-500">I agree to the <a href="#" className="text-brand-400 hover:underline">Terms of Service</a> and <a href="#" className="text-brand-400 hover:underline">Privacy Policy</a></span>
              </label>
            )}

            <button type="submit" disabled={loading} className="btn-brand w-full justify-center text-sm py-3.5">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signup' ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')} className="text-brand-400 hover:underline font-medium">
              {mode === 'signup' ? 'Sign in' : 'Sign up free'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
