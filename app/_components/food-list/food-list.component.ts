import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"

import { Food } from "../../_models/food"
import { User } from "../../_models/User"
import {
  AlertService,
  UserService,
  AuthenticationService,
  FoodService
} from "../../_services"

@Component({
  selector: "app-food-list",
  templateUrl: "./food-list.component.html"
})
export class FoodListComponent implements OnInit {
  selectedFood: Food
  foodEdit: boolean = false
  showDonatedFoods: boolean = true
  showAllFoods: boolean = true
  donatedFoods: Food[] = []
  allFoods: Food[] = []
  selectedUser: User
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private foodService: FoodService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate([""])
    }
  }

  ngOnInit() {
    this.alertService.clear()
    this.getFoods()
  }

  getFoods() {
    let loggedUserId = this.authenticationService.currentUserValue.id
    this.foodService.getFoodsByDonorId(loggedUserId).subscribe(data => {
      this.donatedFoods = data.foods
    })

    this.foodService.getFoodsAvailableForCollection(loggedUserId).subscribe(data => {
      this.allFoods = data.foods
    })
  }

  editFood(food) {
    this.alertService.clear()
    this.showDonatedFoods = false
    this.showAllFoods = false
    this.selectedFood = food
    this.foodEdit = true
  }

  viewFood(food) {
    this.alertService.clear()
    this.showDonatedFoods = false
    this.showAllFoods = false
    this.selectedFood = food
    this.foodEdit = false
  }

  removeFood(food) {
    this.alertService.clear()
    this.foodService.removeFood(food.id).subscribe(
      () => {
        this.getFoods()
        this.alertService.success("Food marked as collected and removed successfully", true)
      },
      error => {
        this.alertService.error(error)
      }
    )
  }

  notClaimed(food){
    this.alertService.clear()
    this.foodService
      .ask(food.id, "", false)
      .subscribe(
        data => {
          this.alertService.success("Food is now available for others", true);
          this.getFoods()
        },
        error => {
          this.alertService.error(error);
        }
      );
  }

  hideFood(backButtonClicked) {
    this.getFoods()
    this.selectedFood = null
    this.showDonatedFoods = backButtonClicked
    this.showAllFoods = backButtonClicked
  }
}
