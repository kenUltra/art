import { Component } from '@angular/core';

@Component({
  selector: '[footer-stack]',
  imports: [],
  template: `
    <footer class="footer-component">
      <div class="mask-db">
        <div class="mk-bg">
          <div class="start-pt"></div>
        </div>
      </div>
      <div class="lw-ctx">
        <div class="start-bg">
          <div class="main-footer">
            <p>
              <span>Copyright © 2025 Art Inc. All rights reserved.</span>
            </p>
          </div>
        </div>
        <div class="footer-str">
          <div class="ft-bg">
            <div class="msk"></div>
          </div>
        </div>
      </div>
      <div class="msk">
        <div class="point-ms">
          <div class="mask-footer"></div>
        </div>
      </div>
    </footer>
  `,
  styleUrl: 'footer.component.css',
})
export class FooterComponent {
  constructor() {}
}
