import { Component, AfterViewInit, HostListener, ElementRef, inject, viewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SearchComponent } from '../../components/search/search.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { Title } from '@angular/platform-browser';
import { YouTubePlayer, YouTubePlayerModule } from '@angular/youtube-player';
import { MatDialog } from '@angular/material/dialog';
import { Movie } from 'src/app/model/movie';
import { LegalNoticeComponent } from '../legal-notice/legal-notice.component';
import { NavBarComponent } from '../navbar/navbar.component';
import { TagsComponent } from '../tags/tags.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'pbi-index',
    templateUrl: './main-content.component.html',
    imports: [NavBarComponent, MatSidenavModule, TagsComponent, SearchComponent, YouTubePlayerModule, MatIconModule, MatButtonModule, MatTooltipModule,
        CommonModule, MatSlideToggleModule, FormsModule]
})
export class MainContentComponent implements AfterViewInit {
  private movieService = inject(MovieService);
  private title = inject(Title);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  youtubeDiv = viewChild<ElementRef<HTMLElement>>('youtubeDiv');
  searchPanel = viewChild<MatSidenav>('searchpanel');
  player = viewChild(YouTubePlayer);
  searchCmp = viewChild(SearchComponent);

  showSub = false;
  movie: Movie;
  movieSubtitle: string;
  isMobile = window.innerWidth < 1024;
  playerWidth = 0;
  playerHeight = 0;
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
      this.searchPanel().toggle();
    }
  }];

  ngAfterViewInit() {
    this.playerWidth = this.youtubeDiv().nativeElement.parentElement.clientWidth * 0.8;
    this.playerHeight = this.playerWidth * 9 / 16;

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
    this.playNextVideo(-1, true);
  }

  playSearchedItem(id: number) {
    this.searchPanel().close();
    this.playNextVideo(id);
    scrollTo(0, 0);
  }

  searchAuthor() {
    this.searchPanel().open();
    const search = this.movie.author.name;
    this.searchCmp().searchField().nativeElement.value = search;
    this.searchCmp().search(search);
  }

  /**
   * Load a movie from the given id. If id is -1, take a movie randomly, based on selected playlist.
   * @param id Id of a movie
   */
  playNextVideo(id: number = -1, lastOnError = false) {
    this.movieService.get(id, lastOnError).subscribe(
      movie => {
        this.movie = movie;
        this.player().playVideo();

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
    this.playerWidth = this.youtubeDiv().nativeElement.parentElement.clientWidth * 0.8;
    this.playerHeight = this.playerWidth * 9 / 16;
  }

  openLegalNotice() {
    this.dialog.open(LegalNoticeComponent, {
      width: '800px',
    });
  }

  getAuthorName() {
    if(this.showSub && this.movie.author.subname != '') {
      return this.movie.author.subname;
    }
    return this.movie.author.name;
  }

  getMovieTitle() {
    if(this.showSub && this.movie.subtitle != '') {
      return this.movie.subtitle;
    }
    return this.movie.title;
  }

}
