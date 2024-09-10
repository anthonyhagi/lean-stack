import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

import type {
  FileStorageProvider,
  GetFileParams,
  SaveFileParams,
} from './file-storage';

export function getProjectRootPath() {
  return path.join(process.cwd(), 'app');
}

export type LocalFileStorageConstructorParams = {
  rootDir: string;
};

export class LocalFileStorage implements FileStorageProvider {
  private rootFilePath: string;

  constructor(params: LocalFileStorageConstructorParams) {
    const { rootDir } = params;

    const root = getProjectRootPath();

    this.rootFilePath = path.join(root, rootDir);
  }

  /**
   * Handle retrieving the file from the local file system.
   *
   * @param params the file name including the path to the file.
   *
   * @returns the file as a `Buffer`.
   */
  public async getFile(params: GetFileParams): Promise<Buffer> {
    const { fileName } = params;

    const filePath = this.getFinalPath(fileName);

    return readFileSync(filePath);
  }

  /**
   * Handle saving the file to the local file system.
   *
   * @param params the file to save and the file name to save it as.
   *
   * @returns `true` if the file saved successfully, `false` otherwise.
   */
  public async saveFile(params: SaveFileParams): Promise<boolean> {
    const { file, fileName } = params;

    const filePath = this.getFinalPath(fileName);

    try {
      writeFileSync(filePath, file);

      return true;
    } catch (error: unknown) {
      console.error(`[ERROR]: Failed to save file to path: ${filePath}`);
      console.error(error);

      return false;
    }
  }

  private getFinalPath(fileName: string): URL | string {
    return path.join(this.rootFilePath, fileName);
  }
}
