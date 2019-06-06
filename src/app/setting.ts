// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const pools = ['Gold',
              'Silver',
              'New'
             ];

const tourneyTypes = ['Bjerring',
             'Team',
             'Other'
            ];

const eventTypes = ['Tournament 1D',
            'Tournament 2D',
            'League',
            'Other'
            ];

const sites = ['2018Summer',
              '2018Fall',
              '2019Fall',
              '2019Winter',
              '2019Spring',
              '2019Summer',
              '2020Fall',
              '2020Winter',
              '2020Spring',
              '2020Summer',
            ];

export const setting = {
    pool1TeamSize: 2,
    pool2TeamSize: 3,
    teamSize: 4,
    pools: pools,
    sites: sites,
    eventTypes: eventTypes,
    tourneyTypes: tourneyTypes,

};

var userParams;

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
