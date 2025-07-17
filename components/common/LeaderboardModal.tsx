"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Medal, Award, Star, TrendingUp, Crown, Zap, Target } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  username: string
  score: number
  accuracy: number
  streak: number
  gamesPlayed: number
  avatar?: string
  country: string
  rank: number
  isCurrentUser?: boolean
}

interface UserStats {
  username: string
  score: number
  accuracy: number
  streak: number
  gamesPlayed: number
  lastUpdated: string
}

interface LeaderboardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Famous usernames for more engaging leaderboard
const FAMOUS_USERNAMES = [
  'MusicMaestro', 'SongGuru', 'BeatDetective', 'MelodyHunter', 'RhythmKing',
  'AudioAce', 'TuneMaster', 'SoundSage', 'HarmonyHero', 'VibeMachine',
  'BassLegend', 'TrebleChamp', 'TempoTitan', 'ChordChaser', 'LyricLord',
  'DrumDynamo', 'PianoProdigy', 'VocalVirtuoso', 'InstrumentIq', 'ComposerCrush',
  'BeatBoxBoss', 'SynthSorcerer', 'GuitarGenius', 'MixMaster', 'SampleSensei'
]

const COUNTRIES = ['🇺🇸', '🇬🇧', '🇯🇵', '🇰🇷', '🇩🇪', '🇫🇷', '🇧🇷', '🇨🇦', '🇦🇺', '🇪🇸', '🇮🇹', '🇳🇱', '🇸🇪', '🇳🇴']

// Generate deterministic daily seed
function getDailySeed(): number {
  const today = new Date()
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// Seeded random number generator
function seededRandom(seed: number): () => number {
  let state = seed
  return function() {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function generateDailyLeaderboard(): LeaderboardEntry[] {
  const seed = getDailySeed()
  const random = seededRandom(seed)
  
  const entries: LeaderboardEntry[] = []
  const usedUsernames = new Set<string>()
  
  for (let i = 0; i < 10; i++) {
    let username: string
    do {
      username = FAMOUS_USERNAMES[Math.floor(random() * FAMOUS_USERNAMES.length)]
    } while (usedUsernames.has(username))
    usedUsernames.add(username)
    
    // Generate scores with realistic distribution (top players have higher scores)
    const baseScore = 15000 - (i * 1200) + Math.floor(random() * 800) - 400
    const score = Math.max(baseScore, 1000)
    
    const accuracy = Math.max(60, 95 - (i * 3) + Math.floor(random() * 10) - 5)
    const streak = Math.max(1, 50 - (i * 4) + Math.floor(random() * 8) - 4)
    const gamesPlayed = Math.max(5, 200 - (i * 15) + Math.floor(random() * 30) - 15)
    
    entries.push({
      id: `daily-${seed}-${i}`,
      username,
      score,
      accuracy,
      streak,
      gamesPlayed,
      country: COUNTRIES[Math.floor(random() * COUNTRIES.length)],
      rank: i + 1
    })
  }
  
  return entries
}

function getUserStats(): UserStats | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem('songless-user-stats')
  if (!stored) return null
  
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('songless-user-stats', JSON.stringify(stats))
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-500" />
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />
    case 3:
      return <Award className="w-5 h-5 text-amber-600" />
    default:
      return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }
}

function getRankBadgeVariant(rank: number) {
  switch (rank) {
    case 1:
      return "default"
    case 2:
      return "secondary" 
    case 3:
      return "outline"
    default:
      return "outline"
  }
}

function getScoreColor(rank: number) {
  switch (rank) {
    case 1:
      return "text-yellow-600 font-bold"
    case 2:
      return "text-gray-600 font-semibold"
    case 3:
      return "text-amber-600 font-semibold"
    default:
      return "text-foreground"
  }
}

export function LeaderboardModal({ open, onOpenChange }: LeaderboardModalProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [userRank, setUserRank] = useState<number | null>(null)

  useEffect(() => {
    if (open) {
      const dailyData = generateDailyLeaderboard()
      const currentUser = getUserStats()
      
      setLeaderboardData(dailyData)
      setUserStats(currentUser)
      
      // Calculate user's hypothetical rank
      if (currentUser) {
        const userScore = currentUser.score
        let rank = 1
        for (const entry of dailyData) {
          if (userScore > entry.score) break
          rank++
        }
        setUserRank(rank > 10 ? rank + Math.floor(Math.random() * 50) : rank)
      }
    }
  }, [open])

  const handleCreateProfile = () => {
    const newStats: UserStats = {
      username: `Player${Math.floor(Math.random() * 9999)}`,
      score: 0,
      accuracy: 0,
      streak: 0,
      gamesPlayed: 0,
      lastUpdated: new Date().toISOString()
    }
    saveUserStats(newStats)
    setUserStats(newStats)
    setUserRank(Math.floor(Math.random() * 500) + 100)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Today's Global Leaderboard
            <Badge variant="outline" className="ml-auto">Live</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {leaderboardData.slice(0, 3).map((entry, index) => (
              <div
                key={entry.id}
                className={`text-center p-4 rounded-lg border ${
                  index === 0 ? 'bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-200' :
                  index === 1 ? 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200' :
                  'bg-gradient-to-b from-amber-50 to-amber-100 border-amber-200'
                }`}
              >
                <div className="flex justify-center mb-2">
                  {getRankIcon(entry.rank)}
                </div>
                <Avatar className="w-12 h-12 mx-auto mb-2">
                  <AvatarFallback className="text-sm font-bold">
                    {entry.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="font-semibold text-sm truncate">{entry.username}</p>
                <p className={`text-lg ${getScoreColor(entry.rank)}`}>
                  {entry.score.toLocaleString()}
                </p>
                <div className="flex justify-center items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3" />
                  {entry.accuracy}%
                </div>
              </div>
            ))}
          </div>

          {/* Ranks 4-10 */}
          <div className="space-y-2">
            {leaderboardData.slice(3).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={getRankBadgeVariant(entry.rank)} className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                    {entry.rank}
                  </Badge>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {entry.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{entry.username}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{entry.country}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {entry.streak} streak
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{entry.score.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{entry.accuracy}% accuracy</p>
                </div>
              </div>
            ))}
          </div>

          {/* Current User Status */}
          {userStats ? (
            <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userStats.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      {userStats.username}
                      <Badge variant="secondary">You</Badge>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Rank #{userRank} • {userStats.score.toLocaleString()} points
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {userStats.accuracy}%
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {userStats.streak}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="font-semibold mb-1">Join the Competition!</p>
              <p className="text-sm text-muted-foreground mb-3">
                Create your profile to track your progress and compete for the top spot
              </p>
              <Button onClick={handleCreateProfile} size="sm">
                Create Player Profile
              </Button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Updates daily at midnight UTC "Test"</span>
            <span>🏆 Think you can reach #1?</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}