export default {
  routes: [
    {
      method: 'GET',
      path: '/profile',
      handler: 'profile.find',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/profile',
      handler: 'profile.update',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/profile/like',
      handler: 'profile.like',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/profile/unlike',
      handler: 'profile.unlike',
      config: { policies: [] },
    },
  ],
};
