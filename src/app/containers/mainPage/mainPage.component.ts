import { Component, ViewChild, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SearchComponent } from '../../components/search/search.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { Title } from '@angular/platform-browser';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'pbi-index',
  templateUrl: './mainPage.component.html'
})
export class MainPageComponent implements AfterViewInit, OnInit {

  @ViewChild('searchpanel', { static: true }) searchPanel: MatSidenav;
  @ViewChild(SearchComponent, { static: true }) searchCmp: SearchComponent;
  @ViewChild(YouTubePlayer, { static: true }) player: YouTubePlayer;

  movie: any;
  movieTitle = 'Loading';
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

  headerButtons = [{
    icon: 'search',
    click: () => {
      this.searchPanel.toggle();
    }
  }];

  constructor(private movieService: MovieService, private title: Title, private location: Location,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  ngAfterViewInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.playNextVideo(parseInt(params.get('id'), 10));
      } else {
        this.playNextVideo();
      }
    });
  }

  onStateChange(event: YT.OnStateChangeEvent) {
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

  playNextVideo(id: number = -1) {
    this.movieService.get(id).subscribe(
      movie => {
        this.movie = movie;
        this.player.videoId = movie.linkId;
        this.player.playVideo();

        this.movieTitle = movie.author.name + ' - ' + movie.title;
        this.movieSubtitle = '';

        this.title.setTitle(this.movieTitle + ' - ' + 'Pibui');

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

}
