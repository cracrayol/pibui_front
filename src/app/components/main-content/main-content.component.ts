import { Component, ViewChild, AfterViewInit, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SearchComponent } from '../../components/search/search.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { Title } from '@angular/platform-browser';
import { YouTubePlayer } from '@angular/youtube-player';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Movie } from 'src/app/model/movie';
import { LegalNoticeComponent } from '../legal-notice/legal-notice.component';

@Component({
  selector: 'pbi-index',
  templateUrl: './main-content.component.html'
})
export class MainContentComponent implements AfterViewInit, OnInit {

  @ViewChild('searchpanel', { static: true }) searchPanel: MatSidenav;
  @ViewChild(SearchComponent, { static: true }) searchCmp: SearchComponent;
  @ViewChild(YouTubePlayer, { static: true }) player: YouTubePlayer;

  movie: Movie;
  movieSubtitle: string;
  cdJapanLink: string;
  isMobile = window.innerWidth < 1024;
  apiLoaded = false;
  playerVars: YT.PlayerVars = {
    rel: 0,
    showinfo: 0,
    modestbranding: 1,
    iv_load_policy: 3
  }

  currentDate = new Date();

  headerButtons = [{
    icon: 'search',
    click: () => {
      this.searchPanel.toggle();
    }
  }];

  constructor(private movieService: MovieService, private title: Title, private location: Location,
    private route: ActivatedRoute, public auth: AuthService, public dialog: MatDialog, cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    // Load the Youtube API
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  ngAfterViewInit() {
    // Load a specific movie if there's an ID in the URL
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.playNextVideo(parseInt(params.get('id'), 10));
      } else {
        this.playNextVideo();
      }
    });
  }

  onStateChange(event: YT.OnStateChangeEvent) {
    // When video ends, play next one
    if (event.data === 0) {
      this.playNextVideo();
    }
  }

  onError(event: YT.OnErrorEvent) {
    // TODO log error
    this.playNextVideo();
  }

  playSearchedItem(id: number) {
    this.searchPanel.close();
    this.playNextVideo(id);
    scrollTo(0, 0);
  }

  searchAuthor() {
    this.searchPanel.open();
    const search = '"' + this.movie.author.name + '"';
    this.searchCmp.searchField.nativeElement.value = search;
    this.searchCmp.search(search);
  }

  /**
   * Load a movie from the given id. If id is -1, take a movie randomly, based on selected playlist.
   * @param id Id of a movie
   */
  playNextVideo(id: number = -1) {
    this.movieService.get(id).subscribe(
      movie => {
        this.movie = movie;
        this.player.playVideo();

        this.title.setTitle(movie.author.name + ' - ' + this.movie.title + ' - ' + 'Pibui');

        this.movieSubtitle = '';
        if (movie.author.subname !== '' && movie.subtitle === '') {
          this.movieSubtitle = movie.author.subname + ' - ' + movie.title;
        } else if (movie.author.subname === '' && movie.subtitle !== '') {
          this.movieSubtitle = movie.author.name + ' - ' + movie.subtitle;
        } else if (movie.author.subname !== '' && movie.subtitle !== '') {
          this.movieSubtitle = movie.author.subname + ' - ' + movie.subtitle;
        }

        if (!this.location.isCurrentPathEqualTo('/play/' + movie.id)) {
          this.location.go('/play/' + movie.id);
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = event.target.innerWidth < 1024;
  }

  openLegalNotice() {
    this.dialog.open(LegalNoticeComponent, {
      width: '800px',
    });
  }

}
