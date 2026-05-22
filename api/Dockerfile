FROM node:20-alpine AS build

WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . ./
# build & remove devDependencies from node_modules
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine

ENV PORT=3000
WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/dist /usr/src/app/dist
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules

COPY --chown=node:node --from=build /usr/src/app/package.json /usr/src/app/package.json
COPY --chown=node:node --from=build /usr/src/app/envs /usr/src/app/envs

EXPOSE 3000

HEALTHCHECK CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

USER node

ENTRYPOINT [ "node" ]
CMD [ "dist/main.js" ]
