# Portal (for a volleyball club)
This project is being refractored to use utilize AngularJS as front end (tier 1), Node Express as backend to expose RESTFUL API (tier 2), and DynamoDB as noSQL datastore. 

## Targeted production env using AWS stack(s)
backend:
*DynamoDB
*Lambda fucntions (using Node.js 8.10)
frontend:
*AngularJS 6

## Development server(s)
DynamoDB Local:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html

Lambda Local - npm
https://www.npmjs.com/package/lambda-local

Frontend - AngularJS6
Tier 1) Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.




## Prebuild - create tabeles and populate dataset
More instruction TBD


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help
TBD
