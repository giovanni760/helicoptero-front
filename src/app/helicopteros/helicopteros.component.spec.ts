import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelicopterosComponent } from './helicopteros.component';

describe('HelicopterosComponent', () => {
  let component: HelicopterosComponent;
  let fixture: ComponentFixture<HelicopterosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelicopterosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelicopterosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
