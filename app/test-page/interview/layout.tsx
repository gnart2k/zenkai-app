import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interview Practice',
  description: 'Practice your interview skills with AI-powered feedback',
}

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}