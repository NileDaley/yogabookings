import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponent } from './messages.component';

const messageText = 'THIS IS A TEST MESSAGE';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [MessagesComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
  });
  it('should show a plain message', () => {
    component.messages = [{ message: messageText }];
    fixture.detectChanges();
    const { text, classList } = getMessageElements(fixture);
    expect(text).toEqual(messageText);
  });
  it('should show a success message', () => {
    component.messages = [{ message: messageText, type: 'success' }];
    fixture.detectChanges();
    const { text, classList } = getMessageElements(fixture);
    expect(text).toEqual(messageText);
    expect(classList).toContain('is-success');
  });
  it('should show an error message', () => {
    component.messages = [{ message: messageText, type: 'error' }];
    fixture.detectChanges();
    const { text, classList } = getMessageElements(fixture);
    expect(text).toEqual(messageText);
    expect(classList).toContain('is-danger');
  });
  it('should show a warning message', () => {
    component.messages = [{ message: messageText, type: 'warning' }];
    fixture.detectChanges();
    const { text, classList } = getMessageElements(fixture);
    expect(text).toEqual(messageText);
    expect(classList).toContain('is-warning');
  });
});

const getMessageElements = _fixture => {
  const text = _fixture.nativeElement.querySelector('.messageText').innerText;
  const classList = _fixture.nativeElement.querySelector('.notification')
    .classList;
  return { text, classList };
};
