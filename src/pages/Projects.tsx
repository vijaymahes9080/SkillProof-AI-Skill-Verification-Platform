import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, GitBranch, ExternalLink, CheckCircle2, Code2,
  Database, Shield, Zap, FileText, TestTube2, Layers, Globe, X
} from 'lucide-react'
import { mockProjects } from '@/data/mockData'

const scoreMetrics = [
  { key: 'architecture' as const, label: 'Architecture', icon: Layers },
  { key: 'codeQuality' as const, label: 'Code Quality', icon: Code2 },
  { key: 'databaseDesign' as const, label: 'Database Design', icon: Database },
  { key: 'apiDesign' as const, label: 'API Design', icon: Globe },
  { key: 'testing' as const, label: 'Testing', icon: TestTube2 },
  { key: 'documentation' as const, label: 'Documentation', icon: FileText },
  { key: 'security' as const, label: 'Security', icon: Shield },
  { key: 'scalability' as const, label: 'Scalability', icon: Zap },
]

export default function ProjectsPage() {
  const [selected, setSelected] = useState<typeof mockProjects[0] | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [githubUrl, setGithubUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  const handleAnalyze = () => {
    if (!githubUrl) return
    setAnalyzing(true)
    setTimeout(() => { setAnalyzing(false); setShowAdd(false); setGithubUrl('') }, 3000)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Project Portfolio</h1>
          <p className="text-slate-500 text-sm">AI-analyzed projects with detailed technical scores</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-brand text-sm px-5 py-2.5">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Add project modal */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 border border-brand-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Add GitHub Repository for Analysis</h3>
            <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3">
            <input value={githubUrl} onChange={e => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="input-dark flex-1" />
            <button onClick={handleAnalyze} disabled={analyzing} className="btn-brand px-5 shrink-0">
              {analyzing ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
              ) : 'Analyze'}
            </button>
          </div>
          {analyzing && (
            <div className="mt-4 space-y-2">
              {['Fetching repository structure...', 'Analyzing code quality...', 'Evaluating architecture...'].map((step, i) => (
                <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.8 }}
                  className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-3 h-3 border border-brand-500 border-t-transparent rounded-full animate-spin" />
                  {step}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {selected ? (
        /* Project detail */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button onClick={() => setSelected(null)} className="text-brand-400 text-sm hover:underline mb-4 flex items-center gap-1">
            ← Back to all projects
          </button>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selected.name}</h2>
                  <p className="text-sm text-slate-400">{selected.description}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className={`text-3xl font-black ${selected.overallScore >= 80 ? 'text-verified' : 'text-warning'}`}>
                    {selected.overallScore}
                  </div>
                  <div className="text-xs text-slate-500">Overall</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {selected.technologies.map(t => (
                  <span key={t} className="badge-brand text-xs">{t}</span>
                ))}
              </div>
              <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer"
                className="btn-ghost text-sm px-4 py-2 inline-flex">
                <GitBranch className="w-4 h-4" /> View Repository <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="glass p-6">
              <h3 className="font-semibold text-white mb-4">AI Analysis Scores</h3>
              <div className="space-y-3">
                {scoreMetrics.map(m => {
                  const score = selected.scores[m.key]
                  const Icon = m.icon
                  return (
                    <div key={m.key} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">{m.label}</span>
                          <span className={`font-semibold ${score >= 80 ? 'text-verified' : score >= 65 ? 'text-warning' : 'text-danger'}`}>{score}</span>
                        </div>
                        <div className="skill-bar">
                          <motion.div className="skill-bar-fill" initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.7 }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Project grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockProjects.map((p, i) => (
            <motion.button key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              onClick={() => setSelected(p)}
              className="glass p-5 text-left hover:border-brand-500/40 transition-all hover:-translate-y-1 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shrink-0">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className={`text-xl font-black ${p.overallScore >= 80 ? 'text-verified' : 'text-warning'}`}>{p.overallScore}</div>
                  <div className="text-xs text-slate-500">/100</div>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-brand-300 transition-colors">{p.name}</h3>
              <p className="text-xs text-slate-400 mb-3 line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.technologies.slice(0, 3).map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{t}</span>
                ))}
                {p.technologies.length > 3 && <span className="text-xs text-slate-600">+{p.technologies.length - 3}</span>}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="badge-verified text-xs">Analyzed</span>
                <div className="flex gap-2">
                  {scoreMetrics.slice(0, 4).map(m => (
                    <div key={m.key} style={{ height: 24, width: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                      <div style={{ width: '100%', height: `${p.scores[m.key]}%`, background: p.scores[m.key] >= 80 ? '#10b981' : p.scores[m.key] >= 65 ? '#f59e0b' : '#f43f5e', borderRadius: 3 }} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}
