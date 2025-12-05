<script setup lang="ts">
import { computed } from 'vue'
import type { Match, Player } from '@/types'

interface Props {
  match: Match
  players: Player[]
  matchNumber: number
}

const props = defineProps<Props>()

const team1Player1 = computed(() => props.players.find(p => p.id === props.match.team1.player1Id))
const team1Player2 = computed(() => props.players.find(p => p.id === props.match.team1.player2Id))
const team2Player1 = computed(() => props.players.find(p => p.id === props.match.team2.player1Id))
const team2Player2 = computed(() => props.players.find(p => p.id === props.match.team2.player2Id))
</script>

<template>
  <div class="bg-emerald-400 p-2 space-y-2">
    <div class="flex justify-between bg-orange-400 border-4 border-white text-white text-xl font-bold">
        <div class="flex flex-col text-left gap-2 p-4 border-r-4 border-white w-1/2">
          <div class="whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {{ team1Player1?.name || 'Unknown' }}
          </div>
          <div class="whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {{ team1Player2?.name || 'Unknown' }}
          </div>
        </div>
        <div class="flex flex-col text-right gap-2 p-4 w-1/2">
          <div class="whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {{ team2Player1?.name || 'Unknown' }}
          </div>
          <div class="whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {{ team2Player2?.name || 'Unknown' }}
          </div>
        </div>
    </div>
  </div>
</template>
