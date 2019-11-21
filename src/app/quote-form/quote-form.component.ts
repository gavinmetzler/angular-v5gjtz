import { Component, ViewChild, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormArray, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors  } from '@angular/forms';
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

  events = 'poi';

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
      company: ['', [Validators.required, forbiddenNameValidator(/bob/i)]],
      orderNum: '',
      reqDate: '',
      tiles: this.fb.array([])
    },{ validators: identityRevealedValidator })
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
      grain: ['noGrain'],
      thickness: [null,[Validators.required, Validators.max(40)]],
      cuts: this.fb.array([])
    })

    this.tileForms.push(tile);
    this.addCut(this.tileForms.length-1);
  }

  deleteTile(i) {
    this.tileForms.removeAt(i)
  }

 
  addCut(i) {

    const cut = this.fb.group({ 
      cutType: [],
      dim1: [],
      dim2: [],
      profileType: [],
      apronHeight: [],
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

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  }
}

export const identityRevealedValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const name = control.get('name');
  const alterEgo = control.get('orderNum');
  return name && alterEgo && name.value === alterEgo.value ? { 'identityRevealed': true } : null;
};

export const lengthWidthValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const length = control.get('length');
  const width = control.get('width');
  return length && width && length.value < width.value ? { 'widthGreaterThanLength': true } : null;
};