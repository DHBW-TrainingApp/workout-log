import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.page.html',
  styleUrls: ['./challenge.page.scss'],
})
export class ChallengePage implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }
  public form = [
    { val: 'Outdoor', isChecked: false },
    { val: 'Gym', isChecked: false },
    { val: 'Body', isChecked: false }
  ];

  routeToCreate() {
    this.router.navigate(['../../tabs/challenge-create']);
  }

}
