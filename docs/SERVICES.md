# Services

The `app/services` directory will always be used server-side. This is where you handle setting up
functions, queries and mutations that will be used in multiple places within the app.

The folder structure will usually go as follows:

```
app
├── ...
├── services
│   ├── [name_of_service]
│   │   ├── functions.test.ts
│   │   ├── functions.ts
│   │   ├── index.ts
│   │   ├── queries.ts
│   │   ├── types.ts
│   │   ├── validation.ts
```

This structure ensures that we follow a consistent approach with developing these services and
an easy to understand structure for accessing data/functions/types/etc.

## `index.ts`

This file should not be used for any code. This is just a file to re-export things from the
rest of the files in the service directory.

Example:

```ts
export * from './functions';
export * from './queries';
export * from './types';
```

## `functions.ts`

The `functions.ts` file is used to write any kind of function, whether it's a formatting
function to ensure the data follows a certain format or schema, or just a simple
checking function that can be used in multiple places throughout the app.

Ideally with this file, we want to add unit tests for all of the exported functions.

## `validation.ts`

Anything to do with validation, e.g. zod schemas, related to the service should be placed
here.

A good example of a validation file can be found in `app/services/app/validation.ts` where
all of the environment variables are parsed.

## `queries.ts`

Anything to do with retrieving data from the database that needs to be in a specific format
goes here. This is useful if you need to retrieve a model from the database with relations
in multiple places within the app. A good example of this use case would be retrieving
a user with all of their linked integrations.

These exported functions should not be manipulating data at all. It should be purely
retrieving data from the database only.

## `mutations.ts`

This is very similar to the `queries.ts` file above, but in this file, anything to do with
manipulating the database (e.g. inserting, updating and/or deleting data) should be
handled within this file.

## `types.ts`

This file should only contain types/interfaces that are used with typescript. This can and
will go hand in hand with any formatting functions.
