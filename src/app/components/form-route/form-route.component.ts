import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-route',
  templateUrl: './form-route.component.html',
  styleUrls: ['./form-route.component.less']
})
export class FormRouteComponent implements OnInit {

  items:string[] = ['Museus', 'Parques']
  defaultSelected = this.items;
  lastSelectedValue = this.defaultSelected;

  form:FormGroup = this.fb.group({
    time: ['120', [Validators.min(10), Validators.required]],
    showResult: [true],
    categories: [[...this.defaultSelected]]
  });

  @Output() formSubmit = new EventEmitter<{time:number, showResult:boolean, categories:string[]}>();
  @Output() toggleRoute = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }

  onToggleRoute(){
    this.toggleRoute.emit(this.form.value?.showResult)
  }

  onSelectChange(values:[]){
    if(values.length == 0) {
      this.form.controls.categories.patchValue([...this.lastSelectedValue]);
    } else {
      this.lastSelectedValue = values;
    }
  }

}
