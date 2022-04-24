import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideosDialogComponent } from './add-videos-dialog.component';

describe('AddVideosDialogComponent', () => {
  let component: AddVideosDialogComponent;
  let fixture: ComponentFixture<AddVideosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVideosDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVideosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
