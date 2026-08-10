import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, Play, Clock, Award, ChevronRight, Code2,
  ArrowRight, X, AlertTriangle, BarChart3, Zap, Trophy
} from 'lucide-react'
import { mockAssessments } from '@/data/mockData'

const javaQuestions = [
  {
    level: 1, question: 'What is the output of System.out.println(10 / 3) in Java?',
    options: ['3', '3.33', '3.0', 'Error'], correct: 0,
  },
  {
    level: 2, question: 'Which of these is NOT a feature of OOP in Java?',
    options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'], correct: 2,
  },
  {
    level: 3, question: 'Which collection allows null keys in Java?',
    options: ['TreeMap', 'Hashtable', 'HashMap', 'LinkedHashMap with constraints'], correct: 2,
  },
]

export default function AssessmentsPage() {
  const [view, setView] = useState<'catalog' | 'assessment' | 'result'>('catalog')
  const [activeAssessment, setActiveAssessment] = useState(mockAssessments[0])
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(45 * 60)

  const startAssessment = (a: typeof mockAssessments[0]) => {
    setActiveAssessment(a)
    setCurrentQ(0)
    setAnswers([])
    setSelected(null)
    setView('assessment')
  }

  const handleAnswer = () => {
    if (selected === null) return
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    if (currentQ < javaQuestions.length - 1) {
      setCurrentQ(currentQ + 1)
      setSelected(null)
    } else {
      setView('result')
    }
  }

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')

  const correctCount = answers.filter((ans, i) => ans === javaQuestions[i]?.correct).length

  if (view === 'assessment') {
    const q = javaQuestions[currentQ]
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="badge-brand">{activeAssessment.skill}</div>
            <span className="text-sm text-slate-400">Level {q.level}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-warning" />
              <span className={`font-mono font-semibold ${timeLeft < 300 ? 'text-danger' : 'text-white'}`}>{mins}:{secs}</span>
            </div>
            <button onClick={() => setView('catalog')} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          {javaQuestions.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < currentQ ? 'bg-verified' : i === currentQ ? 'bg-brand-500' : 'bg-white/10'}`} />
          ))}
        </div>

        {/* Question */}
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-8">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Question {currentQ + 1} of {javaQuestions.length}</p>
          <h2 className="text-xl font-semibold text-white mb-6 leading-relaxed">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all ${
                  selected === i ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                }`}>
                <span className="mr-3 opacity-60">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            ))}
          </div>
        </motion.div>

        <button onClick={handleAnswer} disabled={selected === null}
          className="btn-brand w-full justify-center py-4 disabled:opacity-40 disabled:cursor-not-allowed">
          {currentQ < javaQuestions.length - 1 ? 'Next Question' : 'Submit Assessment'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  if (view === 'result') {
    const pct = Math.round((correctCount / javaQuestions.length) * 100)
    return (
      <div className="max-w-xl mx-auto text-center space-y-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass p-10">
          <Trophy className="w-14 h-14 text-warning mx-auto mb-4" />
          <h1 className="text-3xl font-black text-white mb-2">Assessment Complete!</h1>
          <p className="text-slate-400 mb-6">{activeAssessment.skill} · Levels 1–3 Sample</p>
          <div className="text-6xl font-black gradient-text mb-2">{pct}%</div>
          <p className="text-slate-400 text-sm mb-6">{correctCount} of {javaQuestions.length} correct</p>
          <div className={`badge-${pct >= 80 ? 'verified' : pct >= 60 ? 'warning' : 'danger'} mx-auto w-fit mb-6`}>
            {pct >= 80 ? '✓ Evidence Added to Profile' : 'Retake to improve evidence'}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              ['Accuracy', `${pct}%`],
              ['Level Reached', '3'],
              ['Time Taken', '4m 23s'],
              ['Evidence Impact', '+12 pts'],
            ].map(([k, v]) => (
              <div key={k} className="bg-dark-700/50 rounded-xl p-3">
                <p className="text-xs text-slate-500">{k}</p>
                <p className="text-white font-bold">{v}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setView('catalog')} className="btn-brand mx-auto">Back to Assessments</button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Assessments</h1>
        <p className="text-slate-500 text-sm">Adaptive 7-level assessments that dynamically adjust to your performance</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Completed', value: mockAssessments.filter(a => a.completed).length, icon: CheckCircle2, color: 'text-verified' },
          { label: 'Avg Score', value: '88%', icon: BarChart3, color: 'text-brand-400' },
          { label: 'Available', value: mockAssessments.filter(a => !a.completed).length, icon: Zap, color: 'text-warning' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="glass p-4 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Assessment catalog */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Available Assessments</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {mockAssessments.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              className={`glass p-5 flex items-center gap-4 transition-all hover:border-brand-500/30 ${a.completed ? 'opacity-90' : ''}`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-xl shrink-0`}>
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-white">{a.skill}</span>
                  {a.completed && <CheckCircle2 className="w-4 h-4 text-verified shrink-0" />}
                </div>
                <p className="text-xs text-slate-500">{a.difficulty} · {a.questions} questions · {a.duration}</p>
                {a.completed && a.score && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="skill-bar flex-1">
                      <div className="skill-bar-fill" style={{ width: `${a.score}%` }} />
                    </div>
                    <span className="text-xs font-bold text-white">{a.score}%</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => !a.completed && startAssessment(a)}
                className={a.completed ? 'btn-ghost text-xs px-3 py-2' : 'btn-brand text-xs px-4 py-2'}>
                {a.completed ? (
                  <><Award className="w-3.5 h-3.5" /> Retake</>
                ) : (
                  <><Play className="w-3.5 h-3.5" /> Start</>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Levels explanation */}
      <div className="glass p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-brand-400" /> Assessment Level System
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {['Syntax', 'OOP', 'Collections', 'Exceptions', 'Concurrency', 'Problem Solving', 'System Design'].map((l, i) => (
            <div key={l} className={`text-center p-3 rounded-xl text-xs ${i < 4 ? 'bg-brand-500/10 border border-brand-500/20 text-brand-300' : 'bg-white/5 text-slate-500'}`}>
              <div className="font-bold mb-0.5">L{i + 1}</div>
              <div className="leading-tight">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
