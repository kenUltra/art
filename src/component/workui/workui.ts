import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-workui',
  imports: [],
  templateUrl: './workui.html',
  styleUrl: './workui.css',
})
export class Workui {
  constructor(private mainTitle: Title) {
    this.mainTitle.setTitle('Add you employee status | Art inc');
  }
}
