## Technologies Used
Kindly is built with TypeScript
### Languages 
| Frontend | Backend | Testing    |
| -------- | ------- | ---------- |
| React    | Next.js | Playwright|
| Tailwind | Supabase|            | 
 

## Installation

To run the Kindly application locally:

Fork the `enbloc-org/kindly` project to your personal github profile.  
You can do this by finding the `fork` button on the top-right corner of our repo.

![screenshot of fork button in github](./documentation_images/fork_repo.png)

Clone your new project into a local repository:

```bash
  git clone [url-to-your-forked-repo-here]
```

Go to the project directory:

```bash
  cd kindly
```

Install dependencies:

```bash
  npm install
```

Add env variables:

The .env.example file in the root directory shows what variables you will need. For Gmail app and AWS amplify variables you will need to ask for them on discord.  
For the supabase variables follow the guidance below on setting up your local instance.

## Setting up your development database

Kindly uses Supabase to serve its _postgres_ database. You will need to setup a local container to run a development instance of the database.

### Install docker
You will need to have docker installed and running before following the next steps. Find the latest version [here](https://www.docker.com/products/docker-desktop/).

Once it is installed, start your docker console. A container will be created in the next steps.

### Install the supabase cli
The cli will allow you to set up the schema and seed your local copy of the kindly database. Install it with the following command on your terminal:

```bash
brew install supabase/tap/supabase
```

You can find more comprehensive guidance in the [official docs](https://supabase.com/docs/guides/cli/getting-started) but we've outlined below the commands you will need to run in order to get started.

We have added to the repo a migration file and a seed file for the database, so you will only need to log into supabase with the following command:

```bash
supabase login
```

This will take you to the browser to complete a login. Then you will need to start your container with the following command:

```bash
supabase start
```

This script will run the migration file to set up your schema and then will run the `supabase/seed.sql` file to populate the database with some test data.

You should see the new "kindly" container in your docker console now.

Your terminal will have logged a series of details that will look something like this:

```bash

Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJh......
service_role key: eyJh......

```
You can view these details again at any time by running the following command:
```bash
supabase status
```

Copy the `DB URL` value into your `.env` file as the value of our `NEXT_PUBLIC_SUPABASE_URL` and the `anon key` value as our `NEXT_PUBLIC_SUPABASE_ANON_KEY` value.

Your local development is now ready ✨

You can use the `Studio URL` provided to view and edit your local supabase project if needed.

## Running the app:

Make sure you are on the dev branch then use

```bash
  npm run dev
```
## Next Steps

Once you have kindly running on your machine read the [contribution guidance](CONTRIBUTING.md)
then go to the project and assign yourself an issue or create and issue yourself. Look for ones marked as good first issues.