import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesWithComponent } from './messages-with.component';

describe('MessagesWithComponent', () => {
  let component: MessagesWithComponent;
  let fixture: ComponentFixture<MessagesWithComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesWithComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
