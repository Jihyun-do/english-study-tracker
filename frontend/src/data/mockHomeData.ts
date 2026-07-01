export interface HomeData {
  userName: string
  streakDays: number
  monthlyParticipationRate: number
  assignment: {
    sectionTitle: string
    title: string
    materialId: string
  }
}

export const mockHomeData: HomeData = {
  userName: '명수',
  streakDays: 12,
  monthlyParticipationRate: 92,
  assignment: {
    sectionTitle: '오늘의 과제',
    title: '영화 소개 영어 표현 익히기',
    materialId: 'material-1',
  },
}
