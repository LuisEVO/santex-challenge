import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttackRecord } from '../../models/attack.model';

@Component({
  selector: 'app-attack-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attack-log.component.html',
  styleUrls: ['./attack-log.component.scss']
})
export class AttackLogComponent {
  @Input({ required: true }) attacks: AttackRecord[] = [];
  @Input() maxLogsToShow = 8;

}
