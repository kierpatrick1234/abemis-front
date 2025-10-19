'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface EvaluatedProject {
  id: string
  title: string
  type: string
  province: string
  region: string
  status: string
  description: string
  budget: number
  startDate: string
  endDate: string
  updatedAt: string
  evaluatedAt: string
  evaluatedBy: string
  evaluationStatus: 'Approved' | 'Rejected'
  evaluationComments: string
  documentsStatus: {
    letterOfIntent: boolean
    validationReport: boolean
    feasibilityStudy: boolean
    detailedDesign: boolean
    programOfWork: boolean
    rightOfWay: boolean
  }
}

interface EvaluationContextType {
  evaluatedProjects: EvaluatedProject[]
  addEvaluatedProject: (project: any, evaluator: string, status: 'Approved' | 'Rejected', comments: string) => void
  getEvaluatedProjectsByUser: (userId: string) => EvaluatedProject[]
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined)

export function EvaluationProvider({ children }: { children: ReactNode }) {
  const [evaluatedProjects, setEvaluatedProjects] = useState<EvaluatedProject[]>([])

  const addEvaluatedProject = useCallback((project: any, evaluator: string, status: 'Approved' | 'Rejected', comments: string) => {
    console.log('EvaluationContext - Adding project:', project.title, 'by:', evaluator)
    
    const evaluatedProject: EvaluatedProject = {
      id: project.id,
      title: project.title,
      type: project.type,
      province: project.province,
      region: project.region,
      status: 'Evaluated',
      description: project.description,
      budget: project.budget,
      startDate: project.startDate,
      endDate: project.endDate,
      updatedAt: project.updatedAt,
      evaluatedAt: new Date().toISOString(),
      evaluatedBy: evaluator,
      evaluationStatus: status,
      evaluationComments: comments,
      documentsStatus: {
        letterOfIntent: true,
        validationReport: true,
        feasibilityStudy: true,
        detailedDesign: true,
        programOfWork: true,
        rightOfWay: true
      }
    }

    setEvaluatedProjects(prev => {
      // Remove if already exists and add new one
      const filtered = prev.filter(p => p.id !== project.id)
      const newList = [...filtered, evaluatedProject]
      console.log('EvaluationContext - Updated projects list:', newList.length, 'projects')
      return newList
    })
  }, [])

  const getEvaluatedProjectsByUser = useCallback((userId: string) => {
    console.log('EvaluationContext - All projects:', evaluatedProjects)
    console.log('EvaluationContext - Looking for user:', userId)
    const userProjects = evaluatedProjects.filter(project => {
      console.log('EvaluationContext - Checking project:', project.title, 'evaluatedBy:', project.evaluatedBy, 'matches:', project.evaluatedBy === userId)
      return project.evaluatedBy === userId
    })
    console.log('EvaluationContext - Getting projects for user:', userId, 'found:', userProjects.length, 'projects')
    return userProjects
  }, [evaluatedProjects])

  return (
    <EvaluationContext.Provider value={{
      evaluatedProjects,
      addEvaluatedProject,
      getEvaluatedProjectsByUser
    }}>
      {children}
    </EvaluationContext.Provider>
  )
}

export function useEvaluation() {
  const context = useContext(EvaluationContext)
  if (context === undefined) {
    throw new Error('useEvaluation must be used within an EvaluationProvider')
  }
  return context
}
