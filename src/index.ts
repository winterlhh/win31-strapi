import type { Core } from '@strapi/strapi';

const PUBLIC_PERMISSIONS = [
  { action: 'api::profile.profile.find',            subject: null },
  { action: 'api::profile.profile.like',            subject: null },
  { action: 'api::profile.profile.unlike',          subject: null },
  { action: 'api::social-link.social-link.find',    subject: null },
  { action: 'api::social-link.social-link.findOne', subject: null },
  { action: 'api::article.article.find',            subject: null },
  { action: 'api::article.article.findOne',         subject: null },
];

async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  for (const perm of PUBLIC_PERMISSIONS) {
    const exists = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action: perm.action, role: publicRole.id } });

    if (!exists) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: { ...perm, role: publicRole.id, enabled: true },
      });
    } else if (!exists.enabled) {
      await strapi
        .query('plugin::users-permissions.permission')
        .update({ where: { id: exists.id }, data: { enabled: true } });
    }
  }
}

async function seedDefaultData(strapi: Core.Strapi) {
  const existing = await strapi.documents('api::profile.profile').findFirst({});
  if (!existing) {
    await strapi.documents('api::profile.profile').create({
      data: {
        name: 'Harry',
        bio: "Hi I'm Harry!",
        avatarAlt: 'Harry',
        backgroundSrc: '/profile-bg.jpg',
        backgroundAlt: 'Background',
        likeLabel: 'Like',
        likeCount: 0,
      },
    });
  }

  const linkCount = await strapi.documents('api::social-link.social-link').count({});
  if (linkCount === 0) {
    const defaults = [
      { platform: 'instagram', label: 'Instagram', href: 'https://instagram.com', order: 1 },
      { platform: 'medium',    label: 'Medium',    href: 'https://medium.com',    order: 2 },
      { platform: 'linkedin',  label: 'Linkedin',  href: 'https://linkedin.com',  order: 3 },
    ];
    for (const link of defaults) {
      await strapi.documents('api::social-link.social-link').create({ data: link });
    }
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await setPublicPermissions(strapi);
      await seedDefaultData(strapi);
    } catch (err) {
      strapi.log.error('Bootstrap seed failed (non-fatal):', err);
    }
  },
};
