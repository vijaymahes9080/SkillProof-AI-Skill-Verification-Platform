import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Github, Zap, ArrowRight, CheckCircle2, AlertCircle,
  TrendingUp, Code2, GitBranch, ClipboardList, MessageSquare,
  Award, BookOpen, Clock
} from 'lucide-react'
import { mockStudent, mockSkills, mockAssessments } from '@/data/mockData'
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts'

const scoreData = [{ value: mockStudent.skillProofScore, fill: 'url(#brandGrad)' }]

const recentActivity = [
  { icon: CheckCircle2, text: 'Java assessment completed — 91%', time: '3 days ago', color: 'text-verified' },
  { icon: Github, text: 'GitHub repository analyzed — smart-agriculture-platform', time: '5 days ago', color: 'text-slate-400' },
  { icon: CheckCircle2, text: 'React assessment completed — 86%', time: '1 week ago', color: 'text-verified' },
  { icon: GitBranch, text: 'Project added — E-Commerce REST API', time: '2 weeks ago', color: 'text-brand-400' },
  { icon: MessageSquare, text: 'AI Interview completed — Java — 86%', time: '2 weeks ago', color: 'text-purple-400' },
]

const quickActions = [
  { icon: Github, label: 'Connect GitHub', desc: 'Analyze your repos', path: '/dashboard/github', color: 'from-slate-600 to-slate-800' },
  { icon: ClipboardList, label: 'Take Assessment', desc: 'Prove your skills', path: '/dashboard/assessments', color: 'from-brand-600 to-violet-700' },
  { icon: MessageSquare, label: 'AI Interview', desc: 'Practice & verify', path: '/dashboard/interview', color: 'from-purple-600 to-pink-700' },
  { icon: GitBranch, label: 'Add Project', desc: 'Get it analyzed', path: '/dashboard/projects', color: 'from-emerald-600 to-teal-700' },
]

export default function Dashboard() {
  const completedAssessments = mockAssessments.filter(a => a.completed)
  const avgScore = Math.round(completedAssessments.reduce((s, a) => s + (a.score || 0), 0) / completedAssessments.length)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Welcome back, {mockStudent.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 text-sm">{mockStudent.college} · {mockStudent.title}</p>
      </div>

      {/* Score + Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Score */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
          className="glass p-6 md:col-span-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-gradient opacity-5" />
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">SkillProof Score</p>
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={scoreData} startAngle={90} endAngle={-270}>
                <defs>
                  <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black gradient-text">{mockStudent.skillProofScore}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
          </div>
          <div className="badge-brand mt-3">Industry Ready</div>
        </motion.div>

        {/* Stats */}
        {[
          { label: 'Verified Projects', value: mockStudent.verifiedProjects, icon: GitBranch, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Verified Skills', value: mockStudent.verifiedSkills, icon: CheckCircle2, color: 'text-verified', bg: 'bg-verified/10' },
          { label: 'Assessments Done', value: mockStudent.assessmentsCompleted, icon: Award, color: 'text-brand-400', bg: 'bg-brand-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.2 }}
              className="glass p-6 flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Skills overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-heading text-lg">Verified Skills</h2>
            <Link to="/dashboard/skills" className="text-brand-400 text-xs hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {mockSkills.slice(0, 5).map((skill, i) => (
              <Link to={`/dashboard/skills/${skill.id}`} key={skill.id} className="block group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{skill.name}</span>
                    {skill.verified && <CheckCircle2 className="w-3.5 h-3.5 text-verified" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      skill.evidenceStrength === 'HIGH' ? 'bg-verified/10 text-verified' :
                      skill.evidenceStrength === 'MEDIUM' ? 'bg-warning/10 text-warning' :
                      'bg-danger/10 text-danger'
                    }`}>{skill.evidenceStrength}</span>
                    <span className="text-sm font-bold text-white">{skill.confidenceScore}%</span>
                  </div>
                </div>
                <div className="skill-bar">
                  <motion.div
                    className="skill-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.confidenceScore}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass p-6">
          <h2 className="section-heading text-lg mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-300 leading-snug">{item.text}</p>
                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{item.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h2 className="section-heading text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon
            return (
              <Link key={action.label} to={action.path}
                className="glass p-5 flex flex-col gap-3 hover:border-brand-500/40 transition-all hover:-translate-y-1 group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{action.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors mt-auto" />
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* GitHub banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="glass p-6 flex flex-col md:flex-row items-center gap-6 border border-brand-500/20 bg-brand-gradient/5">
        <div className="w-14 h-14 rounded-2xl bg-dark-800 flex items-center justify-center shrink-0">
          <Github className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-semibold text-white mb-1">GitHub Connected ✓</h3>
          <p className="text-sm text-slate-400">{mockStudent.githubEvidenceCount.toLocaleString()} evidence points collected from {mockStudent.github} · Last synced 2 hours ago</p>
        </div>
        <Link to="/dashboard/github" className="btn-ghost text-sm px-5 py-2.5 shrink-0">
          View Analysis <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  )
}
