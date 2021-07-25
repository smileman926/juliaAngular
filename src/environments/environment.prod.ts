import { createEnvironmentSettings } from '@/environments/create-environment-settings';

export const environment = createEnvironmentSettings({
  production: true,
  remoteUrl: '/',
  apiUrl: '/easybooking/index.php/juliaAngular',
  legacyContentUrl: '',
  loginUrl: 'https://www.easy-booking.at/login/',
});
