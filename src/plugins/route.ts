import type { RouteOptions } from "fastify";

import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifySchema {
    isPublic?: boolean;
    isPrivate?: boolean;
  }
}

export default fp(
  async (fastify) => {
    fastify.log.info("Route plugin starting");

    fastify.decorate(
      "public",
      function publicRoute(routeOptions: RouteOptions) {
        routeOptions.schema = { ...routeOptions.schema, isPublic: true };
      },
    );

    fastify.decorate(
      "private",
      function privateRoute(routeOptions: RouteOptions) {
        routeOptions.schema = { ...routeOptions.schema, isPrivate: true };
      },
    );

    // Hook global untuk pengecekan
    fastify.addHook("onRequest", async function onRequest(request, reply) {
      const isPublic = request.routeOptions.schema?.isPublic;
      const isPrivate = request.routeOptions.schema?.isPrivate;

      // if (isPrivate) await fastify.au.authenticate(request);
      // if (!isPublic && !isPrivate) await app.authenticate(request); // Default private
    });
  },
  { name: "route", dependencies: [] },
);
