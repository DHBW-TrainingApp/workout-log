import { Component } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { TodolistSettingComponent } from './../log/todolist-setting/todolist-setting.component';
import { PopoverController } from '@ionic/angular';
import { element } from 'protractor';

export class TODO {
  $key?: string;
  title?: string;
  description?: string;
  author?: string;
  roles?: {};
  date?: string;
  type?: string;
  protein?: string;
  energy?: string;
}
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  Tasks: TODO[];
  constructor(
    private crudService: CrudService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.crudService.getTasks().subscribe((res) => {
      this.Tasks = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...(t.payload.doc.data() as TODO),
        };
      });

      this.Tasks.sort(function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      this.calculateDateSums();
    });
  }

  async settingsPopover(ev: any) {
    const siteInfo = { id: 1, name: 'edupala' };
    const popover = await this.popoverController.create({
      component: TodolistSettingComponent,
      event: ev,
      cssClass: 'popover_setting',
      componentProps: {
        site: siteInfo,
      },
      translucent: true,
    });

    popover.onDidDismiss().then((result) => {
      console.log(result.data);
    });

    return await popover.present();
    /** Sync event from popover component */
  }

  todoList() {
    this.crudService.getTasks().subscribe((data) => {});
  }

  remove(id) {
    if (window.confirm('Are you sure?')) {
      this.crudService.delete(id);
    }
  }

  calculateDateSums() {
    let days = [];
    let date = new Date(this.Tasks[0].date).toDateString();
    let protein = 0;
    let kcal = 0;
    for (let i = 0; i < this.Tasks.length; i++) {
      let element = this.Tasks[i];
      if (element.type === 'meal') {
        if (new Date(element.date).toDateString() == date) {
          if (!isNaN(Number(element.protein))) {
            protein += Number(element.protein);
          }

          if (!isNaN(Number(element.energy))) {
            kcal += Number(element.energy);
          }
        } else {
          days.push({
            type: 'date',
            index: i + days.length,
            energy: kcal.toString(),
            protein: protein.toString(),
          });
          if (!isNaN(Number(element.protein))) {
            protein = Number(element.protein);
          } else {
            protein = 0;
          }

          if (!isNaN(Number(element.energy))) {
            kcal = Number(element.energy);
          } else {
            kcal = 0;
          }
          date = new Date(element.date).toDateString();
        }
      }
    }

    days.forEach((element) => {
      this.Tasks.splice(element.index, 0, element);
    });
    console.log(this.Tasks);
  }
}
