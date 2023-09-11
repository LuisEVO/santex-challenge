import { Injectable } from '@angular/core';
import { Battleship, GameOverType } from '../models/battleship.model';
import { formatDate } from '@angular/common';
import { Player } from '../models/player.model';

interface HistoryItem {
  start: string;
  end: string;
  turns: number;
  overallAccuracy: number;
  status: string;
  player: string;
}

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  items: HistoryItem[] = [];

  constructor() {
    this.items = this.loadFromStorage()
  }

  saveHistory(battleship: Battleship, player: Player, result: GameOverType) {
    const item: HistoryItem = {
      start: formatDate(battleship.start, 'MM-dd-YYYY hh:mm', 'en'),
      end: formatDate(battleship.end!, 'MM-dd-YYYY hh:mm', 'en'),
      turns: player.attacks.length,
      overallAccuracy: player.attacks.filter(attack => attack.result !== 'failed').length / player.attacks.length,
      status: result,
      player: player.type
    }

    this.items.push(item)
    this.saveInStorage();
  }

  saveInStorage() {
    localStorage.setItem('history', JSON.stringify(this.items))
  }

  loadFromStorage() {
    const historyString = localStorage.getItem('history');
    return historyString ? JSON.parse(historyString) : [];
  }
}
