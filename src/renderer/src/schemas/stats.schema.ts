export interface Stats {
  today: { sessions: number; minutes: number }
  week: { sessions: number; minutes: number }
  total: { sessions: number; minutes: number }
  streak: number
  avgPerDay: number
  longestSession: number
}
