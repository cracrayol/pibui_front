import { PlaylistTag } from './playlistTag';

export interface Playlist {
    id?: number;
    name?: string;
    current?: boolean;
    playlistTag?: PlaylistTag[];
}
