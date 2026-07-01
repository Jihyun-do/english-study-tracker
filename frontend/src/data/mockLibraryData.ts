export interface MaterialFile {
  name: string
  size: string
}

export interface AudioFile extends MaterialFile {
  id: string
  duration: string
}

export interface LibraryMaterial {
  id: string
  date: string
  dateLabel: string
  title: string
  description: string
  pdf: MaterialFile
  audioFiles: AudioFile[]
  isSubmitted: boolean
}

function createAudioFiles(
  datePrefix: string,
  files: { name: string; size: string; duration: string }[],
): AudioFile[] {
  return files.map(({ name, size, duration }, index) => ({
    id: `${datePrefix}-audio-${index + 1}`,
    name,
    size,
    duration,
  }))
}

export const mockLibraryMaterials: LibraryMaterial[] = [
  {
    id: 'material-1',
    date: '2025-06-16',
    dateLabel: '6/16 과제',
    title: '영화 소개 영어 표현 익히기',
    description:
      '좋아하는 영화를 영어로 소개하는 표현을 익히고, plot summary와 review 표현을 연습합니다.',
    pdf: { name: '6/16 과제 자료.pdf', size: '1.2MB' },
    audioFiles: createAudioFiles('6/16', [
      { name: 'Conversation Practice.mp3', size: '3.1MB', duration: '2:10' },
      { name: 'Shadowing Practice.mp3', size: '2.2MB', duration: '1:14' },
    ]),
    isSubmitted: false,
  },
  {
    id: 'material-2',
    date: '2025-06-15',
    dateLabel: '6/15 과제',
    title: 'Travel Expressions',
    description:
      '공항, 호텔, 식당에서 자주 쓰는 여행 영어 표현을 정리했습니다. 실전 회화 위주로 학습해주세요.',
    pdf: { name: '6/15 과제 자료.pdf', size: '980KB' },
    audioFiles: createAudioFiles('6/15', [
      { name: 'Conversation Practice.mp3', size: '2.8MB', duration: '1:52' },
      { name: 'Shadowing Practice.mp3', size: '2.0MB', duration: '1:04' },
    ]),
    isSubmitted: true,
  },
  {
    id: 'material-3',
    date: '2025-06-14',
    dateLabel: '6/14 과제',
    title: 'Business Email Writing',
    description:
      '업무 이메일 작성 시 자주 쓰는 formal expression과 closing phrase를 학습합니다.',
    pdf: { name: '6/14 과제 자료.pdf', size: '1.5MB' },
    audioFiles: createAudioFiles('6/14', [
      { name: 'Conversation Practice.mp3', size: '3.5MB', duration: '2:28' },
      { name: 'Shadowing Practice.mp3', size: '2.6MB', duration: '1:44' },
    ]),
    isSubmitted: true,
  },
  {
    id: 'material-4',
    date: '2025-06-13',
    dateLabel: '6/13 과제',
    title: 'Daily Small Talk',
    description:
      '날씨, 취미, 주말 계획 등 일상 대화에서 사용하는 표현을 shadowing으로 연습합니다.',
    pdf: { name: '6/13 과제 자료.pdf', size: '890KB' },
    audioFiles: createAudioFiles('6/13', [
      { name: 'Conversation Practice.mp3', size: '2.4MB', duration: '1:38' },
      { name: 'Shadowing Practice.mp3', size: '1.8MB', duration: '1:27' },
    ]),
    isSubmitted: true,
  },
  {
    id: 'material-5',
    date: '2025-06-12',
    dateLabel: '6/12 과제',
    title: 'TOEIC Listening Part 2',
    description:
      'TOEIC Part 2 유형별 핵심 표현과 함정 패턴을 정리한 자료입니다.',
    pdf: { name: '6/12 과제 자료.pdf', size: '1.1MB' },
    audioFiles: createAudioFiles('6/12', [
      { name: 'Conversation Practice.mp3', size: '2.9MB', duration: '2:05' },
      { name: 'Shadowing Practice.mp3', size: '2.1MB', duration: '1:43' },
    ]),
    isSubmitted: false,
  },
]

export function sortMaterialsByLatest(
  materials: LibraryMaterial[],
): LibraryMaterial[] {
  return [...materials].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function getMaterialById(id: string): LibraryMaterial | undefined {
  return mockLibraryMaterials.find((m) => m.id === id)
}
