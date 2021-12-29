import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  page = 0;
  resultsCount = 100; // max count from API is 5000
  totalPages = 10;

  data = [];
  bulkEdit = false;
  edit = {};

  sortDirection = 0;
  sortKey = null;

  constructor(private http: HttpClient) {
    this.loadData();
  }

  // get data from API
  loadData() {
    this.http
      .get(
        `https://randomuser.me/api/?page =${this.page}&results=${this.resultsCount}`
      )
      .subscribe((res) => {
        this.data = res["results"];
        this.sort();
      });
  }

  sortBy(key: string) {
    this.sortKey = key;
    this.sortDirection++;
    this.sort();
  }

  // sort column alphabetically top-bottom or bottom-top
  // localeCompare takes account of upper/lower case, accented letters etc.
  sort() {
    if (this.sortDirection == 1) {
      this.data = this.data.sort((a, b) => {
        const valA = a[this.sortKey];
        const valB = b[this.sortKey];
        return valA.localeCompare(valB);
      });
    } else if (this.sortDirection == 2) {
      this.data = this.data.sort((a, b) => {
        const valA = a[this.sortKey];
        const valB = b[this.sortKey];
        return valB.localeCompare(valA);
      });
    } else {
      this.sortDirection = 0;
      this.sortKey = null;
    }
  }

  toggleBulkEdit() {
    this.bulkEdit = !this.bulkEdit;
    this.edit = {};
  }

  // take items checked - this.edit - and filter indexes and coerce into a number
  // remove rows with this index using the splice method
  bulkDelete() {
    console.log("this.edit: ", this.edit); // example: returns {0: true, 1: true, 2: true}
    const preDelete = Object.keys(this.edit);
    console.log("preDelete", preDelete); // example returns ["0", "1", "2"] - array of strings
    const deleteList = preDelete
      .filter((index) => this.edit[index])
      .map((key) => +key); // [0, 1, 2]
    while (deleteList.length) {
      // as long as deleteList is > 0
      this.data.splice(deleteList.pop(), 1); // splice each row[item], pop deleteList down each time
    }
    this.toggleBulkEdit(); // remove bulkedit ion-button once complete
  }

  // delete row using row index in splice operation
  removeRow(index) {
    this.data.splice(index, 1);
  }

  nextPage() {
    this.page++;
    this.loadData();
  }

  prevPage() {
    this.page--;
    this.loadData();
  }

  goFirst() {
    this.page = 0;
    this.loadData();
  }

  goLast() {
    this.page = this.totalPages - 1;
    this.loadData();
  }
}
