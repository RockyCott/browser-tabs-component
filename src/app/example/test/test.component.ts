import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule],
})
export class TestComponent {
  /**
   * Titulo de la pestaña
   * Solo se usa como ejemplo para mostrar como se puede pasar información
   * de un componente padre a un componente hijo a través de un input
   */
  @Input()
  get testTitle(): string {
    return this._testTitle;
  }
  set testTitle(value: string) {
    this._testTitle = value;
    this.testTitleChange.emit(value);
  }
  
  @Output() testTitleChange = new EventEmitter<string>();
  
  private _testTitle: string = '';
  /**
   * se puede utilizar como identificador intermediario
   * entre el componente tab y el componente padre que contiene a ambos
   * esto con el fin de por ejemplo si se quiere cerrar una tab, pero primero validar
   * si se puede cerrar o no con alguna funcion dentro de este componente
   * entonces se puede utilizar este campo para identificar la tab que se quiere cerrar
   * y llamar al componente con el mismo code para que este realice la validacion
   */
  @Input()
  componentCode: string;
}
