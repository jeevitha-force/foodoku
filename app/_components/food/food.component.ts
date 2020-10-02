import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { formatDate } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Food } from "../../_models/food";
import { User } from "../../_models/User";
import {
  AlertService,
  AuthenticationService,
  FoodService
} from "../../_services";

@Component({
  selector: "app-food",
  templateUrl: "./food.component.html"
})
export class FoodComponent implements OnInit {
  foodEditForm: FormGroup;
  submitted = false;
  loading = false;
  states: any = ["MN", " "];
  @Input() food: Food;
  @Input() foodEdit: boolean;
  @Output() backButtonClick = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private foodService: FoodService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate([""]);
    }
  }

  ngOnInit() {
    this.foodEditForm = this.formBuilder.group({
      foodName: [this.food.name, Validators.required],
      foodDescr: [this.food.description, Validators.required],
      foodExpiresBy: [
        formatDate(this.food.expiresBy, "yyyy-MM-dd", "en"),
        Validators.required
      ],
      foodStreet: [this.food.street, Validators.required],
      foodCity: [this.food.city, Validators.required],
      foodState: [this.food.state, Validators.required],
      foodZip: [this.food.zipCode, Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.foodEditForm.controls;
  }

  backButtonClicked() {
    this.backButtonClick.emit(true);
  }

  askFood() {
    this.foodService
      .ask(this.food.id, this.authenticationService.currentUserValue.id, true)
      .subscribe(
        data => {
          this.backButtonClicked();
          this.alertService.success("Food put on hold successfully", true);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  editFoodSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.foodEditForm.invalid) {
      return;
    }

    this.loading = true;
    let updatedFood = {
      id: this.food.id,
      name: this.foodEditForm.get("foodName").value,
      description: this.foodEditForm.get("foodDescr").value,
      expiresBy: this.foodEditForm.get("foodExpiresBy").value,
      street: this.foodEditForm.get("foodStreet").value,
      city: this.foodEditForm.get("foodCity").value,
      state: this.foodEditForm.get("foodState").value,
      zipCode: this.foodEditForm.get("foodZip").value,
      collected: this.foodEditForm.get("foodCollected").value
    };
    this.foodService.update(updatedFood).subscribe(
      data => {
        this.backButtonClicked();
        this.alertService.success("Food updated successfully", true);
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }
}
