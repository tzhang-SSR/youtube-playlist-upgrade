import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistSidebarComponent } from './playlist-sidebar.component';

describe('PlaylistSidebarComponent', () => {
  let component: PlaylistSidebarComponent;
  let fixture: ComponentFixture<PlaylistSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
