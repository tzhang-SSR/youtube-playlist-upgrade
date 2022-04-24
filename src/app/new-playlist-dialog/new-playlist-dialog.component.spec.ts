import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlaylistDialogComponent } from './new-playlist-dialog.component';

describe('NewPlaylistDialogComponent', () => {
  let component: NewPlaylistDialogComponent;
  let fixture: ComponentFixture<NewPlaylistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPlaylistDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPlaylistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
