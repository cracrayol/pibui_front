import { Component, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SearchComponent } from '../../components/search/search.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { Title } from '@angular/platform-browser';
import * as yt from 'youtube-player';
import { ParamMap } from '@angular/router/src/shared';

@Component({
  selector: 'pbi-index',
  templateUrl: './mainPage.component.html'
})
export class MainPageComponent implements AfterViewInit {

  @ViewChild('searchpanel') searchPanel: MatSidenav;
  @ViewChild(SearchComponent) searchCmp: SearchComponent;

  movie: any;
  player: any;
  movieTitle = 'Loading';
  movieSubtitle: string;
  cdJapanLink: string;
  isMobile = window.innerWidth < 1024;

  headerButtons = [{
    icon: 'search',
    click: () => {
      this.searchPanel.toggle();
    }
  }];

  constructor(private movieService: MovieService, private title: Title, private location: Location,
    private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.player = yt('ytplayer', {
      playerVars: {
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        iv_load_policy: 3,
        suggestedQuality: 'default'
      }
    });

    this.player.on('stateChange', (event) => {
      if (event.data === 0) {
        this.playNextVideo();
      }
    });

    this.player.on('error', (event) => {
      // TODO log error
      this.playNextVideo();
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.playNextVideo(parseInt(params.get('id'), 10));
      } else {
        this.playNextVideo();
      }
    });
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
        this.player.loadVideoById(movie.linkId);
        this.player.playVideo().then(() => {
        });

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
