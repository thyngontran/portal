import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BjerringComponent } from './bjerring.component';

describe('BjerringComponent', () => {
  let component: BjerringComponent;
  let fixture: ComponentFixture<BjerringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BjerringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BjerringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
