import { motion } from 'framer-motion'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  CheckCircle2, AlertTriangle, XCircle, ArrowRight, Github,
  Code2, TestTube2, GitBranch, MessageSquare, Clock, Star,
  ChevronDown, ChevronUp, Info
} from 'lucide-react'
import { mockSkills } from '@/data/mockData'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

const evidenceWeights = [
  { label: 'Practical Assessment', weight: 30, key: 'assessment' as const },
  { label: 'Project Evidence', weight: 25, key: 'projects' as const },
  { label: 'GitHub / Code Evidence', weight: 20, key: 'github' as const },
  { label: 'Technical Interview', weight: 15, key: 'interview' as const },
  { label: 'Recency / Activity', weight: 10, key: 'recency' as const },
]

export default function SkillsPage() {
  const { skillId } = useParams()
  const [selectedSkill, setSelectedSkill] = useState(skillId || mockSkills[0].id)
  const [evidenceExpanded, setEvidenceExpanded] = useState(true)
  const skill = mockSkills.find(s => s.id === selectedSkill) || mockSkills[0]

  const radarData = [
    { subject: 'Assessment', A: skill.breakdown.assessment },
    { subject: 'Projects', A: skill.breakdown.projects },
    { subject: 'GitHub', A: skill.breakdown.github },
    { subject: 'Interview', A: skill.breakdown.interview },
    { subject: 'Recency', A: skill.breakdown.recency },
  ]

  const strengthIcon = {
    HIGH: <CheckCircle2 className="w-4 h-4 text-verified" />,
    MEDIUM: <AlertTriangle className="w-4 h-4 text-warning" />,
    LOW: <XCircle className="w-4 h-4 text-danger" />,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Skill Evidence</h1>
        <p className="text-slate-500 text-sm">Deep dive into every skill — see exactly why you scored what you scored</p>
      </div>

      {/* Skill selector */}
      <div className="flex flex-wrap gap-2">
        {mockSkills.map(s => (
          <button key={s.id} onClick={() => setSelectedSkill(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              selectedSkill === s.id ? 'bg-brand-gradient text-white shadow-brand-sm' : 'glass-sm text-slate-400 hover:text-white'
            }`}>
            {s.verified && <CheckCircle2 className="w-3.5 h-3.5 text-verified" />}
            {s.name}
            <span className={selectedSkill === s.id ? 'text-white/70' : 'text-slate-600'}>{s.confidenceScore}%</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Score + breakdown */}
        <div className="md:col-span-1 space-y-4">
          {/* Score card */}
          <motion.div key={skill.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-1">{skill.name}</h2>
            <p className="text-xs text-slate-500 mb-4">Claimed: <span className="text-slate-300">{skill.claimed}</span></p>
            <div className="relative w-28 h-28 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="url(#sg)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - skill.confidenceScore / 100) }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
                <defs>
                  <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black gradient-text">{skill.confidenceScore}</span>
                <span className="text-xs text-slate-500">/100</span>
              </div>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
              skill.evidenceStrength === 'HIGH' ? 'bg-verified/10 text-verified border border-verified/30' :
              skill.evidenceStrength === 'MEDIUM' ? 'bg-warning/10 text-warning border border-warning/30' :
              'bg-danger/10 text-danger border border-danger/30'
            }`}>
              {strengthIcon[skill.evidenceStrength]}
              Evidence: {skill.evidenceStrength}
            </div>
            {skill.verified && (
              <div className="mt-3 badge-verified mx-auto w-fit">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </div>
            )}
            <p className="text-xs text-slate-600 mt-3 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" /> Last verified {skill.lastVerified}
            </p>
          </motion.div>

          {/* Radar */}
          <div className="glass p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Skill Breakdown</p>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Evidence + breakdown */}
        <div className="md:col-span-2 space-y-4">
          {/* Confidence breakdown */}
          <motion.div key={`bd-${skill.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-brand-400" /> Confidence Score Breakdown
            </h3>
            <div className="space-y-4">
              {evidenceWeights.map(ew => {
                const score = skill.breakdown[ew.key]
                return (
                  <div key={ew.key}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-400">{ew.label} <span className="text-slate-600">({ew.weight}%)</span></span>
                      <span className="text-white font-semibold">{score}</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div className="skill-bar-fill" initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Evidence panel */}
          <motion.div key={`ev-${skill.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="glass p-6">
            <button className="w-full flex items-center justify-between mb-4" onClick={() => setEvidenceExpanded(!evidenceExpanded)}>
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Github className="w-4 h-4 text-slate-400" /> Evidence Details — "Show me the evidence"
              </h3>
              {evidenceExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {evidenceExpanded && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['GitHub Repositories', skill.evidence.githubRepos, Code2],
                  ['Lines of Code', skill.evidence.linesOfCode.toLocaleString(), null],
                  ['Recent Activity', skill.evidence.recentActivity, Clock],
                  ['Projects Using', skill.evidence.projectsUsing, GitBranch],
                  ['Tests Detected', skill.evidence.testsDetected, TestTube2],
                  ['REST APIs', skill.evidence.restApis, null],
                  ['Design Patterns', skill.evidence.designPatterns, null],
                  ['Assessment Score', `${skill.evidence.assessmentScore}%`, null],
                  ['Interview Score', `${skill.evidence.interviewScore}%`, MessageSquare],
                ].map(([label, value, Icon]: any) => (
                  <div key={String(label)} className="bg-dark-700/50 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <p className="text-white font-semibold text-sm">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Claim vs Evidence */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }} className="glass p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-400" /> Claim vs Evidence
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-700/50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Claimed</p>
                <p className="text-xl font-bold text-white">{skill.claimed}</p>
                <p className="text-xs text-slate-600 mt-1">Self-reported on resume</p>
              </div>
              <div className={`rounded-xl p-4 ${skill.evidenceStrength === 'HIGH' ? 'bg-verified/10 border border-verified/20' : 'bg-warning/10 border border-warning/20'}`}>
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Evidence Says</p>
                <p className={`text-xl font-bold ${skill.evidenceStrength === 'HIGH' ? 'text-verified' : 'text-warning'}`}>
                  {skill.confidenceScore >= 85 ? 'Expert' : skill.confidenceScore >= 75 ? 'Advanced' : skill.confidenceScore >= 60 ? 'Intermediate' : 'Beginner'}
                </p>
                <p className="text-xs text-slate-600 mt-1">Based on {skill.evidenceStrength} evidence</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
