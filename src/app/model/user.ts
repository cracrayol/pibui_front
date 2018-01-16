import { Playlist } from './playlist';

export interface User {
    _id?: number;
    email?: string;
    config?: any;
    playlists: Playlist[];
}
