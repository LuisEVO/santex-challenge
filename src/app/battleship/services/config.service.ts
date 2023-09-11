import { Injectable } from '@angular/core';

type Level = 'easy' | 'medium' | 'hard'

const LevelMap: Map<Level, (number | undefined)> = new Map([
  ['easy', undefined],
  ['medium', 100],
  ['hard', 50],
])

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  level?: Level;
  turns?: number;

  constructor() {
    this.setLevel(localStorage.getItem('level') ? localStorage.getItem('level') as Level : undefined);
    this.setTurns(localStorage.getItem('turns') ? Number(localStorage.getItem('turns')) : undefined);
  }

  setLevel(level?: Level) {
    this.level = level;
    localStorage.setItem('level', this.level ? String(this.level) : '');
  }

  setTurns(turns?: number) {
    this.turns = turns;
    localStorage.setItem('turns', this.turns ? String(this.turns) : '');
  }

  getSetupTurns() {
    if(this.level) return LevelMap.get(this.level)
    return this.turns
  }
}
