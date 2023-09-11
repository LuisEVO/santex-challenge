import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { tap } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

type SetUpForm = {
  level: FormControl;
  setCustom: FormControl;
  turns: FormControl;
}

const LevelOrTurn = (form: FormGroup<SetUpForm>): ValidationErrors | null => {
  const isValid = !!(form.value.level || form.value.turns)
  return isValid ? null : {levelOrTurn: true}
}

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export default class SetupComponent {
  form: FormGroup<SetUpForm>;

  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private router: Router,
    private activeRouter: ActivatedRoute,

    ) {
    this.form = this.formBuilder.group({
      level: this.configService.level,
      setCustom: !!this.configService.turns,
      turns: this.configService.turns,
    }, { validators: LevelOrTurn });

    this.enableOrDisableLevelOrTurns(!!this.configService.turns)

    this.form.controls.setCustom.valueChanges
      .pipe(
        tap((value) => this.enableOrDisableLevelOrTurns(value))
      )
      .subscribe();
  }

  enableOrDisableLevelOrTurns(setCustom: boolean) {
    if (setCustom) {
      this.form.controls.level.disable();
      this.form.controls.turns.enable();
    } else {
      this.form.controls.level.enable();
      this.form.controls.turns.disable();
    }
  }

  save() {
    if (this.form.value.level) {
      this.configService.setLevel(this.form.value.level)
      this.configService.setTurns(undefined)
    } else {
      this.configService.setTurns(this.form.value.turns)
      this.configService.setLevel(undefined)
    }
    this.router.navigate(['../board'], { relativeTo: this.activeRouter })
  }
}
