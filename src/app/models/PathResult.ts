import { Place } from '@models/Place';

class PathResult {
   constructor(
       public path: Place[],
       public timeLeft: number
       ){}
}

export default PathResult;