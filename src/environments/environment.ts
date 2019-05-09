// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

    production: false,


    region: 'us-east-1',

    identityPoolId: 'us-east-1:b9479c45-530a-4cd2-b3ef-b2f583b4ef87',
    userPoolId: 'us-east-1_ByrjN2T0t',
    clientId: '6s2vkodb0haba30h8rskpe4452',

    rekognitionBucket: 'rekognition-pics',
    albumName: "usercontent",
    bucketRegion: 'us-east-2',

    ddbTableName: 'LoginTrailPortal',

    vbcTableName: 'CyburiPlayers',

    playerUrl: 'http://localhost:3333/player'

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
