import { Component, ViewChild, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormArray, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors  } from '@angular/forms';
import {MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';
import { PostService } from './services/post.service';
import { ActivatedRoute } from '@angular/router';

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
  profilechosen = false;
  queryparams = 'empty';

  events = 'poi';
  
  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0;
  }
  minDate = new Date();

  serviceChanged(type: string) {
    this.events = type;
    //TODO: Check if user has previously added a bunch of cuts, and now just changed service type to Profile, in which case all cuts except first need to be deleted.
    // or maybe we can just hide everything except the first one in the html - that might be better.
    // actually, no - user still might want to profile different edges of different tiles, especially corners which will have 2 edges profiled.

    //This event isn't really needed anymore - keep as a template for now.
  }

  profileChosen(type: boolean) {
    this.profilechosen = type;
  }

  tileSizeChanged(i, which: string)
  {
     if ((which=="width" && (<FormArray>this.myForm.controls['tiles']).at(i).get("length").touched) || (which=="length" && (<FormArray>this.myForm.controls['tiles']).at(i).get("width").touched) )
    {
      let widdy = 200;
      let lenny = 200;
      widdy = (<FormArray>this.myForm.controls['tiles']).at(i).get("width").value;
      lenny = (<FormArray>this.myForm.controls['tiles']).at(i).get("length").value;

      let dispheight = 180;
      let dispwidth = 180;
      let miniwidth = 100;
      if (lenny>widdy) { dispwidth = 110; miniwidth = 70; }
      if (lenny<widdy) { dispheight = 110; miniwidth = 150; }

      (<FormArray>this.myForm.controls['tiles']).at(i).get("dispheight").setValue(dispheight); 
      (<FormArray>this.myForm.controls['tiles']).at(i).get("dispwidth").setValue(dispwidth); 
      (<FormArray>this.myForm.controls['tiles']).at(i).get("miniwidth").setValue(miniwidth); 
    }
  }

  tileCutChanged(i, j, which: string)
  {
    if ((which=="dim1" && (<FormArray>(<FormArray>this.myForm.controls['tiles']).at(i).get('cuts')).at(j).get("dim2").touched) || (which=="dim2" && (<FormArray>(<FormArray>this.myForm.controls['tiles']).at(i).get('cuts')).at(j).get("dim1").touched) )
    {
      let widdy = 100;
      let lenny = 100;
      widdy = (<FormArray>(<FormArray>this.myForm.controls['tiles']).at(i).get('cuts')).at(j).get("dim1").value;
      lenny = (<FormArray>(<FormArray>this.myForm.controls['tiles']).at(i).get('cuts')).at(j).get("dim2").value;

      let dispheight = 70;
      let dispwidth = 100;
      if (lenny>widdy) { dispwidth = 150; }
      if (lenny<widdy) { dispwidth = 70;}

      (<FormArray>(<FormArray>this.myForm.controls['tiles']).at(i).get('cuts')).at(j).get("dispheight").setValue(dispheight); 
      (<FormArray>(<FormArray>this.myForm.controls['tiles']).at(i).get('cuts')).at(j).get("dispwidth").setValue(dispwidth); 
    }
    //if service is profile only, get the aspect ratio from the parent tile, and adjust the form when the quantity 
  }

  constructor(private fb: FormBuilder, private service:PostService, private activatedRoute: ActivatedRoute) { 
   /* this.activatedRoute.queryParamMap.subscribe(params => {
        let paramitirs = params;
        console.log('parameters found are:');
        console.log(paramitirs); // Print the parameter to the console. 
        console.log('end of parameters found');
    }); */

}

  ngOnInit() {
    this.myForm = this.fb.group ({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: ['', [Validators.required, forbiddenNameValidator(/bob/i)]],
      orderNum: '',
      reqDate: '',
      tiles: this.fb.array([])
    },{ validators: identityRevealedValidator })
    this.addTile();
    console.log ('ngOnInit run.');

    //form data can be pre-populated from a UUencoded JSON object, submitted in a query string /?orderdata=UUASDF2A...   
    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      //this is going to run twice if there are query parameters. The first time there should be no Params, and they will be there on the second time.
       if (queryParams.get("orderdata")) {
         this.queryparams = queryParams.get("orderdata");
         //UU decode, then JSON 
         let decodedparams=atob(this.queryparams);
         console.log (decodedparams);
         let receivedformdata=JSON.parse (decodedparams);
         console.log (receivedformdata);
         //Populate the array
         //First we have to find out how many tiles there are, and how many cuts in each tile.
         //We've already created 1 Tile with 1 Cut, so we need to addTile()
         let tilecount = 0;
         for (let loadtile of receivedformdata['tiles'])
         {
           console.log ('found a tile.');
           console.log (tilecount);
            //add the Tile (if not the initial one we already have)
            if (tilecount>0) {this.addTile();}

           let cutcount=0;
           for (let loadcut of loadtile['cuts'])
           {
             console.log ('found a cut!');
             console.log (cutcount);
             //add the cut (if not the first cut)
             if (cutcount!=0) { this.addCut(tilecount); }
             cutcount++;
           }
           tilecount++;
         }
          this.myForm.setValue(receivedformdata);
          this.profilechosen=true;
          //TODO: Encoding nested arrays worked fine, but decoding doesnt.
         }
       console.log (this.queryparams);
    });

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
      dispwidth: [180],
      dispheight: [180],
      miniwidth: [100],
      grain: ['noGrain'],
      thickness: [null,[Validators.required, Validators.max(40)]],
      service: [],
      profileType: [],
      apronHeight: [],
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
      quantity: [],
      dim1: [],
      dim2: [],
      dispwidth: [100],
      dispheight: [70],
      edge1: [],
      edge2: [],
      edge3: [],
      edge4: [],
      grain: []
    });
//
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
      let post = 'submission='.concat(btoa(JSON.stringify(formValue)));
      this.service.create (post)
        .subscribe( response => console.log ('Success!', response),
                    error => console.error ('Error! Gaverror', error));
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
//This was copy-pasted from somewhere, just keeping it as a template
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