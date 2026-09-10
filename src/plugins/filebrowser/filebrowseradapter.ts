export interface FileBrowserSelection {
	url: string;
}

export interface ImageFileBrowserSelection extends FileBrowserSelection {
	alt?: string;
}

export interface FileBrowserAdapter {
	pickImage(): Promise<ImageFileBrowserSelection | null>;
	pickVideo(): Promise<FileBrowserSelection | null>;
	pickAudio(): Promise<FileBrowserSelection | null>;
}
