export type LocalFileSystem = {
  driver: 'local';

  // The root location we will use to access files on the file
  // system.
  root: string;
};

export type S3FileSystem = {
  driver: 's3';
  key: string;
  secret: string;
  region: string;
  bucket: string;
};

// Use these two file systems as a starting point. If you need
// another type of file system, create it above and add it to
// the union below.
export type FileSystem = LocalFileSystem | S3FileSystem;
