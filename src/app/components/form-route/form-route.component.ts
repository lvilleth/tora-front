import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-route',
  templateUrl: './form-route.component.html',
  styleUrls: ['./form-route.component.less']
})
export class FormRouteComponent implements OnInit {

  form:FormGroup = this.fb.group({
    time: ['120', [Validators.min(10), Validators.required]],
    showResult: [true],
  });

  @Output() formSubmit = new EventEmitter<{time:number, showResult:boolean}>();
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

}
