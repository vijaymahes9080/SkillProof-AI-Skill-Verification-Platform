import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'
import GitHubPage from '@/pages/GitHub'
import SkillsPage from '@/pages/Skills'
import AssessmentsPage from '@/pages/Assessments'
import InterviewPage from '@/pages/Interview'
import ProjectsPage from '@/pages/Projects'
import PublicProfile from '@/pages/PublicProfile'
import Certificate from '@/pages/Certificate'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* Dashboard - protected routes (mock auth) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="github" element={<GitHubPage />} />
          <Route path="skills/:skillId" element={<SkillsPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="assessments" element={<AssessmentsPage />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Route>

        {/* Public pages */}
        <Route path="/profile/:username" element={<PublicProfile />} />
        <Route path="/certificate/:verificationId" element={<Certificate />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
