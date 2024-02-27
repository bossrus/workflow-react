const URLS = [
    'workflows',
    'users',
    'users/me',
    'users/login',
    'departments',
    'firms',
    'modifications',
    'typesOfWork',
    'invites',
    'flashes',
] as const;
type IUrls = (typeof URLS)[number];