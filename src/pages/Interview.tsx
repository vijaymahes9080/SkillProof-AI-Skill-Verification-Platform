import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrainCircuit, Send, Loader2, CheckCircle2, BarChart3, ArrowRight, Mic } from 'lucide-react'
import { mockInterviewQuestions } from '@/data/mockData'

type Message = { role: 'ai' | 'user'; content: string; scores?: typeof mockInterviewQuestions[0]['scores'] }

const skills = ['Java', 'Python', 'React', 'SQL', 'System Design', 'Spring Boot']
const difficulties = ['Junior', 'Mid-level', 'Senior']

const openingMessage = (skill: string) =>
  `Hello! I'm your SkillProof AI Interviewer. Today we'll have a technical interview focused on **${skill}**. I'll evaluate your technical correctness, conceptual depth, communication, and practical reasoning.\n\nLet's start with your first question:\n\n${mockInterviewQuestions[0].question}`

export default function InterviewPage() {
  const [phase, setPhase] = useState<'setup' | 'interview' | 'result'>('setup')
  const [skill, setSkill] = useState('Java')
  const [difficulty, setDifficulty] = useState('Mid-level')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [qIndex, setQIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [completedScores, setCompletedScores] = useState<typeof mockInterviewQuestions[0]['scores'][]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const startInterview = () => {
    setMessages([{ role: 'ai', content: openingMessage(skill) }])
    setQIndex(0)
    setCompletedScores([])
    setPhase('interview')
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    await new Promise(r => setTimeout(r, 2000))

    const scores = mockInterviewQuestions[qIndex]?.scores
    const newScores = [...completedScores, scores]
    setCompletedScores(newScores)

    const nextQ = qIndex + 1
    let aiReply = ''
    if (nextQ < mockInterviewQuestions.length) {
      aiReply = `Great answer! You showed strong understanding of the concept.\n\nNext question:\n\n${mockInterviewQuestions[nextQ].question}`
      setQIndex(nextQ)
    } else {
      aiReply = 'Excellent! That concludes the interview. Thank you for your thoughtful answers. Let me generate your performance report now...'
      setTimeout(() => setPhase('result'), 2000)
    }

    setMessages(prev => [...prev, { role: 'ai', content: aiReply, scores }])
    setLoading(false)
  }

  const avgScores = completedScores.length > 0 ? {
    technicalCorrectness: Math.round(completedScores.reduce((s, c) => s + c.technicalCorrectness, 0) / completedScores.length),
    conceptualUnderstanding: Math.round(completedScores.reduce((s, c) => s + c.conceptualUnderstanding, 0) / completedScores.length),
    communication: Math.round(completedScores.reduce((s, c) => s + c.communication, 0) / completedScores.length),
    depth: Math.round(completedScores.reduce((s, c) => s + c.depth, 0) / completedScores.length),
    practicalReasoning: Math.round(completedScores.reduce((s, c) => s + c.practicalReasoning, 0) / completedScores.length),
  } : mockInterviewQuestions[0].scores

  const overallAvg = Math.round(Object.values(avgScores).reduce((a, b) => a + b, 0) / 5)

  if (phase === 'result') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 text-center">
          <BrainCircuit className="w-14 h-14 text-purple-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-1">Interview Complete!</h1>
          <p className="text-slate-400 text-sm mb-6">{skill} · {difficulty} · {mockInterviewQuestions.length} Questions</p>
          <div className="text-6xl font-black gradient-text mb-1">{overallAvg}</div>
          <p className="text-slate-400 text-sm mb-8">Overall Interview Score</p>
          <div className="space-y-3 text-left mb-8">
            {Object.entries(avgScores).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-white font-semibold">{val}</span>
                </div>
                <div className="skill-bar"><div className="skill-bar-fill" style={{ width: `${val}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="badge-verified mx-auto w-fit mb-4">Evidence Added to Profile</div>
          <button onClick={() => setPhase('setup')} className="btn-brand mx-auto">Start New Interview</button>
        </motion.div>
      </div>
    )
  }

  if (phase === 'interview') {
    return (
      <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
        {/* Header */}
        <div className="glass p-4 flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">SkillProof AI Interviewer</p>
              <p className="text-xs text-slate-500">{skill} · {difficulty} · Q{qIndex + 1}/{mockInterviewQuestions.length}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {mockInterviewQuestions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < qIndex ? 'bg-verified' : i === qIndex ? 'bg-brand-500' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'ai' ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-brand-gradient'
                }`}>
                  {msg.role === 'ai' ? '🤖' : 'V'}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'ai' ? 'bg-dark-700 text-slate-200' : 'bg-brand-gradient text-white'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.scores && (
                    <div className="mt-2 flex flex-wrap gap-1.5 justify-start">
                      {Object.entries(msg.scores).map(([k, v]) => (
                        <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                          {k.replace(/([A-Z])/g, ' $1').trim()}: <span className="text-white font-medium">{v}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xs">🤖</div>
              <div className="bg-dark-700 rounded-2xl p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
                <span className="text-sm text-slate-400">Evaluating your answer...</span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="glass p-3 flex gap-2 shrink-0">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Type your answer... (Shift+Enter for new line)"
            rows={3}
            className="flex-1 bg-transparent resize-none text-sm text-white placeholder-slate-600 focus:outline-none leading-relaxed"
          />
          <button onClick={sendMessage} disabled={!input.trim() || loading}
            className="self-end p-3 rounded-xl bg-brand-gradient text-white disabled:opacity-40 hover:shadow-brand-sm transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">AI Technical Interview</h1>
        <p className="text-slate-500 text-sm">Get evaluated by AI on technical depth, reasoning, and communication</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Configure Your Interview</h2>
          <p className="text-sm text-slate-400">Select a skill area and difficulty level to begin</p>
        </div>

        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-3">Skill Focus</label>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <button key={s} onClick={() => setSkill(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${skill === s ? 'bg-brand-gradient text-white shadow-brand-sm' : 'glass-sm text-slate-400 hover:text-white'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-3">Difficulty</label>
          <div className="flex gap-2">
            {difficulties.map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${difficulty === d ? 'bg-brand-gradient text-white shadow-brand-sm' : 'glass-sm text-slate-400 hover:text-white'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-400">
          {[
            ['Technical Correctness', '30%'],
            ['Conceptual Depth', '25%'],
            ['Communication', '20%'],
          ].map(([k, v]) => (
            <div key={k} className="bg-dark-700/50 rounded-xl p-3">
              <p className="text-white font-semibold text-sm">{v}</p>
              <p className="mt-0.5">{k}</p>
            </div>
          ))}
        </div>

        <button onClick={startInterview} className="btn-brand w-full justify-center py-4">
          Start Interview · {skill}
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  )
}
