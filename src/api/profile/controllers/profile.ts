import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::profile.profile', ({ strapi }) => ({
  async like(ctx) {
    const profile = await strapi.documents('api::profile.profile').findFirst({});
    if (!profile) {
      return ctx.notFound('Profile not found');
    }

    const updated = await strapi.documents('api::profile.profile').update({
      documentId: profile.documentId,
      data: { likeCount: (profile.likeCount ?? 0) + 1 },
    });

    return ctx.send({ likeCount: updated.likeCount });
  },

  async unlike(ctx) {
    const profile = await strapi.documents('api::profile.profile').findFirst({});
    if (!profile) {
      return ctx.notFound('Profile not found');
    }

    const current = profile.likeCount ?? 0;
    const updated = await strapi.documents('api::profile.profile').update({
      documentId: profile.documentId,
      data: { likeCount: Math.max(0, current - 1) },
    });

    return ctx.send({ likeCount: updated.likeCount });
  },
}));
