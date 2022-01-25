import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-profile-root',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  image: any;
  image_preview: any;

  constructor() { }

  updatePreview() {
    const src = URL.createObjectURL(this.image.files[0]);
    this.image_preview.src = src
  }

  ngOnInit(): void {
    this.image = document.getElementById("image");
    this.image_preview = document.getElementById("image-preview")
  }



}
