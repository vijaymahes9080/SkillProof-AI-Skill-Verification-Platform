import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Shield, CheckCircle2, Github, Share2, QrCode, Download,
  Award, Code2, GitBranch, Clock, ExternalLink, Star, Copy
} from 'lucide-react'
import { mockStudent, mockSkills, mockProjects } from '@/data/mockData'
import { useState } from 'react'

export default function PublicProfile() {
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(`https://skillproof.dev/profile/${mockStudent.username}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center px-6 border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2.5 mr-auto">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center shadow-brand-sm">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">SkillProof</span>
        </Link>
        <button onClick={copyLink} className="btn-ghost text-sm px-4 py-2 mr-2">
          {copied ? <><CheckCircle2 className="w-4 h-4 text-verified" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
        </button>
        <Link to="/auth" className="btn-brand text-sm px-4 py-2">Get Verified</Link>
      </nav>

      <div className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-black text-2xl shrink-0">
              {mockStudent.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-black text-white">{mockStudent.name}</h1>
                <span className="badge-verified"><CheckCircle2 className="w-3 h-3" /> Verified Profile</span>
              </div>
              <p className="text-slate-400 mb-1">{mockStudent.title} · {mockStudent.college}</p>
              <p className="text-sm text-slate-400 mb-3">{mockStudent.bio}</p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Github className="w-3 h-3" />@{mockStudent.github}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Joined {mockStudent.joinedDate}</span>
              </div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-4xl font-black gradient-text">{mockStudent.skillProofScore}</div>
              <div className="text-xs text-slate-500 mt-0.5">SkillProof Score</div>
              <div className="text-xs text-brand-400 mt-1">Top 12%</div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/5">
            {[
              { label: 'Verified Skills', value: mockStudent.verifiedSkills },
              { label: 'Projects', value: mockStudent.verifiedProjects },
              { label: 'Assessments', value: mockStudent.assessmentsCompleted },
              { label: 'GitHub Evidence', value: mockStudent.githubEvidenceCount.toLocaleString() },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Verified Skills */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6">
              <h2 className="text-lg font-bold text-white mb-5">Verified Skills</h2>
              <div className="space-y-4">
                {mockSkills.filter(s => s.verified).map((skill, i) => (
                  <div key={skill.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-verified" />
                        <span className="font-medium text-slate-200">{skill.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          skill.evidenceStrength === 'HIGH' ? 'bg-verified/10 text-verified' : 'bg-warning/10 text-warning'
                        }`}>{skill.evidenceStrength} evidence</span>
                      </div>
                      <span className="font-bold text-white">{skill.confidenceScore}%</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div className="skill-bar-fill" initial={{ width: 0 }} animate={{ width: `${skill.confidenceScore}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6">
              <h2 className="text-lg font-bold text-white mb-5">Verified Projects</h2>
              <div className="space-y-3">
                {mockProjects.map(p => (
                  <div key={p.id} className="flex items-center gap-4 p-3 bg-dark-700/50 rounded-xl">
                    <div className="w-9 h-9 rounded-lg bg-brand-gradient flex items-center justify-center shrink-0">
                      <GitBranch className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {p.technologies.slice(0, 3).map(t => (
                          <span key={t} className="text-xs text-slate-500">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-sm font-black ${p.overallScore >= 80 ? 'text-verified' : 'text-warning'}`}>{p.overallScore}/100</div>
                    </div>
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Certificate preview */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="glass p-5 border border-brand-500/20 text-center">
              <Award className="w-10 h-10 text-brand-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Verification Certificate</h3>
              <p className="text-xs text-slate-400 mb-3">ID: {mockStudent.verificationId}</p>
              <Link to={`/certificate/${mockStudent.verificationId}`} className="btn-brand text-xs px-4 py-2.5 w-full justify-center">
                View Certificate
              </Link>
            </motion.div>

            {/* QR */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass p-5 text-center">
              <QrCode className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1 text-sm">QR Verification</h3>
              <p className="text-xs text-slate-500 mb-3">Scan to verify this profile</p>
              <div className="w-24 h-24 mx-auto bg-white rounded-xl flex items-center justify-center mb-3">
                <div className="w-20 h-20 grid grid-cols-5 gap-0.5 opacity-80">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`${Math.random() > 0.5 ? 'bg-dark-900' : 'bg-transparent'} rounded-sm`} />
                  ))}
                </div>
              </div>
              <button onClick={copyLink} className="text-xs text-brand-400 hover:underline">Copy Profile Link</button>
            </motion.div>

            {/* Share */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="glass p-5">
              <h3 className="font-semibold text-white mb-3 text-sm flex items-center gap-2">
                <Share2 className="w-4 h-4 text-brand-400" /> Share Profile
              </h3>
              <div className="space-y-2">
                <button onClick={copyLink} className="w-full btn-ghost text-xs py-2.5 justify-center">
                  {copied ? '✓ Copied!' : 'Copy Profile Link'}
                </button>
                <a href={`https://linkedin.com/share?url=https://skillproof.dev/profile/${mockStudent.username}`} target="_blank" rel="noopener noreferrer"
                  className="w-full btn-ghost text-xs py-2.5 flex items-center justify-center gap-2">
                  Share on LinkedIn
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
