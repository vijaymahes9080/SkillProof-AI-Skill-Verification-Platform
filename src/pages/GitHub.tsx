import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Github, Star, GitFork, Code2, CheckCircle2, AlertTriangle, Clock,
  BarChart3, GitCommit, FileText, TestTube2, Rocket, GitBranch, ExternalLink
} from 'lucide-react'
import { mockStudent, mockRepos } from '@/data/mockData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const languageColors: Record<string, string> = {
  Java: '#f97316', Python: '#3b82f6', TypeScript: '#6366f1', JavaScript: '#eab308',
  SQL: '#8b5cf6', CSS: '#ec4899', HTML: '#ef4444', Go: '#06b6d4',
}

const langStats = [
  { lang: 'Java', percent: 58, loc: 18420 },
  { lang: 'Python', percent: 22, loc: 12840 },
  { lang: 'TypeScript', percent: 12, loc: 5800 },
  { lang: 'SQL', percent: 8, loc: 9300 },
]

const commitData = [
  { month: 'Mar', commits: 24 }, { month: 'Apr', commits: 38 }, { month: 'May', commits: 51 },
  { month: 'Jun', commits: 43 }, { month: 'Jul', commits: 67 }, { month: 'Aug', commits: 29 },
]

export default function GitHubPage() {
  const [connected] = useState(true)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">GitHub Intelligence</h1>
        <p className="text-slate-500 text-sm">Deep analysis of your repositories, code, and contribution patterns</p>
      </div>

      {/* GitHub Profile Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass p-6 flex flex-col md:flex-row items-center gap-6 border border-verified/20">
        <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-verified/30 flex items-center justify-center shrink-0">
          <Github className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
            <h2 className="text-lg font-bold text-white">@{mockStudent.github}</h2>
            <CheckCircle2 className="w-5 h-5 text-verified" />
            <span className="badge-verified">Connected</span>
          </div>
          <p className="text-sm text-slate-400">{mockStudent.githubEvidenceCount.toLocaleString()} evidence points · {mockRepos.length} repositories analyzed · Last synced 2 hours ago</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black gradient-text mb-0.5">88%</div>
          <div className="text-xs text-slate-500">Evidence Quality</div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Repositories', value: '21', icon: GitBranch },
          { label: 'Total Commits', value: '616', icon: GitCommit },
          { label: 'Lines of Code', value: '46.3K', icon: Code2 },
          { label: 'Languages', value: '6', icon: FileText },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="glass p-4 text-center">
              <Icon className="w-5 h-5 text-brand-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Language distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6">
          <h2 className="text-lg font-bold text-white mb-5">Language Distribution</h2>
          <div className="space-y-4">
            {langStats.map(l => (
              <div key={l.lang}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-300 font-medium flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: languageColors[l.lang] || '#6366f1' }} />
                    {l.lang}
                  </span>
                  <span className="text-slate-400">{l.loc.toLocaleString()} LOC · <span className="text-white font-semibold">{l.percent}%</span></span>
                </div>
                <div className="skill-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${l.percent}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: languageColors[l.lang] || '#6366f1' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Commit frequency */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass p-6">
          <h2 className="text-lg font-bold text-white mb-5">Commit Frequency</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={commitData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
              <Bar dataKey="commits" radius={[4, 4, 0, 0]}>
                {commitData.map((_, i) => (
                  <Cell key={i} fill={i === commitData.length - 1 ? '#6366f1' : 'rgba(99,102,241,0.4)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Repository list */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Analyzed Repositories</h2>
        <div className="space-y-3">
          {mockRepos.map((repo, i) => (
            <motion.div key={repo.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
              className="glass p-5 hover:border-brand-500/30 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <a href={`https://github.com/${mockStudent.github}/${repo.name}`} target="_blank" rel="noopener noreferrer"
                      className="text-white font-semibold hover:text-brand-400 transition-colors flex items-center gap-1.5">
                      {repo.name}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <span className="badge-brand text-xs">{repo.language}</span>
                  </div>
                  <p className="text-sm text-slate-400 truncate">{repo.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" />{repo.stars}</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{repo.forks}</span>
                    <span className="flex items-center gap-1"><GitCommit className="w-3 h-3" />{repo.commits} commits</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{repo.lastCommit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex gap-1.5">
                    {repo.hasTests && <span title="Tests detected"><TestTube2 className="w-4 h-4 text-verified" /></span>}
                    {repo.hasDocumentation && <span title="Documentation"><FileText className="w-4 h-4 text-blue-400" /></span>}
                    {repo.hasCiCd && <span title="CI/CD"><Rocket className="w-4 h-4 text-orange-400" /></span>}
                  </div>
                  <div className="text-center min-w-[60px]">
                    <div className={`text-lg font-black ${repo.analysisScore >= 80 ? 'text-verified' : repo.analysisScore >= 70 ? 'text-warning' : 'text-danger'}`}>
                      {repo.analysisScore}
                    </div>
                    <div className="text-xs text-slate-500">Score</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
