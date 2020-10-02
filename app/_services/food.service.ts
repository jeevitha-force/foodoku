import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppSettings } from "../../app/app.settings";

import { Food } from "../_models";

@Injectable({ providedIn: "root" })
export class FoodService {
  constructor(private _http: HttpClient) {}

  donate(food: Food) {
    return this._http.post(AppSettings.API_ENDPOINT + `/foods`, food);
  }

  getFoodsByDonorId(donorId: number) {
    return this._http.get(
      AppSettings.API_ENDPOINT + `/foods/donated?userId=` + donorId
    );
  }

  getFoodsAvailableForCollection(userId: number) {
    return this._http.get(
      AppSettings.API_ENDPOINT + `/foods?userId=` + userId
    );
  }

  removeFood(foodId: number) {
    return this._http.delete(AppSettings.API_ENDPOINT + `/foods/` + foodId);
  }

  update(food: Food) {
    return this._http.put(AppSettings.API_ENDPOINT + `/foods/`, food);
  }

  ask(foodId: number, userId: number, asked: boolean) {
    return this._http.post(AppSettings.API_ENDPOINT + `/foods/` + foodId + `/ask?userId=` + userId + `&asked=` + asked, null)
  }
}
