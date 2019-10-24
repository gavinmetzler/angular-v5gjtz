import { Component, ViewChild, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormArray, Validators, FormControl  } from '@angular/forms';
import {MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-quote-form',
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.css'],
})

export class QuoteFormComponent implements OnInit {

  myForm: FormGroup;

    // Form state
  loading = false;
  success = false;

  events = '';

  thongyChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events = 'gesuntheight';
  }

  thingyChanged(type: string, event: string) {
    this.events = event;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.fb.group ({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      company: '',
      orderNum: '',
      reqDate: '',
      tiles: this.fb.array([])
    })
    this.addTile();
  }

  get tileForms() {
    return this.myForm.get('tiles') as FormArray
  }

  addTile() {

    const tile = this.fb.group({ 
      quantity: [],
      material: [],
      length: [],
      width: [],
      thickness: [],
      cuts: this.fb.array([])
      // TODO: grain
    })

    this.tileForms.push(tile);
  }

  deleteTile(i) {
    this.tileForms.removeAt(i)
  }

 
  addCut(i) {

    const cut = this.fb.group({ 
      cutType: [],
      dim1: [],
      dim2: []
      // TODO: flesh out cut data
    });

    (<FormArray>(<FormArray>this.myForm.controls['tiles']).at(i).get('cuts')).push(cut);
  }

  deleteCut(i, j) {
    (<FormArray>(<FormArray>this.myForm.controls['tiles']).at(i).get('cuts')).removeAt(j)
  }

  async submitHandler() {
    this.loading = true;

    const formValue = this.myForm.value;

    try {
      //TODO: Send form data 
      this.success = true;
    } catch(err) {
      console.error(err)
    }

    this.loading = false;
  }

  get name() {
    return this.myForm.get('name');
  }
  get email() {
    return this.myForm.get('email');
  }
}