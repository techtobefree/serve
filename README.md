# Vite + SWC + React + Typescript + Generouted + PWA + Eslint

### Local dev
- `pnpm i`
- `pnpm dev`

#### For local db
- Copy the `.env.example` to `.env`
- Run `pnpm db:start`
- Copy the API URL, and anon key from the console into the `.env` file and save

##### Create a local user
1. Create a user using local supabase UI http://localhost:54323/ -> Authentication -> Add User
2. Copy the ./supabase/local.tsx file into ./src/pages/local.tsx
3. Uncomment it, and replace the email and password with the credentials from step 1.
4. Open http://localhost:5173/local and it should log you in, and navigate you to /

##### New migrations
- Create a new migration `pnpm db:new NAME_NEW_MIGRATION`
- Push to local db `db:push --local`
- Generate new type definitions `db:types`
- To push migrations to production, will require linking.

### Original setup
Generated ios and android directories
`npx cap add ios`
`npx cap add android`

### Shipping
- Web only `pnpm build`
- Web, iOS, and Android `pnpm build:all`

### Testing
- local web: `pnpm dev`
- local android: `pnpm dev:android`
- local ios: `pnpm dev:ios`

### TODO
Figure out how to allow someone to pass admin to another user.
(Maybe doesn't matter) update buttons to use links so hover and ctrl+click works.
