import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackLogComponent } from './attack-log.component';

describe('AttackLogComponent', () => {
  let component: AttackLogComponent;
  let fixture: ComponentFixture<AttackLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AttackLogComponent]
    });
    fixture = TestBed.createComponent(AttackLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
