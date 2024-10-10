import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  navLinks: string[] = [
    'Частным лицам',
    'Малому бизнесу',
    'ГосОборонЗаказ',
    'Кредиты',
    'Карты',
    'Вклады и счета',
    'Ипотека',
    'Премиальное обслуживание',
    'Инвестиции'
  ];
}
