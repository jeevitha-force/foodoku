import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import {
  AlertService,
  UserService,
  AuthenticationService,
  FoodService
} from "../../_services";

@Component({
  templateUrl: "donate.component.html",
  selector: "app-food-donate",
  providers: [DatePipe]
})
export class DonateComponent implements OnInit {
  donateForm: FormGroup;
  loading = false;
  submitted = false;
  states: any = ["MN"];
  today = "";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private foodService: FoodService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/donate"]);
    }
    this.today = this.datePipe.transform(new Date(), "dd-MM-yyyy");
  }

  ngOnInit() {
    this.alertService.clear();
    this.donateForm = this.formBuilder.group({
      foodName: ["", Validators.required],
      foodDescr: ["", Validators.required],
      foodExpiresBy: ["", Validators.required],
      foodStreet: ["", Validators.required],
      foodCity: ["", Validators.required],
      foodState: ["", Validators.required],
      foodZip: ["", Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.donateForm.controls;
  }

  donateSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.donateForm.invalid) {
      return;
    }

    this.loading = true;
    let food = {
      name: this.donateForm.get("foodName").value,
      description: this.donateForm.get("foodDescr").value,
      expiresBy: this.donateForm.get("foodExpiresBy").value,
      street: this.donateForm.get("foodStreet").value,
      city: this.donateForm.get("foodCity").value,
      state: this.donateForm.get("foodState").value,
      zipCode: this.donateForm.get("foodZip").value,
      donorId: this.authenticationService.currentUserValue.id
    };
    this.foodService
      .donate(food)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Food posted successfully", true);
          this.router.navigate(["/"]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
