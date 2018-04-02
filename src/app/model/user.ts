import { Playlist } from './playlist';

export interface User {
    id?: number;
    email?: string;
    config?: any;
    playlists: Playlist[];
}
