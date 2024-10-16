import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRefillComponent } from './account-refill.component';

describe('AccountRefillComponent', () => {
  let component: AccountRefillComponent;
  let fixture: ComponentFixture<AccountRefillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountRefillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRefillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
