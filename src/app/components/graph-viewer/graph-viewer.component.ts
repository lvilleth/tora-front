import { Component, OnInit } from '@angular/core';
import PathResult from '@app/models/PathResult';
import { ToraService } from '@app/services/tora.service';
import Graph from 'graphology';
import Sigma from 'sigma';
import data from '../../../data.json';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-graph-viewer',
  templateUrl: './graph-viewer.component.html',
  styleUrls: ['./graph-viewer.component.less']
})
export class GraphViewerComponent implements OnInit {

  graph: Graph = new Graph();
  result:PathResult;
  useRandomWeights:boolean;
  removeInactive:boolean;

  constructor(private toraService:ToraService) { }
 

  ngOnInit(): void {
    this.handleData();
    this.startPos();
    this.loadGraph();
  }

  handleData() {
    this.graph.import(data);
    this.useRandomWeights = environment.routes.randomWeights;
    this.removeInactive = environment.routes.removeInactive;

    if(this.removeInactive){
      const inactives = data.nodes.filter(x => !x.attributes.active)
      inactives.forEach(n => this.graph.dropNode(n.key));
    }
  }

  calculateRoute(input:{time:number, showResult:boolean, categories:string[]}) {
    if(this.result?.path?.length > 0){
      this.onToggleResult(false);
    }
    this.result = this.toraService.route({M:input.time, cat:input.categories});
    this.onToggleResult(input.showResult);
  }

  loadGraph(){
    let container = document.getElementById('container') as HTMLElement

    let sigma = new Sigma(this.graph, container, {renderEdgeLabels: true, edgeLabelWeight:'bold', edgeLabelSize:26});
    console.log(sigma.getSettings());

    this.toraService.dataFromGraph(this.graph);
  }

  startPos(){
    let startKey = 'start';
    this.graph.addNode(startKey, { x:35, y:100, label:'INÍCIO', size:20, color:'blue', location: "-7.111950738797477, -34.82293337747703" });
    this.graph.forEachNode((node, attr) => {
      if(node === startKey) return;
      let value = Math.ceil(Math.random() * 35);
      this.graph.addEdge(startKey, node, { value:value, label:''+value });
    });
    if(this.useRandomWeights) this.randomWeights();
  }

  randomWeights(){
    let nodes = this.graph.nodes();
    for (const key of nodes) {
      this.graph.forEachNode((node, attr) => {
        if(key === node) 
          return
        if(this.graph.hasEdge(key, node))
          return
        if(this.graph.hasEdge(node, key))
          return
        let value = Math.ceil(Math.random() * 35);
        this.graph.addEdge(key, node, { value:value, label:''+value });
      });
    }
    /**
     * Where 'n' is number of nodes
     * Amount of edges => (n*(n-1))/2 
     */
  }

  onToggleResult(show:boolean) {
    let color = 'dodgerblue';
    if(show)
      this.paintGraphResult(this.result, color, color, 4);
    else
      this.paintGraphResult(this.result, undefined, '#B30000')
  }

  paintGraphResult(result:PathResult, edgeColor?:string, nodeColor?:string, edgeSize?:number) {
    let source, target;
    let maxIndex = result.path.length - 1;
    let edge;
    for (let i = 0; i < maxIndex; i++) {
      source = result.path[i];
      target = result.path[i+1]

      if(!this.graph.hasEdge(source.id, target.id)){
        let temp = target;
        target = source;
        source = temp;
      }

      edge = this.graph.edge(source.id, target.id)
      this.graph.updateEdgeAttributes(edge, att => { return {...att, color: edgeColor, size: edgeSize} });
      if(source.id != 'start'){
        this.graph.updateNodeAttributes(source.id, att => { return {...att, color: nodeColor} });  
      }
      this.graph.updateNodeAttributes(target.id, att => { return {...att, color: nodeColor} });
    }
  }




}
