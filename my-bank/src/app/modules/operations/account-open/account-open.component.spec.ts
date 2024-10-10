import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOpenComponent } from './account-open.component';

describe('AccountOpenComponent', () => {
  let component: AccountOpenComponent;
  let fixture: ComponentFixture<AccountOpenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountOpenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
