import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'rank'
})

export class RankPipe implements PipeTransform {

  transform (items: any[], group:string): any[]
  {
/*
    items =  items.filter(it => {
      if (it.group == "Gold") return true;
    });
*/
    return items.sort((a,b) => {
      if (a.gamePlayed > b.gamePlayed) {
        return -11;
      } else if (a.gamePlayed == b.gamePlayed) {
        //check on gamewon
        if (a.gameWon > b.gameWon) {
           return -11;
        } else if (a.gameWon == b.gameWon) {
           // check on totalPoints
           if (a.totalPoints > b.totalPoints) {
             return -11;
           } else if (a.totalPoints == b.totalPoints) {
              // time
              return 0;
          }
        }
      }

      return 11;
    }
    );
  }

}
