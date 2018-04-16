import { Playlist } from './playlist';

export interface User {
    id?: number;
    email?: string;
    currentPlaylistId: number;
}
