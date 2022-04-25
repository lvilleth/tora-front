import { Component, OnInit } from '@angular/core';
import PathResult from '@app/models/PathResult';
import { ToraService } from '@app/services/tora.service';
import Graph from 'graphology';
import Sigma from 'sigma';
import data from '../../../data.json';

@Component({
  selector: 'app-graph-viewer',
  templateUrl: './graph-viewer.component.html',
  styleUrls: ['./graph-viewer.component.less']
})
export class GraphViewerComponent implements OnInit {

  graph: Graph = new Graph();
  result:PathResult;
  private resultOn:boolean = false;


  constructor(private toraService:ToraService) { }
 

  ngOnInit(): void {
    this.graph.import(data);
    
    this.startPos();
    this.loadGraph();
    this.result = this.toraService.route({M:120});
    this.onToggleResult();
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
    this.randomWeights();
    
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

  onToggleResult() {
    this.resultOn = !this.resultOn;
    let color = 'dodgerblue';
    if(this.resultOn)
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
