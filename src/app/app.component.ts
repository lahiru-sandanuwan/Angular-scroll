import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  zoomLevel: number = 1;
  maxZoom: number = 10;
  minZoom: number = 1;
  originalWidth: number = 1200; // Original width of the content
  originalHeight: number = 800; // Original height of the content
  width: number = 1200; // Current width
  height: number = 800; // Current height
  panning: boolean = false;
  startX: number = 0;
  startY: number = 0;
  positionX: number = 0;
  positionY: number = 0;

  zoomIn() {
    if (this.zoomLevel < this.maxZoom) {
      this.zoomLevel += 1;
      this.zoomLevel = Math.min(this.zoomLevel, this.maxZoom);
      this.updateDimensions();
    }
  }

  zoomOut() {
    if (this.zoomLevel > this.minZoom) {
      this.zoomLevel -= 1;
      this.zoomLevel = Math.max(this.zoomLevel, this.minZoom);
      this.updateDimensions();
    }
  }

  updateDimensions() {
    this.width = this.originalWidth * this.zoomLevel;
    this.height = this.originalHeight * this.zoomLevel;
  }

  startPan(event: MouseEvent) {
    event.preventDefault();
    if (this.zoomLevel > 1) {
      this.panning = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  }

  onPan(event: MouseEvent) {
    if (this.panning) {
      event.preventDefault();
      let deltaX = event.clientX - this.startX;
      let deltaY = event.clientY - this.startY;

      this.startX = event.clientX;
      this.startY = event.clientY;

      this.updatePosition(deltaX, deltaY);
    }
  }

  updatePosition(deltaX: number = 0, deltaY: number = 0) {
    this.positionX += deltaX;
    this.positionY += deltaY;

    // Constrain horizontally
    this.positionX = Math.min(0, this.positionX); // Prevent moving too far to the right
    this.positionX = Math.max(this.originalWidth - this.width, this.positionX); // Prevent moving too far to the left

    // Constrain vertically
    this.positionY = Math.min(0, this.positionY); // Prevent moving too far down
    this.positionY = Math.max(
      this.originalHeight - this.height,
      this.positionY
    );
  }

  endPan() {
    this.panning = false;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === '=' || event.key === '+') {
      this.zoomIn();
    } else if (event.key === '-' || event.key === '_') {
      this.zoomOut();
      this.updatePosition();
    }
  }
}
