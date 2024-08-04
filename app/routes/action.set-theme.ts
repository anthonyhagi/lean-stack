import { createThemeAction } from 'remix-themes';

import { themeSessionResolver } from '~/services/theme';

export const action = createThemeAction(themeSessionResolver);
