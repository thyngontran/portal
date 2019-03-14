import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VtcComponent } from './vtc.component';

describe('VtcComponent', () => {
  let component: VtcComponent;
  let fixture: ComponentFixture<VtcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VtcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
