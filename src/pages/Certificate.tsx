import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, CheckCircle2, Download, Share2, QrCode, Copy, ExternalLink } from 'lucide-react'
import { mockStudent, mockSkills } from '@/data/mockData'
import { useState } from 'react'

export default function Certificate() {
  const [copied, setCopied] = useState(false)

  const copyId = () => {
    navigator.clipboard.writeText(mockStudent.verificationId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const verifiedSkills = mockSkills.filter(s => s.verified)
  const issuedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-start py-12 px-4">
      {/* Nav */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div>
          <span className="font-bold gradient-text text-sm">SkillProof</span>
        </Link>
        <div className="flex gap-2">
          <button onClick={copyId} className="btn-ghost text-sm px-4 py-2">
            <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy ID'}
          </button>
          <button className="btn-brand text-sm px-4 py-2">
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>
      </div>

      {/* Certificate */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <div className="relative overflow-hidden rounded-3xl border-2 border-brand-500/40 bg-dark-800 shadow-[0_0_80px_rgba(99,102,241,0.3)]">
          {/* Top gradient bar */}
          <div className="h-2 bg-brand-gradient w-full" />

          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
            {/* Watermark grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
          </div>

          <div className="relative p-10 md:p-14">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-brand">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black gradient-text tracking-wider">SKILLPROOF</span>
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-[0.3em] font-semibold mb-6">
                Certificate of Skill Verification
              </div>
              <div className="w-16 h-px bg-brand-gradient mx-auto opacity-60" />
            </div>

            {/* Student info */}
            <div className="text-center mb-10">
              <p className="text-sm text-slate-500 mb-2">This certifies that</p>
              <h1 className="text-4xl font-black text-white mb-2">{mockStudent.name}</h1>
              <p className="text-slate-400">{mockStudent.title} · {mockStudent.college}</p>
              <p className="text-sm text-slate-500 mt-2">has successfully verified the following technical skills</p>
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
              {verifiedSkills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 bg-verified/5 border border-verified/20 rounded-xl px-4 py-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-verified shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">{skill.name}</p>
                    <p className="text-xs text-slate-500">{skill.confidenceScore}% Confidence</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Score */}
            <div className="text-center mb-10">
              <div className="inline-block glass px-8 py-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Overall SkillProof Score</p>
                <div className="text-5xl font-black gradient-text">{mockStudent.skillProofScore}<span className="text-2xl text-slate-500">/100</span></div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/5 mb-8" />

            {/* Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Verification ID</p>
                <div className="flex items-center gap-2">
                  <code className="text-brand-400 font-mono font-semibold text-sm">{mockStudent.verificationId}</code>
                  <button onClick={copyId} className="text-slate-600 hover:text-white transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-1">Issued: {issuedDate}</p>
              </div>

              {/* QR */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
                  <div className="w-16 h-16 grid grid-cols-4 gap-0.5">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${[0,1,4,5,2,7,8,11,12,13,14,15,3,6,9,10][i] % 3 !== 0 ? 'bg-dark-900' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600">Scan to verify</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">Verify online</p>
                <a href={`/certificate/${mockStudent.verificationId}`} className="text-brand-400 text-xs hover:underline flex items-center gap-1">
                  skillproof.dev/verify <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-xs text-slate-600 mt-1">Expires: Never</p>
              </div>
            </div>
          </div>

          {/* Bottom gradient bar */}
          <div className="h-1 bg-brand-gradient w-full opacity-50" />
        </div>
      </motion.div>

      <p className="mt-8 text-xs text-slate-600">This certificate is cryptographically signed and verifiable at skillproof.dev</p>
    </div>
  )
}
