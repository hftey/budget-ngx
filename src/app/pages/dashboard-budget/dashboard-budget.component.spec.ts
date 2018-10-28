import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBudgetComponent } from './dashboard-budget.component';

describe('DashboardBudgetComponent', () => {
  let component: DashboardBudgetComponent;
  let fixture: ComponentFixture<DashboardBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
