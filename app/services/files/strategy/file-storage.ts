export type GetFileParams = {
  fileName: string;
};

export type SaveFileParams = {
  file: Buffer | string;
  fileName: string;
};

export interface FileStorageProvider {
  /**
   * Handle getting a file from the specified file system disk.
   *
   * @param params the file path/name combo to retrieve the file.
   *
   * @returns the file as a `Buffer`.
   */
  getFile(params: GetFileParams): Promise<Buffer>;

  /**
   * Handle saving a file in the specified file system disk.
   *
   * @param params the file and it's attributes.
   *
   * @returns the success status: `true` for success; `false`
   * otherwise.
   */
  saveFile(params: SaveFileParams): Promise<boolean>;
}
