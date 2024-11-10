# Vite + SWC + React + Typescript + Generouted + PWA + Eslint

### Original setup
Generated ios and android directories
`npx cap add ios`
`npx cap add android`

### Shipping
`pnpm build`
`pnpm sync`

### Testing
`pnpm dev`
`pnpm dev:android`
`pnpm dev:ios`

## TODO
Figure out how to allow someone to pass admin to another user.
(Maybe doesn't matter) update buttons to use links so hover and ctrl+click works.


## Local dev
1. Create a user using local supabase UI http://localhost:54323/
2. Copy the ./supabase/local.tsx file into ./src/pages/local.tsx
3. Uncomment it, and replace the email and password with the credentials from step 1.
4. Open http://localhost:5173/local and it should log you in, and navigate you to /
