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

  zoomIn(event?: MouseEvent) {
    if (this.zoomLevel < this.maxZoom) {
      // Store old dimensions
      const oldWidth = this.width;
      const oldHeight = this.height;

      // Increase zoom level
      this.zoomLevel += 1;
      this.zoomLevel = Math.min(this.zoomLevel, this.maxZoom);
      this.updateDimensions();

      // If an event is provided, adjust the position
      if (event) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const mouseX = event.clientX - rect.left; // X position within the element
        const mouseY = event.clientY - rect.top; // Y position within the element

        // Calculate the new position to keep the point under the cursor
        this.positionX -= (mouseX * this.width) / oldWidth - mouseX;
        this.positionY -= (mouseY * this.height) / oldHeight - mouseY;

        this.constrainPosition();
      }
    }
  }

  zoomOut(event?: MouseEvent) {
    if (this.zoomLevel > this.minZoom) {
      // Store old dimensions
      const oldWidth = this.width;
      const oldHeight = this.height;

      // Decrease zoom level
      this.zoomLevel -= 1;
      this.zoomLevel = Math.max(this.zoomLevel, this.minZoom);
      this.updateDimensions();

      // If an event is provided, adjust the position
      if (event) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const mouseX = event.clientX - rect.left; // X position within the element
        const mouseY = event.clientY - rect.top; // Y position within the element

        // Calculate the new position to keep the point under the cursor
        this.positionX -= (mouseX * this.width) / oldWidth - mouseX;
        this.positionY -= (mouseY * this.height) / oldHeight - mouseY;

        this.constrainPosition();
      }
    }
  }

  constrainPosition() {
    this.positionX = Math.min(0, this.positionX);
    this.positionX = Math.max(this.originalWidth - this.width, this.positionX);
    this.positionY = Math.min(0, this.positionY);
    this.positionY = Math.max(
      this.originalHeight - this.height,
      this.positionY
    );
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

  endPan() {
    this.panning = false;
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
