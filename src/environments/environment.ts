// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

    production: false,


    region: 'us-east-2',

    identityPoolId: 'us-east-2:898eb244-070d-4111-9b94-6aaf0ec4f761',
    userPoolId: 'us-east-2_yIstCoKlH',
    clientId: '66a84rgkfsbsc4pv8ifcvohgpk',

    rekognitionBucket: 'rekognition-pics',
    albumName: "usercontent",
    bucketRegion: 'us-east-2',

    ddbTableName: 'LoginTrailcyburivbc',

    vbcTableName: 'CyburiPlayers',

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
