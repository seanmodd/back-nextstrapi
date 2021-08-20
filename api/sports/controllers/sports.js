'use strict';
const {sanitizeEntity, parseMultipartData} = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // ! Creating News for signed user
  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.sports.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.sports.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.sports });
  },

  // ! Updating News for signed user
  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [sports] = await strapi.services.sports.find({
      id: ctx.params.id,
      'user.id': ctx.state.user.id,
    });

    if (!sports) {
      return ctx.unauthorized('You can\'t update this entry');
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.sports.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.sports.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.sports });
  },
  async me(ctx) {
    const user = ctx.state.user;
    if(!user) {
      ctx.throw(401, 'Unauthorized');
    }
    const data = await strapi.services.sports.find({user: user.id});

    if(!data) {
      ctx.throw(404, 'Not Found');
    }
    return sanitizeEntity(data, {model: strapi.models.sports});
  },
};
