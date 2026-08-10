import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, Github, ArrowRight, CheckCircle2, Code2, BrainCircuit,
  BarChart3, Zap, Star, Users, Building2, Award, ChevronRight,
  GitBranch, FileCode, MessageSquareDot, Lock, TrendingUp, Globe
} from 'lucide-react'

const stats = [
  { value: '50K+', label: 'Students Verified' },
  { value: '2.4M+', label: 'Skills Analyzed' },
  { value: '1,200+', label: 'Companies Trust Us' },
  { value: '98%', label: 'Accuracy Rate' },
]

const features = [
  {
    icon: Github,
    title: 'GitHub Intelligence',
    description: 'Deep analysis of repositories, commit patterns, code quality, architecture, and contribution consistency.',
    color: 'from-slate-500 to-slate-700',
  },
  {
    icon: FileCode,
    title: 'Evidence Engine',
    description: 'Every skill score is backed by concrete evidence — not just an opaque AI score.',
    color: 'from-brand-500 to-violet-600',
  },
  {
    icon: Code2,
    title: 'Live Assessments',
    description: 'Adaptive 7-level coding assessments that dynamically adjust difficulty based on performance.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: BrainCircuit,
    title: 'AI Technical Interview',
    description: 'Conversational AI that evaluates technical depth, reasoning, and communication skills.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: BarChart3,
    title: 'Skill Graph',
    description: 'Map skill relationships and identify learning paths to reach your career goals.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Lock,
    title: 'Anti-Cheating System',
    description: 'Integrity signals for code similarity, unusual patterns, and suspicious submissions.',
    color: 'from-orange-500 to-red-600',
  },
]

const pipeline = [
  { step: 'Resume', icon: FileCode },
  { step: 'GitHub', icon: Github },
  { step: 'Projects', icon: GitBranch },
  { step: 'Assessment', icon: Code2 },
  { step: 'AI Interview', icon: MessageSquareDot },
]

const demoSkills = [
  { name: 'Java', score: 87, color: 'from-orange-500 to-red-500' },
  { name: 'React', score: 83, color: 'from-cyan-500 to-brand-500' },
  { name: 'SQL', score: 91, color: 'from-purple-500 to-violet-500' },
  { name: 'Python', score: 78, color: 'from-blue-500 to-cyan-500' },
  { name: 'Git/GitHub', score: 86, color: 'from-slate-500 to-slate-700' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center px-6 md:px-12 border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2.5 mr-10">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center shadow-brand-sm">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">SkillProof</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 flex-1">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#for-colleges" className="nav-link">Colleges</a>
          <a href="#for-companies" className="nav-link">Companies</a>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button onClick={() => navigate('/auth')} className="btn-ghost px-4 py-2 text-sm">Sign In</button>
          <button onClick={() => navigate('/auth')} className="btn-brand px-4 py-2 text-sm">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 bg-hero-gradient">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center max-w-4xl mx-auto"
        >
          <div className="badge-brand mb-6 inline-flex">
            <Zap className="w-3 h-3" />
            AI-Powered Skill Verification Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Don't just{' '}
            <span className="gradient-text">claim</span>{' '}
            your skills.{' '}
            <span className="gradient-text">Prove</span>{' '}
            them.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            SkillProof converts a traditional resume into an evidence-backed skill profile.
            GitHub analysis, live assessments, AI interviews — every skill score backed by real proof.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => navigate('/auth')} className="btn-brand text-base px-8 py-4">
              Verify Your Skills Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/profile/vijaymahes')} className="btn-ghost text-base px-8 py-4">
              See Example Profile
            </button>
          </div>
        </motion.div>

        {/* Demo Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mt-20 w-full max-w-md mx-auto"
        >
          <div className="glass p-6 animate-float">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-500 mb-0.5">SkillProof Score</p>
                <p className="text-xs text-slate-600">Vijay Mahes · MCA Student</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black gradient-text">84</div>
                <div className="text-xs text-slate-500">/100</div>
              </div>
            </div>
            <div className="space-y-3">
              {demoSkills.map((skill, i) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">{skill.name}</span>
                    <span className="text-white font-semibold">{skill.score}%</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ delay: 0.8 + i * 0.15, duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-4 gap-2 text-center text-xs">
              <div><div className="text-white font-bold">7</div><div className="text-slate-500">Projects</div></div>
              <div><div className="text-white font-bold">14</div><div className="text-slate-500">Skills</div></div>
              <div><div className="text-white font-bold">9</div><div className="text-slate-500">Tests</div></div>
              <div><div className="text-white font-bold">1.2K</div><div className="text-slate-500">Evidence</div></div>
            </div>
          </div>
          {/* Glow */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-brand-gradient opacity-20 blur-2xl" />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} custom={i} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }} className="text-center">
              <div className="text-4xl font-black gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="show" variants={fadeUp} custom={0} viewport={{ once: true }} className="text-center mb-16">
          <div className="badge-brand mb-4 inline-flex">Pipeline</div>
          <h2 className="text-4xl font-bold mb-4">How SkillProof Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Five evidence sources combined into one verified skill profile</p>
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {pipeline.map((p, i) => {
            const Icon = p.icon
            return (
              <div key={p.step} className="flex items-center gap-4">
                <motion.div custom={i} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}
                  className="glass p-5 text-center min-w-[100px] hover:border-brand-500/40 transition-colors group">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-brand-gradient flex items-center justify-center group-hover:shadow-brand transition-shadow">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">{p.step}</p>
                </motion.div>
                {i < pipeline.length - 1 && <ChevronRight className="w-5 h-5 text-slate-600 shrink-0 hidden md:block" />}
              </div>
            )
          })}
        </div>
        <div className="mt-12 text-center">
          <div className="inline-block glass p-6 text-left max-w-sm">
            <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold">Evidence Engine Output</p>
            <div className="space-y-2">
              {[
                ['Java', '87%', 'text-orange-400'],
                ['Python', '78%', 'text-blue-400'],
                ['SQL', '91%', 'text-purple-400'],
              ].map(([skill, score, color]) => (
                <div key={skill} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-verified shrink-0" />
                  <span className="text-sm text-slate-300 flex-1">{skill}</span>
                  <span className={`text-sm font-bold ${color}`}>{score}</span>
                  <span className="badge-verified text-xs">VERIFIED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-dark-800/40">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="show" variants={fadeUp} custom={0} viewport={{ once: true }} className="text-center mb-16">
            <div className="badge-brand mb-4 inline-flex">Features</div>
            <h2 className="text-4xl font-bold mb-4">Everything you need to prove your skills</h2>
            <p className="text-slate-400 max-w-xl mx-auto">A complete verification ecosystem — not just another resume parser</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div key={f.title} custom={i} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}
                  className="glass p-6 hover:border-brand-500/30 transition-all duration-300 group hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Evidence Feature */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="show" variants={fadeUp} custom={0} viewport={{ once: true }}>
            <div className="badge-brand mb-4 inline-flex">Killer Feature</div>
            <h2 className="text-4xl font-bold mb-6">"Show me the evidence."</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Every skill score is clickable. Recruiters don't just see a number — they see exactly
              <em> why</em> you scored that number. GitHub repos, lines of code, test coverage, REST APIs,
              design patterns — all shown transparently.
            </p>
            <button onClick={() => navigate('/dashboard/skills/java')} className="btn-brand">
              See Evidence Demo <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white">Java</h4>
                  <span className="badge-verified">VERIFIED</span>
                </div>
                <div className="text-4xl font-black gradient-text">87<span className="text-xl text-slate-500">/100</span></div>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ['GitHub Repositories', '8'],
                  ['Java Lines of Code', '18,420'],
                  ['Recent Activity', '7 months'],
                  ['Projects using Java', '5'],
                  ['Tests Detected', '142'],
                  ['REST APIs', '34'],
                  ['Design Patterns', '6'],
                  ['Assessment Score', '91%'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-400">{k}</span>
                    <span className="text-white font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="badge-verified">Evidence: HIGH</div>
                <div className="badge-brand ml-auto">Confidence: 87%</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* For Colleges */}
      <section id="for-colleges" className="py-24 px-6 bg-dark-800/40">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="show" variants={fadeUp} custom={0} viewport={{ once: true }}>
            <div className="badge-brand mb-4 inline-flex"><Building2 className="w-3 h-3" /> Colleges</div>
            <h2 className="text-4xl font-bold mb-4">Student Employability Intelligence</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-12">Give colleges something much more useful than a basic placement portal</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Batch Analytics', desc: 'Track skill levels across entire departments and batches in real time' },
              { icon: TrendingUp, title: 'Skill Gap Analysis', desc: 'Identify what skills your students are missing for industry readiness' },
              { icon: Award, title: 'Placement Readiness', desc: 'Company-specific preparation reports and placement filtering' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div key={item.title} custom={i + 1} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }} className="glass p-6">
                  <Icon className="w-8 h-8 text-brand-400 mb-4" />
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* For Companies */}
      <section id="for-companies" className="py-24 px-6 max-w-5xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="show" variants={fadeUp} custom={0} viewport={{ once: true }}>
          <div className="badge-brand mb-4 inline-flex"><Globe className="w-3 h-3" /> Companies</div>
          <h2 className="text-4xl font-bold mb-4">Hire by Evidence, Not Assumptions</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-12">Stop guessing from resumes. See verified skill scores with the evidence behind them.</p>
        </motion.div>
        <div className="glass p-6 max-w-2xl mx-auto text-left">
          <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider font-semibold">Junior Backend Developer · Skill Match</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-500 font-medium py-2 pr-4">Candidate</th>
                  <th className="text-center text-slate-500 font-medium py-2 px-2">Java</th>
                  <th className="text-center text-slate-500 font-medium py-2 px-2">Spring</th>
                  <th className="text-center text-slate-500 font-medium py-2 px-2">SQL</th>
                  <th className="text-center text-slate-500 font-medium py-2 px-2">Overall</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Candidate A', 91, 87, 94, 92],
                  ['Candidate B', 88, 72, 91, 85],
                  ['Candidate C', 76, 93, 87, 86],
                ].map(([name, java, spring, sql, overall], i) => (
                  <tr key={String(name)} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-slate-300 font-medium">{name}</td>
                    <td className="py-3 px-2 text-center text-white">{java}</td>
                    <td className="py-3 px-2 text-center text-white">{spring}</td>
                    <td className="py-3 px-2 text-center text-white">{sql}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`font-bold ${i === 0 ? 'gradient-text text-lg' : 'text-white'}`}>{overall}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-600 mt-3">All scores backed by evidence — click any number to see proof</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center relative">
        <div className="absolute inset-0 bg-hero-gradient opacity-50" />
        <motion.div initial="hidden" whileInView="show" variants={fadeUp} custom={0} viewport={{ once: true }} className="relative max-w-2xl mx-auto">
          <h2 className="text-5xl font-black mb-6">
            Ready to prove your<br /><span className="gradient-text">skills?</span>
          </h2>
          <p className="text-slate-400 mb-10 text-lg">Join 50,000+ students who've replaced resume claims with verified evidence</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/auth')} className="btn-brand text-base px-10 py-4">
              <Shield className="w-5 h-5" />
              Start Verifying Free
            </button>
            <button onClick={() => navigate('/profile/vijaymahes')} className="btn-ghost text-base px-8 py-4">
              <Star className="w-5 h-5" />
              View Example Profile
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">SkillProof</span>
          </div>
          <p className="text-xs text-slate-600">© 2026 SkillProof · Built by Vijay Mahes · MCA Final Year Project</p>
          <div className="flex gap-5 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
