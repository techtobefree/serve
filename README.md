# Vite + SWC + React + Typescript + Generouted + PWA + Eslint

### Local dev

- `pnpm i`
- `pnpm dev`

#### Local db

- Copy the `.env.example` to `.env`
- Run `pnpm db:start`
- Copy the API URL, and anon key from the console into the `.env` file and save

##### Create a local user

All of these steps will likely need to be performed after a `db:reset` which
syncs all migrations and seeds.

1. Create a user using local supabase UI http://localhost:54323/ ->
   Authentication -> Add User
2. Put the email, and password into your local `.env` file, and add
   VITE_LOCAL=true
3. Create a storage bucket named "public-images"
4. Make it public, and allow MIME types image/*

##### New migrations

- Create a new migration `pnpm db:new NAME_NEW_MIGRATION`
- Push to local db `db:push --local`
- Generate new type definitions `db:types`
- To push migrations to production, will require linking.

#### Local functions

- Install Deno https://docs.deno.com/runtime/getting_started/installation/
- Install Deno dependencies `deno install`
- Host locally: `npx supabase functions serve`

### Original setup

Generated ios and android directories `npx cap add ios` `npx cap add android`

### Shipping

- Web only `pnpm build`
- Web, iOS, and Android `pnpm build:all`

### Testing

- local web: `pnpm dev`
- local android: `pnpm dev:android`
- local ios: `pnpm dev:ios`

### TODO

Figure out how to allow someone to pass admin to another user. (Maybe doesn't
matter) update buttons to use links so hover and ctrl+click works.

#### Native

Enable image stuff on native
https://ionicframework.com/docs/native/camera#pickimages Verify native calendar
stuff for @awesome-cordova-plugins/calendar

Crop, and center tool - at the same time compress the image, so it is not over
10 MB, and I can change the bucket back down again
