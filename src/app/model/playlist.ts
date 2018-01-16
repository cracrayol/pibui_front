import { PlaylistTag } from './playlistTag';

export interface Playlist {
    _id?: number;
    name?: string;
    current?: boolean;
    playlistTag?: PlaylistTag[];
}
