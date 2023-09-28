import { Playlist } from './playlist';

export interface User {
    id?: number;
    email?: string;
    oldPassword?: string;
    password?: string;
    currentPlaylistId: number;
    isAdmin: boolean;
}
