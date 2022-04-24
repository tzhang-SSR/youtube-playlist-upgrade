import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistDialogGroupComponent } from './playlist-dialog-group.component';

describe('PlaylistDialogGroupComponent', () => {
  let component: PlaylistDialogGroupComponent;
  let fixture: ComponentFixture<PlaylistDialogGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistDialogGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistDialogGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
