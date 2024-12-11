<div align="center">

# Query Tool

![GitHub branch check runs](https://img.shields.io/github/check-runs/neurobagel/query-tool/main?style=flat-square)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/neurobagel/query-tool/e2e-test.yaml?branch=main&style=flat-square&label=e2e%20tests&link=https%3A%2F%2Fgithub.com%2Fneurobagel%2Fquery-tool%2Factions%2Fworkflows%2Fe2e-test.yaml)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/neurobagel/query-tool/component-test.yaml?branch=main&style=flat-square&label=component%20tests&link=https%3A%2F%2Fgithub.com%2Fneurobagel%2Fquery-tool%2Factions%2Fworkflows%2Fcomponent-test.yaml)
![Static Badge](https://img.shields.io/badge/node-20.9-red?style=flat-square&logo=nodedotjs&color=CD5C5C)
![GitHub License](https://img.shields.io/github/license/neurobagel/query-tool?style=flat-square&color=purple&link=LICENSE)
![Docker Image Version (tag)](https://img.shields.io/docker/v/neurobagel/query_tool/latest?style=flat-square&logo=docker&link=https%3A%2F%2Fhub.docker.com%2Fr%2Fneurobagel%2Fquery_tool%2Ftags)
![Docker Pulls](https://img.shields.io/docker/pulls/neurobagel/query_tool?style=flat-square&logo=docker&link=https%3A%2F%2Fhub.docker.com%2Fr%2Fneurobagel%2Fquery_tool%2Ftags)

![Website](https://img.shields.io/website?url=https%3A%2F%2Fneurobagel-query.netlify.app&up_message=live&up_color=B0C4DE&down_message=down&down_color=CD5C5C&style=flat-square&label=staging%20app&link=https%3A%2F%2Fneurobagel-query.netlify.app)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fquery.neurobagel.org&up_message=live&up_color=B0C4DE&down_message=down&down_color=CD5C5C&style=flat-square&label=deployed%20app&link=https%3A%2F%2Fquery.neurobagel.org)

The query tool is a React application, developed in [TypeScript](https://www.typescriptlang.org/) using a variety of tools including [Vite](https://vitejs.dev/), [Cypress](https://www.cypress.io/), and [MUI](https://mui.com/).

[Quickstart](#quickstart) |
[Local Installation](#local-installation) |
[Usage](#usage) |
[Testing](#testing) |
[License](#license)

</div>

Please refer to our [**official documentation**](https://neurobagel.org/user_guide/query_tool/) for more detailed information on how to use the query tool.

## Quickstart

The query tool is hosted at https://query.neurobagel.org/ and interfaces with [Neurobagel federation API](https://federate.neurobagel.org/docs).

## Local Installation

To run the query tool locally, you have two options:

1. Use our docker image
2. Do a manual install from the cloned git repo.

but before proceeding with either you need to set the environment variables.

### Mandatory configuration

| Environment variable     | Type    | Required                                 | Default value if not set | Example                                                   |
| ------------------------ | ------- | ---------------------------------------- | ------------------------ | --------------------------------------------------------- |
| `NB_API_QUERY_URL`       | string  | Yes                                      | -                        | `https://federate.neurobagel.org/`                        |
| `NB_QUERY_APP_BASE_PATH` | string  | No                                       | `/`                      | `/query/`                                                 |
| `NB_ENABLE_AUTH`         | boolean | No                                       | `false`                  | `false`                                                   |
| `NB_QUERY_CLIENT_ID`     | string  | Yes (if `NB_ENABLE_AUTH` is set to true) | -                        | `46923719231972-dhsahgasl3123.apps.googleusercontent.com` |

#### `NB_API_QUERY_URL`

You'll need to set the `NB_API_QUERY_URL` environment variable required to run the query tool. `NB_API_QUERY_URL` is the [Neurobagel API](https://github.com/neurobagel/api) URL that the query tool uses to send requests to for results.

#### `NB_QUERY_APP_BASE_PATH`

If you are using a custom configuration where the query tool is accessible via a path other than the root (`/`), you need to set the `NB_QUERY_APP_BASE_PATH` to your custom path. This ensures that the query tool is correctly rendered and accessible at the specified URL

#### `NB_ENABLE_AUTH`

If the API you'd like to send queries to requires authentication, you need to set `NB_ENABLE_AUTH` to `true` as it is `false` by default. This will enable authentication flow of the app.

#### `NB_QUERY_CLIENT_ID`

If the `NB_ENABLE_AUTH` is set to `true` (it is `false` by default), you need to provide a valid client ID for the authentication.
_At the moment, query tool uses Google for authentication, so you need to obtain a client ID from Google developer console. See [documentation](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid) for more information._

#### Set the environment variables

To set environment variables, create a `.env` file in the root directory and add the environment variables there. If you're running a neurobagel node-API locally on your machine (following the instructions [here](https://github.com/neurobagel/api#local-installation)), your `.env` file would look something like this:

```bash
NB_API_QUERY_URL=http://localhost:8000/
```

if you're using the remote api, your `.env` file would look something like this:

```bash
NB_API_QUERY_URL=https://federate.neurobagel.org/
```

if you're using a remote api with authentication, your `.env` file would look something like this:

```bash
NB_API_QUERY_URL=https://federate.neurobagel.org/
NB_ENABLE_AUTH=true
NB_QUERY_CLIENT_ID=46923719231972-dhsahgasl3123.apps.googleusercontent.com
```

:warning: The protocol matters here.
If you wish to use the Neurobagel remote API, ensure your `NB_API_QUERY_URL` uses `https` instead of `http`.

### Docker installation

To obtain the query tool docker image, simply run the following command in your terminal:

```bash
docker pull neurobagel/query_tool:latest
```

This Docker image includes the latest release of the query tool and a minimal http server to serve the static tool.

To launch the query tool Docker container and pass in the `.env` file you have created, simply run

```bash
docker run -p 5173:5173 --env-file=.env neurobagel/query_tool:latest
```

Then you can access the query tool at http://localhost:5173

**Note**: the query tool is listening on port `5173` inside the docker container,
replace port `5173` by the port you would like to expose to the host.
For example if you'd like to run the tool on port `8000` of your machine you can run the following command:

```bash
docker run -p 8000:5173 --env-file=.env neurobagel/query_tool:latest
```

### Manual installation

To install the query tool directly, you'll need [node package manager (npm)](https://www.npmjs.com/) and [Node.js](https://nodejs.org/en/).
You can find the instructions on installing npm and node in the official [documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Once you have npm and node installed, you'll need to install the dependencies outlined in the package.json file.
You can do so by running the following command:

```bash
npm install
```

To launch the tool in developer mode run the following command:

```bash
npm run dev
```

You can also build and then run the tool from ([production](https://vitejs.dev/guide/build)) build of the application by running the following command:

```bash
npm run build && npm run preview
```

You can verify the tool is running by watching for the` info messages from Vite regarding environment, rendering, and what port the tool is running on in your terminal.

#### Developer setup

Having installed the dependencies, run the following command to enable husky `pre-commit` and `post-merge` hooks:

```bash
npx husky install
```

##### Docker compose testing environment for development

Since the query tool relies on other neurobagel tools to function, their presence is often required during development. To facilitate this, a docker compose containing a complete testing environment has been created. To use it follow the steps below:

1. Install `recipes` and `neurobagel_examples` submodules:

```bash
git submodule init
git submodule update
```

2. Pull the latest images and bring up the stack using the `test` profile:

```bash
docker compose --profile test pull && docker compose --profile test up -d
```

_NOTE: Make sure your .env file in the root directory doesn't contain any of the environment variables used in the docker compose file as it will conflict with the configuration, since docker compose will try to use .env by default._

## Usage

To define a cohort, set your inclusion criteria using the following:

- Age: Minimum and/or maximum age (in years) of participant that should be included in the results.
- Sex: Sex of participant that should be included in the results.
- Diagnosis: Diagnosis of participant that should be included in the results
- Healthy control: Whether healthy participants should be included in the results. Once healthy control checkbox is selected, diagnosis field will be disabled since a participant cannot be both a healthy control and have a diagnosis.
- Minimum number of imaging sessions: Minimum number of imaging sessions that participant should have to be included in the results.
- Minimum number of phenotypic sessions: Minimum number of phenotypic sessions that participant should have to be included in the results.
- Assessment tool: Non-imaging assessment completed by participant that should be included in the results.
- Imaging modality: Imaging modality of participant scans that should be included in the results.
- Pipeline name: Name of the pipeline used to process subject scans.
- Pipeline version: Version of the pipeline used to process subject scans.

Once you've defined your criteria, submit them as a query and the query tool will display the results.\
The query tool offers two different TSV files for results:

- cohort participant results TSV contains: dataset name, portal uri, number of matching subjects, subject id, session id, session file path, session type, age, sex, diagnosis, assessment, number of matching phenotypic sessions, number of matching imaging sessions, session imaging modality, session completed pipelines, dataset imaging modality, and dataset pipelines

- cohort participant machine results TSV contains: dataset name, dataset portal uri, subject id, session id, session file path, session type, number of matching phenotypic sessions, number of matching imaging sessions, session imaging modality, session completed pipelines, dataset imaging modality, and dataset pipeline

You can refer to [the neurobagel documentation](https://neurobagel.org/user_guide/query_tool/#downloading-query-results) to see what the outputs of the query tool look like and how they are structured. You can also download the raw example output files [here](https://github.com/neurobagel/neurobagel_examples/tree/main/query-tool-results).

## Testing

The query tool utilizes [Cypress](https://www.cypress.io/) framework for testing.

To run the tests execute the following command:

```bash
npx cypress open
```

## License

The query tool is released under the terms of the [MIT License](LICENSE)
