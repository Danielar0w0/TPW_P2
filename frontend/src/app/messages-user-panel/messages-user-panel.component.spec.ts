import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesUserPanelComponent } from './messages-user-panel.component';

describe('MessagesUserPanelComponent', () => {
  let component: MessagesUserPanelComponent;
  let fixture: ComponentFixture<MessagesUserPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesUserPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesUserPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
