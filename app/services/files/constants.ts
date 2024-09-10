import type { FileSystem } from './types';

// Define any and all file systems/disks that you wish to access
// throughout the app here. They can be locally mounted on the
// system or can be accessed from a remote system.
//
// The currently supported drivers are: ['local']
export const disks = {
  // All local assets that need to be accessed statically
  // for emails, pdfs, etc.
  assets: {
    driver: 'local',
    root: 'assets/',
  },

  // Add more disks here...
} satisfies Record<string, FileSystem>;

export type Disk = keyof typeof disks;
