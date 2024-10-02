import { Component, signal } from '@angular/core';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'Hola!';

  tasks = signal([
    'Instalar el Angular CLI',
    'Crear proyecto',
    'Crear componentes',
    'Crear servicio',
  ]);
  name = signal('Nicolas'); // Aplicando reactividad con signal
  age = 18;
  disablebButton = true
  img = 'https://w3schools.com/howto/img_avatar.png'

  person = signal({
    name: 'jota',
    age: 29,
    img: 'https://w3schools.com/howto/img_avatar.png'
  });

  colorControl = new FormControl();

  widthControl = new FormControl(50, {
    nonNullable: true,
  });

  nameControl = new FormControl('jota', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

  constructor() {
    this.colorControl.valueChanges.subscribe(value => {
      console.log(value);
    })
  }

  clickHandler() {
    alert('Hello world!');
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
  }

  keydownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    console.log(input.value);
  }

  changeAge(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        age: parseInt(newValue, 10)
      }
    });
  }

  changeName(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        name: newValue
      }
    });
  }
}
