import { type Disk, disks } from './constants';
import { LocalFileStorage } from './strategy/local-file-storage';
import type { FileSystem } from './types';

function getFileStorageProvider(fileSystem: FileSystem) {
  const driver = fileSystem.driver;

  switch (driver) {
    case 'local':
      return new LocalFileStorage({
        rootDir: fileSystem.root,
      });

    default:
      throw new Error(
        `[ERROR]: File storage provider for driver '${driver}' has not been set up`
      );
  }
}

type GetFileParams = {
  disk: Disk;
  fileName: string;
};

export async function getFile(params: GetFileParams) {
  const { disk, fileName } = params;

  const fileSystem = disks[disk];
  const storageProvider = getFileStorageProvider(fileSystem);

  return storageProvider.getFile({ fileName });
}

type SaveFileParams = {
  disk: Disk;
  file: Buffer | string;
  fileName: string;
};

export async function saveFile(params: SaveFileParams) {
  const { disk, file, fileName } = params;

  const fileSystem = disks[disk];
  const storageProvider = getFileStorageProvider(fileSystem);

  return storageProvider.saveFile({ file, fileName });
}
