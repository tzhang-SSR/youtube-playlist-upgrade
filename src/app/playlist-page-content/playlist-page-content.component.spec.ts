import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistPageContentComponent } from './playlist-page-content.component';

describe('PlaylistPageContentComponent', () => {
  let component: PlaylistPageContentComponent;
  let fixture: ComponentFixture<PlaylistPageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistPageContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
