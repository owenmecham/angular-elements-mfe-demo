import { AdesaAuthorizationService } from '@adesa/authorization';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CallbackComponent } from './callback.component';

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;

  const adesaAuthServiceMock = jasmine.createSpyObj<AdesaAuthorizationService>('AdesaAuthorizationService', [
    'isAuthenticated',
    'getDesiredUrl',
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CallbackComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: AdesaAuthorizationService, useValue: adesaAuthServiceMock }],
    }).compileComponents();

    adesaAuthServiceMock.isAuthenticated.and.callFake(() => Promise.resolve(true));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
