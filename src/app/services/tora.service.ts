import { Injectable } from '@angular/core';
import { Place, Geo } from '@models/Place';
import Graph from 'graphology';
import PathResult from '@models/PathResult';

/* 
f(n) = g(n) + h(n)

nó pertence conjunto La (locais abertos)
nó = Tl(Tempo no local) + Tr(Tempo da rota)

destino = nó => Tl = 0

M = 120m

h(n) = Tr(n, destino)
ou
h(n) = 0

G(n) = M - Somatorio Tr(i, i+1) + Somatorio Tl(i,i+1) 
*/

const START = 'start';

@Injectable({
  providedIn: 'root'
})
export class ToraService {

  places:Map<string, Place> = new Map();
  graph:Graph;  

  constructor() { }

  public route({M, cat}:{ M:number, cat:string[] }): PathResult {
    let start = this.graph.getNodeAttributes(START);
    const startLatLong = start.location?.split(' ');
    let startPlace = new Place(START, START, true, 0, new Geo(startLatLong[0], startLatLong[1]), START);

    let nextPath = [startPlace];
    let next;
    let limit = M;
    let routeSize = 1;
    let n = 2;
    while (n != -1 && n < 30){
      console.log('\n-------------------------\nnextPath', [...nextPath.map(v=> v.name)]);
      next = this.nextPath(nextPath, M, cat);
      
      if(limit <= next.maxF || next.maxF < 0){ // no improvement can be made
        n = -1;
        continue;
      } else {
        limit = next.maxF;
        nextPath.push(next.maxChoice!);
        routeSize = next.path.length;
        nextPath = next.path;

        console.log('n = ', n, {path: [...next.path], limit:next.maxF, choice:next.maxChoice?.name})
        n++;
      }
      
    }

    let answer = {
      path: [...nextPath],
      limit: limit,
    }
    console.log('ANSWER', answer);
  
    return new PathResult(answer.path, answer.limit);
  }

  private nextPath(path:Place[], limit:number, cat:string[] = []):{path:Place[], maxF:number, minF:number, maxChoice?:Place, minChoice?:Place} {
    let next: Place | undefined;
    let f;
    let maxF = Number.NEGATIVE_INFINITY;
    let minF = Number.POSITIVE_INFINITY;
    let maxChoice = undefined;
    let minChoice = undefined;
    
    let neighbors = this.graph.neighbors(path[path.length-1].id);
    let neighbor:string;
    for (let i = 0; i < neighbors.length; i++) {
      neighbor = neighbors[i];
      next = this.places.get(neighbor);
      if(!next)
        throw Error('No start of graph')
      
      // dont choose places already visited
      if(path.find(p => p.id === neighbor))
        continue

      // filter to only include nodes from allowed categories (empty ignore filter)
      if(cat.length != 0 && !cat.find(s => s == next?.category)){
        continue
      }
    
      f = this.g(next, path, limit) + this.h(next);

      if(f > maxF){
        maxChoice = next;
        maxF = f;
      }
      if(f < minF){
        minChoice = next;
        minF = f;
      }

      console.log(`f(${neighbor}) = ${f}`, next.name);
      
    }

    console.log('Max(f):', maxChoice);
    return {path, maxF, minF, maxChoice, minChoice};
  }

  private g(next:Place, path:Place[], M:number):number {
    let sum = 0;

    path.push(next);
    for (let i = 0; i < path.length - 1; i++) {
      const source = path[i];
      const target = path[i+1];
      if(this.hasEdge(source.id, target.id)){
        sum += this.timeRoute(source.id, target.id);
      } else if(this.hasEdge(target.id, source.id)){
        sum += this.timeRoute(target.id, source.id);
      }
    }
    path.pop();

    let sumVisitation = path.map(p => p.visitDuration).reduce((a, b) => a+b);
    sum += sumVisitation;

    return M - (sum + next.visitDuration)
  }

  private h(next:Place):number{
    return 0;
  }

  private timeRoute(source:string,target:string):number {
    return this.graph.getEdgeAttribute(source, target, 'value');
  }

  private timeVisitation(source:string){
    return this.places.get(source)?.visitDuration
  }

  private hasEdge(source:string,target:string):boolean {
    return this.graph.hasEdge(source, target);
  }

  dataFromGraph(graph:Graph) {
    graph.forEachNode((node,attr) => {
      let latLong = attr.location?.split(" ");
      const geo = new Geo(latLong[0], latLong[1]);
      const place = new Place(node, attr.label, attr.active, attr.duration, geo, attr.category);
      this.places.set(node, place);
    })

    this.graph = graph;
  }


}
