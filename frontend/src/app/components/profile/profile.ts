import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { FormsModule } from '@angular/forms'

import { webSocketService } from '../../service/websocket/websocket.service';


function randomName() {
  const names = ['Jack Sparrow','Barbe rousse','Barbe bleue','School king']
  return names[Math.floor(Math.random() * names.length)]
}

@Component({
  selector: 'app-profile',
  imports: [MatIconModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

    wsService = inject(webSocketService)

    editing = signal(false)
    name = signal("Jack")

    checkName(){
      console.log(this.name())
      if (!this.editing()) {
        this.editing.set(true)
        return
      }

      if (this.name().length <= 2) return

      this.wsService.sendName(this.name())

      this.editing.set(false)
    }
}
